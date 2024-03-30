import * as assert from 'assert';
import { Matrix } from 'ml-matrix';
// eslint-disable-next-line import/no-cycle
import DataAbstractor from './DataAbstractor';
import { Repository } from '../repository/Repository';
import DbRepository from '../repository/DbRepository';
import Column, {
  TableName,
  NumericColumn,
  RawColumn,
  StatsColumn,
} from '../repository/Column';
import { computeCovariancePCA } from '../utils/PcaCovariance';
import DataPoint from '../repository/DataPoint';

/**
 * The Data Layer provides a set of methods for working with CSV and PCA data.
 */
export default class DataLayer implements DataAbstractor {
  protected repository: Repository;

  protected isFirstBatch: boolean;

  /**
   * Create a new Data Layer instance.
   * @pre-condition None
   * @post-condition A new data layer to interact with is created
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
   * @pre-condition
   *    - batchItems: a row-wise declaration of input data, (ie. batchedItems[0] is the first row)
   * @post-condition A column-wise declaration of the input data
   * `    (ie. transposeData(batchedItems)[0] is the first column)
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
   * @pre-condition
   *    - batchItems: a row-wise declaration of input data, (ie. batchedItems[0] is the first row)
   * @post-condition the data is stored column-wise
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
          columnName = String(column[0]); // Type cast numeric field header to string
          // Once we get the header out, the rest of the column should be numeric ot string
          newValues = column.slice(1) as RawColumn;
          const aColumn = new Column<RawColumn>(columnName, newValues);
          await this.repository.addColumn(aColumn, TableName.RAW);
        } else {
          const columnNames = await this.repository.getCsvColumnNames();
          columnName = columnNames[index];
          newValues = column as RawColumn;
          const existingColumn = await this.repository.getColumn(columnName, TableName.RAW);
          (existingColumn.values as (string | number)[]).push(...newValues);
          await this.repository.updateColumn(existingColumn, TableName.RAW);
        }
      });
      await Promise.all(promises);

      this.isFirstBatch = false;

      return true;
    } catch (error) {
      // Logging the error here
      return Promise.resolve(false);
    }
  }

  /**
   * Helper function for calculateStatistics()
   *
   * Calculate the statistical values for a given column.
   * @pre-condition Column values are array of numbers.
   * @post-condition A Column of the same name but storing the
   *    [count, sum, sumOfSquares, mean, standard deviation] of the original data
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
   *
   * @pre-condition The raw data table is not empty.
   * @post-condition The statistics for each column are calculated and stored in their own
   *    data table
   * @returns {Promise<boolean>} A promise that resolves to `true` if the operation was successful,
   * and `false` otherwise.
   * @throws {Error} If the raw data table in the repository is empty or if an error occurs during
   * the operation, the function will catch the error and return a promise that resolves to `false`.
   */
  async calculateStatistics(): Promise<boolean> {
    try {
      const isEmpty = await this.repository.isTableEmpty(TableName.RAW);
      assert.ok(!isEmpty, 'Raw table is empty, can not calculate statistics.');
      const rawColumnNames = await this.repository.getCsvColumnNames();

      // eslint-disable-next-line consistent-return -- return undefined if column is not numeric
      const statsColumnsPromises = rawColumnNames.map(async (columnName) => {
        const rawDataColumn = await this.repository.getColumn(columnName, TableName.RAW);
        assert.ok(rawDataColumn.values.length > 0, 'Column values must not be empty');

        // Check if is a numeric column
        if (typeof rawDataColumn.values[0] === 'number') {
          const numericRawColumn = rawDataColumn as Column<NumericColumn>;
          const statsColumn = DataLayer.calculateColumnStatistics(numericRawColumn, columnName);
          await this.repository.addColumn(statsColumn, TableName.STATS);
          return statsColumn;
        }
      });

      await Promise.all(statsColumnsPromises);
      return true;
    } catch (error) {
      // Logging the error here
      return Promise.resolve(false);
    }
  }

  /**
   * Retrieve the available fields (column headers) from stats data table and pca data table.
   * Intended to be used for user to select which fields to plot
   *
   * @pre-condition None
   * @post-condition Returns the column with data that can be plotted
   * @returns {Promise<string[]>} A promise that resolves to an array of column names.
   */
  async getAvailableFields(): Promise<string[]> {
    const statsNames = await this.repository.getStatsColumnNames();
    const pcaNames = await this.repository.getPcaColumnNames();
    return [...statsNames, ...pcaNames];
  }

  /**
   * Retrieve the all column names from PCA table
   * Intend use for user to select which 3 PCA columns to be plotted.
   *
   * @pre-condition None
   * @post-condition Gets the names of the columns in the PCA stats table
   * @returns {Promise<string[]>} A promise that resolves to an array of column names.
   */
  async getAllPcaColumnNames(): Promise<string[]> {
    return this.repository.getPcaColumnNames();
  }

  /**
   * Retrieve all the numeric column names in Raw/CSV data.
   * Intended to be used for user to select which 3 Raw columns to be plotted.
   *
   * @pre-condition - Stat table contains only and the names of all numeric Raw/CSV columns.
   * @post-condition Returns the names of the raw data columns
   * @returns {Promise<string[]>} A promise that resolves to an array of column names.
   */
  async getAllNumericRawColumnNames(): Promise<string[]> {
    return this.repository.getStatsColumnNames();
  }

  /**
   * Helper for storeStandardizedData()
   * This function standardizes a specified numeric column in the repository.
   *
   * This function takes the name of a numeric column, retrieves the corresponding raw data column
   * and stats column. For each entry in the raw data column, it standardizes the data using the
   * mean and standard deviation from the stats column.
   *
   * @pre-condition
   * - Column name is in look up table (stats table).
   * - Corresponding column name in raw data table is numeric, which must be true.
   * @post-condition calculates a standardized (zero-centered with standatd deviation of 1)
   *    transformation of the raw data
   * @param {string} columnName - The name of the numeric column to be standardized.
   * @return {Promise<Column<NumericColumn>>} A promise that resolves to a Column object containing
   * the standardized data.
   * @throws {Error} If the column is not numeric, an error will be thrown.
   */
  async standardizeColumn(columnName: string): Promise<Column<NumericColumn>> {
    const statsColumn = await this.repository.getStatsColumn(columnName);
    const { mean } = statsColumn.values;
    const { stdDev } = statsColumn.values;
    const rawDataColumn = await this.repository.getColumn(columnName, TableName.RAW);

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
   * @pre-condition None
   * @post-condition All numeric raw data columns are standardized and stored in the standardized
   *    data table
   * @returns {Promise<boolean>} A promise that resolves to `true` if the operation was successful,
   * and `false` otherwise.
   * @throws {Error} If the stats table is empty or if an error occurs during the operation.
   */
  async storeStandardizedData(): Promise<boolean> {
    try {
      const isEmpty = await this.repository.isTableEmpty(TableName.STATS);
      assert.ok(!isEmpty, 'Stats table is empty, can not pull numeric columns.');
      const columnNames = await this.repository.getStatsColumnNames();

      const promises = columnNames.map(async (name) => {
        const standardizedColumn = await this.standardizeColumn(name);
        await this.repository.addColumn(standardizedColumn, TableName.STANDARDIZED);
      });

      await Promise.all(promises);
      return true;
    } catch (error) {
      // Logging the error here
      return Promise.resolve(false);
    }
  }

  /**
   * Retrieves column data for PCA calculation, either raw or standardized.
   * Helper for calculatePca()
   *
   * This function accepts an array of column names, retrieves the corresponding data from table for
   * each column based on the specified table name, and returns a new Matrix instance with the
   * retrieved data.
   *
   * We can retrieve from either the raw or standardized table as some PCA methods require
   * standardized data and some do not.
   *
   * The Matrix size could be too large and exceed the memory limit. TODO handle this case.
   *
   * If an error occurs during the operation (e.g., a column does not exist, table empty), the
   * function will catch the error and return an empty Matrix.
   * @pre-codition - Columns are in the table, either RAW or STANDARDIZED.
   * @post-condition returns a promise that resolves to a Matrix instance containing the
   * retrieved data.
   * @param {string[]} columnNames - The names of the columns to retrieve data for.
   * @param {TableName} tableName - The name of the table to pull columns (RAW or STANDARDIZED).
   * @returns {Promise<Matrix>} A promise that resolves to a Matrix instance containing the
   * retrieved data.
   * @throws {Error} If the table name is neither RAW nor STANDARDIZED.
   */
  async getColumnsForPca(
    columnNames: string[],
    tableName: TableName,
  ): Promise<Matrix> {
    if (tableName !== TableName.RAW && tableName !== TableName.STANDARDIZED) {
      throw new Error('Invalid column type. Must be either RAW or STANDARDIZED.');
    }

    try {
      const columnDataArray: number[][] = [];

      // Assume all the columns are numeric
      const promises = columnNames.map((columnName) => this.repository
        .getColumn(columnName, tableName)
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
   * Helper for storePCA()
   *
   * This function retrieves standardized data for the specified columns, calculates the covariance
   * matrix of the standardized data, and computes the eigenvectors of the covariance matrix. It
   * then returns the standardized data projected onto the space spanned by the eigenvectors.
   *
   * If an error occurs during the operation (e.g., the raw or standardized data is empty), the
   * function will catch the error and return an empty Matrix.
   *
   * @pre-condition Column names are in the table, both raw and standardized.
   * @post-condition Returns a matrix of PCA transformed data, or an empty matrix if there was an
   *    error
   * @param {string[]} columnNames - The names of the columns to perform PCA on.
   * @returns {Promise<Matrix>} A promise that resolves to a Matrix instance containing the
   * PCA-transformed data.
   * @throws {Error} If the raw or standardized data is empty.
   */
  async calculatePCA(columnNames: string[]): Promise<Matrix> {
    try {
      const standardizedData = await this.getColumnsForPca(columnNames, TableName.STANDARDIZED);
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
   * @pre-condition the columnNames are in the data store
   * @post-condition the results from running PCA on the column subset are stored in their data
   *    table
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
          return this.repository.addColumn(columnData, TableName.PCA);
        });
        await Promise.all(promises);
      }
      return true;
    } catch (error) {
      // Logging the error here
      return Promise.resolve(false);
    }
  }

  /**
   * This function retrieves data points from the repository based on the provided column names
   * and table name.
   *
   * @pre-condition There exists a data column with a key matching hte provided names in the
   *    data-store
   * @post-condition Returns an array of data points associated with the provided column names
   * @param {string} columnX - The name of the column to be used for the x-axis values.
   * @param {string} columnY - The name of the column to be used for the y-axis values.
   * @param {string} columnZ - The name of the column to be used for the z-axis values.
   * @param {TableName} tableName - The type of the table (RAW or PCA).
   *
   * @returns {Promise<DataPoint[]>} A promise that resolves to an array of DataPoint objects.
   * Each DataPoint object represents a point in a 3D space with x, y, and z coordinates.
   */
  public async createDataPointsFrom3Columns(
    columnX: string,
    columnY: string,
    columnZ: string,
    tableName: TableName,
  ): Promise<DataPoint[]> {
    return this.repository.getPoints(columnX, columnY, columnZ, tableName);
  }

  /**
   * This function retrieves the values for a given column from the raw or pca table.
   *
   * This assumes the column relives are numeric from raw table is numeric
   *
   * @pre-condition a data column of numeric data with the given names is stored in the provided
   *    table
   * @post-condition an array of data associated with the column
   * @param {string} columnName - The name of the column to retrieve values for.
   * @param {TableName} tableName - The name of table (RAW or PCA).
   * @returns {Promise<NumericColumn>} A promise that resolves to a NumericColumn object.
   */
  public async getColumnValues(columnName: string, tableName: TableName): Promise<NumericColumn> {
    return this.repository.getColumn(columnName, tableName)
      .then((column) => column.values as number[]);
  }

  // TODO add function to calculate and store variance explained by each PC? maybe not needed

  /**
 * Resets the flag to indicate if it is the first batch.
 * @param {void} - No parameters.
 * @postcondition - The flag is reset to true.
 * @returns {Promise<boolean>} - A promise that resolves when the flag is reset.
 */
  public async resetFlag(): Promise<boolean> {
    this.repository.clearTables();
    this.isFirstBatch = true;
    return true;
  }
}

/**
 * The BatchedDataStream type is used for streaming in batches of data from CSV parsing.
 */
export type BatchedDataStream = Array<Array<string | number>>;
