import DataAbstractor from './DataAbstractor';
import { Repository } from '../repository/Repository';
import DbRepository from '../repository/DbRepository';
import Column, {
  ColumnType, DataColumn, DataRow, StatsColumn,
} from '../repository/Column';

/**
 * The Data Layer provides a set of methods for working with CSV and PCA data.
 */
export default class DataLayer implements DataAbstractor {
  private repository: Repository;

  /**
   * Create a new Data Layer instance.
   * @param dbName (optional) the name of the Data Repository.
   */
  constructor(dbName?: string) {
    this.repository = new DbRepository(dbName ?? 'DAL_DB');
  }

  /**
   * Transport a stream of batched data to be referenced column-wise instead of row-wise.
   *
   * @param batchItems A 2D array of CSV data that is referenced by row.
   * @returns batchItems transposed to be referenced by column instead of by row.
   * @protected
   */
  protected static transposeData(batchItems: BatchedDataStream) {
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
 * Calculate the statistics for a set of data. Items that are not a number are treated as 0.
 * This method retrieves all column names from the repository, then for each column, it calculates
 * the count, sum, sum of squares, mean, and standard deviation. It then creates a new StatsColumn
 * object and adds it to the repository.
 *
 * @returns {Promise<boolean>} A promise that resolves to true if the operation was successful,
 * false otherwise.
 */
  async calculateStatistics(): Promise<boolean> {
    try {
      const rawColumnNames = await this.repository.getAllColumnNames();

      // eslint-disable-next-line no-restricted-syntax
      for (const columnName of rawColumnNames) {
        // Retrieve the column data from the repository
        // eslint-disable-next-line no-await-in-loop
        const column = await this.repository.getDataColumn(columnName, ColumnType.RAW);

        const numberedItems = column.values.map((item) => ((typeof item === 'number') ? item : 0));

        const count = numberedItems.length;
        const sum = numberedItems.reduce((runningTotal, x) => runningTotal + x, 0);
        const sumOfSquares = numberedItems.reduce((runningTotal, x) => runningTotal + x ** 2, 0);
        const mean = sum / ((count !== 0) ? count : 1);
        const stdDev = (
          (count >= 2)
            ? (Math.sqrt(((sumOfSquares / ((count !== 0) ? count : 1)) - (mean ** 2))))
            : 0
        );

        const statsColumn = new Column<StatsColumn>(columnName, {
          count,
          sum,
          sumOfSquares,
          mean,
          stdDev,
        });

        // eslint-disable-next-line no-await-in-loop
        await this.repository.addColumn(statsColumn, ColumnType.STATS);
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
 * Retrieve the available fields (column headers) from the data repository.
 * This method calls the `getAllColumnNames` method of the `Repository` instance.
 *
 * @returns {Promise<string[]>} A promise that resolves to an array of column names.
 */
  async getAvailableFields(): Promise<string[]> {
    return this.repository.getAllColumnNames();
  }

  /**
   * WIP
   */
  // temp disable
  // eslint-disable-next-line class-methods-use-this
  async storeCSV(batchItems: BatchedDataStream) {
    const transposedData = DataLayer.transposeData(batchItems);
    // @ts-expect-error temp disable
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const itemsStats = DataLayer.calculateStatistics(transposedData);

    // TODO: Find a way to deal with partial columns
    transposedData.forEach((column) => {
      this.repository.addColumn(
        new Column<DataColumn>(
          String(column[0]),
          column.slice(1),
        ),
        ColumnType.RAW,
      );
    });
    return Promise.resolve(true);
  }

  /**
   * need to clauclate satandreized data for each column
   */
  // temp disable
  // eslint-disable-next-line class-methods-use-this
  async storePCA() {
    return Promise.resolve(true);
  }

  /**
   * WIP
   * slect a clumn for a axis return data poiunt of the whole volumn
   */
  // temp disable
  // eslint-disable-next-line class-methods-use-this
  async selectAxes() {
    return Promise.resolve(true);
  }

  /**
   * WIP
   * slect a pca cplumn fo an axis
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
