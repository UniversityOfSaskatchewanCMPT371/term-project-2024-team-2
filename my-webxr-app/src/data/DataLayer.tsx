import * as assert from 'assert';
import { Matrix } from 'ml-matrix';
import DataAbstractor from './DataAbstractor';
import { Repository } from '../repository/Repository';
import DbRepository from '../repository/DbRepository';
import Column, {
  ColumnType, RawColumn, NumericColumn, DataRow, StatsColumn,
} from '../repository/Column';
import { computeCovariancePCA } from '../utils/PcaCovariance';

/**
 * The Data Layer provides a set of methods for working with CSV and PCA data.
 */
export default class DataLayer implements DataAbstractor {
  private repository: Repository;

  private isFirstBatch: boolean;

  /**
   * Create a new Data Layer instance.
   * @param dbName (optional) the name of the Data Repository.
   */
  constructor(dbName?: string) {
    this.repository = new DbRepository(dbName ?? 'DAL_DB');
    this.isFirstBatch = true;
  }

  /**
   * Transposes a 2D array of data. Helper function for storeCSV()
   *
   * This method takes a 2D array (batchItems) where the inner arrays represent rows of data,
   * and transposes it so that the inner arrays represent columns of data instead. This is useful
   * when you want to perform operations on columns of data rather than rows.
   *
   * @param {BatchedDataStream} batchItems - A 2D array of data where each inner array represents
   * a row.
   * @returns {BatchedDataStream} A 2D array where each inner array represents a column of the
   * original data.
   * @protected
   */
  protected static transposeData(batchItems: BatchedDataStream): BatchedDataStream {
    const rows = batchItems.length;
    const cols = batchItems[0]?.length ?? 0;
    const transposedItems: BatchedDataStream = [];
    for (let j = 0; j < cols; j += 1) {
      transposedItems[j] = Array(rows);
    }
    for (let i = 0; i < rows; i += 1) {
      for (let j = 0; j < cols; j += 1) {
        transposedItems[j][i] = batchItems[i][j];
      }
    }
    return transposedItems;
  }

  /**
   * Asynchronously stores a batch of CSV data in the repository.
   *
   * This method transposes the csv data, so it can be referenced by column instead of by row.
   * For each column in the transposed data, it retrieves the existing column from the repository
   * and appends the new values to it. If the column doesn't exist in the repository, it creates a
   * new one.
   *
   * If any error occurs during the operation, the method catches the error and returns `false`.
   *
   * @param {BatchedDataStream} batchItems - A 2D array of CSV data that is referenced by row.
   * @returns {Promise<boolean>} A promise that resolves to `true` if the operation was successful,
   * and `false` otherwise.
   *
   * TODO reset the flag every when user load a different csv file
   */

  async storeCSV(batchItems: BatchedDataStream): Promise<boolean> {
    try {
      const transposedData = DataLayer.transposeData(batchItems);

      const promises = transposedData.map(async (column, index) => {
        let columnName: string;
        let newValues: RawColumn;

        if (this.isFirstBatch) {
          columnName = String(column[0]);
          newValues = column.slice(1);
          const aColumn = new Column<RawColumn>(columnName, newValues);
          await this.repository.addColumn(aColumn, ColumnType.RAW);
        } else {
          const columnNames = await this.repository.getCsvColumnNames();
          columnName = columnNames[index];
          newValues = column;
          const existingColumn = await this.repository.getColumn(columnName, ColumnType.RAW);
          (existingColumn.values as (string | number)[]).push(...newValues);
          await this.repository.updateColumn(existingColumn, ColumnType.RAW);
        }
      });
      await Promise.all(promises);

      this.isFirstBatch = false;

      return true;
    } catch (error) {
      return Promise.resolve(false);
    }
  }

  /**
   * Helper function for calculateStatistics()
   *
   * Calculate the statistical values for a given column. This assumes that all values in the
   * column are numbers.
   *
   * @param {Column<NumericColumn>} column The column of data to calculate statistics for.
   * @param {string} columnName The name of the column.
   * @returns {Column<StatsColumn>} containing the statistical values.
   * @protected
   */
  protected static calculateColumnStatistics(
    column: Column<NumericColumn>,
    columnName: string,
  ): Column<StatsColumn> {
    assert.ok(column.values.length > 0, `Column ${columnName} must have at least one value`);

    const count = column.values.length;
    const sum = (column.values).reduce((runningTotal, x) => runningTotal + x, 0);
    const mean = sum / ((count !== 0) ? count : 1);
    // eslint-disable-next-line max-len
    const sumOfSquares = (column.values).reduce((runningSum, x) => runningSum + (x - mean) ** 2, 0);
    // Note this is sample standard deviation
    const stdDev = (
      (count >= 2)
        ? (Math.sqrt(sumOfSquares / (count - 1)))
        : 0
    );

    return new Column<StatsColumn>(columnName, {
      count,
      sum,
      sumOfSquares,
      mean,
      stdDev,
    });
  }

  /**
   * Asynchronously calculates and stores statistics for each column in the repository.
   *
   * This function retrieves all column names from the repository. For each raw column, it retrieves
   * the data, check if the data are all numeric, calculates statistics, and adds a new statistic
   * column to the Look-up table (stats table) in the repository.
   * This assumes the column is not empty
   *
   *
   * @returns {Promise<boolean>} A promise that resolves to `true` if the operation was successful,
   * and `false` otherwise.
   * @throws {Error} If the raw data table in the repository is empty or if an error occurs during
   * the operation, the function will catch the error and return a promise that resolves to `false`.
   */
  async calculateStatistics(): Promise<boolean> {
    try {
      const isEmpty = await this.repository.isTableEmpty(ColumnType.RAW);
      assert.ok(!isEmpty, 'Raw table is empty, can not calculate statistics.');
      const rawColumnNames = await this.repository.getCsvColumnNames();

      // eslint-disable-next-line consistent-return -- return undefined if column is not numeric
      const statsColumnsPromises = rawColumnNames.map(async (columnName) => {
        const rawDataColumn = await this.repository.getColumn(columnName, ColumnType.RAW);
        assert.ok(rawDataColumn.values.length > 0, 'Column values must not be empty');

        // Check if is a numeric column
        if (typeof rawDataColumn.values[0] === 'number') {
          const numericRawColumn = rawDataColumn as Column<NumericColumn>;
          const statsColumn = DataLayer.calculateColumnStatistics(numericRawColumn, columnName);
          await this.repository.addColumn(statsColumn, ColumnType.STATS);
          return statsColumn;
        }
      });

      await Promise.all(statsColumnsPromises);
      return true;
    } catch (error) {
      return Promise.resolve(false);
    }
  }

  /**
   * Retrieve the available fields (column headers) from stats data table and pca data table.
   * Intended to be used for user to select which fields to plot
   *
   * @returns {Promise<string[]>} A promise that resolves to an array of column names.
   */
  async getAvailableFields(): Promise<string[]> {
    const statsNames = await this.repository.getStatsColumnNames();
    const pcaNames = await this.repository.getPcaColumnNames();
    return [...statsNames, ...pcaNames];
  }

  /**
   * Helper for storeStandardizedData()
   * This function standardizes a specified numeric column in the repository.
   *
   * This function takes the name of a numeric column, retrieves the corresponding raw data column
   * and stats column. For each entry in the raw data column, it standardizes the data using the
   * mean and standard deviation from the stats column.
   *
   * This assumes if a column name is in look up table (stats table) then the column data are
   * numeric in the raw data table
   *
   * @param {string} columnName - The name of the numeric column to be standardized.
   * @return {Promise<Column<NumericColumn>>} A promise that resolves to a Column object containing
   * the standardized data.
   * @throws {Error} If the column is not numeric, an error will be thrown.
   */
  async standardizeColumn(columnName: string): Promise<Column<NumericColumn>> {
    const statsColumn = await this.repository.getStatsColumn(columnName);
    const { mean } = statsColumn.values;
    const { stdDev } = statsColumn.values;
    const rawDataColumn = await this.repository.getColumn(columnName, ColumnType.RAW);

    assert.ok(typeof rawDataColumn.values[0] === 'number', 'Column must be numeric to be standardized');
    const numericalRawDataColumn = rawDataColumn as Column<NumericColumn>;
    numericalRawDataColumn.values = numericalRawDataColumn.values.map(
      (value) => (value - mean) / stdDev,
    );
    return new Column<NumericColumn>(columnName, numericalRawDataColumn.values);
  }

  /**
   * This function retrieves all numeric columns from the Look-Up Table (Stats table), standardizes
   * them, and writes the standardized data as column back to the standardizedDataTable.
   *
   * @returns {Promise<boolean>} A promise that resolves to `true` if the operation was successful,
   * and `false` otherwise.
   * @throws {Error} If the stats table is empty or if an error occurs during the operation.
   */
  async storeStandardizedData(): Promise<boolean> {
    try {
      const isEmpty = await this.repository.isTableEmpty(ColumnType.STATS);
      assert.ok(!isEmpty, 'Stats table is empty, can not pull numeric columns.');
      const columnNames = await this.repository.getStatsColumnNames();

      const promises = columnNames.map(async (name) => {
        const standardizedColumn = await this.standardizeColumn(name);
        await this.repository.addColumn(standardizedColumn, ColumnType.STANDARDIZED);
      });

      await Promise.all(promises);
      return true;
    } catch (error) {
      return Promise.resolve(false);
    }
  }

  // TODO: query column names from stats table for PCA and let user choose subset to do pca on

  /**
   * Retrieves column data for PCA calculation. (Raw data or standardized data columns)
   *
   * This function accepts an array of column names, retrieves the corresponding data for each
   * column based on the specified column type, and returns a new Matrix instance with the retrieved
   * data.
   *
   * The Matrix size could be too large and exceed the memory limit. TODO handle this case.
   *
   * If an error occurs during the operation (e.g., a column does not exist, table empty), the
   * function will catch the error and return an empty Matrix.
   *
   * @param {string[]} columnNames - The names of the columns to retrieve data for.
   * @param columnType
   * @returns {Promise<Matrix>} A promise that resolves to a Matrix instance containing the
   * retrieved data.
   *
   * @throws {Error} If the columnType is not RAW or STANDARDIZED.
   */
  async getColumnsForPca(
    columnNames: string[],
    columnType: ColumnType,
  ): Promise<Matrix> {
    if (columnType !== ColumnType.RAW && columnType !== ColumnType.STANDARDIZED) {
      throw new Error('Invalid column type. Must be either RAW or STANDARDIZED.');
    }

    try {
      const columnDataArray: number[][] = [];

      // Assume all the columns are numeric
      const promises = columnNames.map((columnName) => this.repository
        .getColumn(columnName, columnType)
        .then((columnData) => columnDataArray.push(columnData.values as number[])));
      await Promise.all(promises);

      // Push method pushes a column values as row, so we need to transpose the data to get
      // them back to column
      return new Matrix(columnDataArray).transpose();
    } catch (error) {
      // Logging the error here
      return new Matrix([]);
    }
  }

  /**
   * Performs Principal Component Analysis (PCA) on the specified columns using covariance method.
   *
   * This function retrieves standardized data for the specified columns, calculates the covariance
   * matrix of the standardized data, and computes the eigenvectors of the covariance matrix. It
   * then returns the standardized data projected onto the space spanned by the eigenvectors.
   *
   * If an error occurs during the operation (e.g., the raw or standardized data is empty), the
   * function will catch the error and return an empty Matrix.
   *
   * @param {string[]} columnNames - The names of the columns to perform PCA on.
   * @returns {Promise<Matrix>} A promise that resolves to a Matrix instance containing the
   * PCA-transformed data.
   * @throws {Error} If the raw or standardized data is empty.
   */
  async calculatePCA(columnNames: string[]): Promise<Matrix> {
    try {
      const standardizedData = await this.getColumnsForPca(columnNames, ColumnType.STANDARDIZED);
      if (standardizedData.rows === 0 || standardizedData.columns === 0) {
        throw new Error('Standardized data is empty');
      }
      return computeCovariancePCA(standardizedData);
    } catch (error) {
      // Logging the error here
      return new Matrix(0, 0);
    }
  }

  /**
   * This function performs Principal Component Analysis (PCA) on the specified columns and stores
   * the result back to the repository (PCA table).
   *
   * The PCA-transformed Matrix is split into columns, each representing a Principal Component, and
   * named as "PC1", "PC2", ..., "PCn", where "PC1" is the most significant Principal Component and
   * "PCn" is the least significant.
   *
   * Each column is then written back to the repository.
   *
   * @param {string[]} columnNames - The names of the columns to perform PCA on.
   * @returns {Promise<boolean>} A promise that resolves to `true` if the operation was successful,
   * and `false` otherwise.
   * @throws {Error} If an error occurs during the operation.
   */
  async storePCA(columnNames: string[]): Promise<boolean> {
    try {
      if (columnNames) {
        const pcaMatrix = await this.calculatePCA(columnNames);

        // Split the matrix into columns
        const columns: NumericColumn[] = pcaMatrix.transpose().to2DArray();

        // Write each column to the repository
        const promises = columns.map((column, i) => {
          const columnName = `PC${i + 1}`;
          const columnData = new Column<NumericColumn>(columnName, column);
          return this.repository.addColumn(columnData, ColumnType.PCA);
        });
        await Promise.all(promises);
      }
      return true;
    } catch (error) {
      // Logging the error here
      return false;
    }
  }

  // TODO add function to calculate and store variance explained by each PC?

  /**
   * TODO
   * Select a raw data column or PCA column from the repository for graphing
   */
  // temp disable
  // eslint-disable-next-line class-methods-use-this
  async selectAxes() {
    return Promise.resolve(true);
  }

  /**
   * TODO
   * Select a PCA column from the repository
   */
  // temp disable
  // eslint-disable-next-line class-methods-use-this
  async selectPCA() {
    return Promise.resolve(true);
  }
}

/**
 * The BatchedDataStream type is used for streaming in batches of data from CSV parsing.
 */
export type BatchedDataStream = Array<DataRow>;
