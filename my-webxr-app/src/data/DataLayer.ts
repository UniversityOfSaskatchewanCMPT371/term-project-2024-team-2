import DataAbstractor from './DataAbstractor';
import { Repository } from '../repository/Repository';
import DbRepository from '../repository/DbRepository';
import DataPoint from '../repository/DataPoint';

/**
 * The Data Layer provides a set of methods for working with CSV and PCA data.
 */
export default class DataLayer implements DataAbstractor {
  // @ts-expect-error temp ignore
  private statsData: Repository;

  // @ts-expect-error temp ignore
  private rawData: Repository;

  // @ts-expect-error temp ignore
  private standardizedData: Repository;

  // @ts-expect-error temp ignore
  private PcaData: Repository;

  /**
   * Create a new Data Layer instance.
   */
  constructor() {
    this.statsData = new DbRepository('STATS_DATA');
    this.rawData = new DbRepository('RAW_DATA');
    this.standardizedData = new DbRepository('STANDARDIZED_DATA');
    this.PcaData = new DbRepository('PCA_DATA');
  }

  /**
   * Transport a stream of batched data to be referenced column-wise instead of row-wise.
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
   * @param batchItems transposed data referenced column-wise.
   * @returns an array of ColumnStatistics for each column.
   * @protected
   */
  protected static calculateStatistics(batchItems: BatchedDataStream) {
    const statsArray: Array<ColumnStatistics> = [];

    batchItems.forEach((column) => {
      // Convert non-number types into 0 for the stats calculations.
      const numberedItems = column.slice(1).map((item) => ((typeof item === 'number') ? item : 0));

      const count = numberedItems.length;
      const sum = numberedItems.reduce((runningTotal, x) => runningTotal + x, 0);
      const sumOfSquares = numberedItems.reduce((runningTotal, x) => runningTotal + x ** 2, 0);
      const mean = sum / ((count !== 0) ? count : 1);
      const stdDev = (
        (count >= 2)
          ? (Math.sqrt(((sumOfSquares / ((count !== 0) ? count : 1)) - (mean ** 2))))
          : 0
      );

      statsArray.push({
        columnName: column[0], sum, sumOfSquares, mean, stdDev,
      });
    });

    return statsArray;
  }

  /**
   * WIP
   */
  // temp disable
  // eslint-disable-next-line class-methods-use-this
  async getAvailableFields() {
    return Promise.resolve([new DataPoint(false, 1, 2, 3)]);
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
    // this.repository.addColumn();
    return Promise.resolve(true);
  }

  /**
   * WIP
   */
  // temp disable
  // eslint-disable-next-line class-methods-use-this
  async storePCA() {
    return Promise.resolve(true);
  }

  /**
   * WIP
   */
  // temp disable
  // eslint-disable-next-line class-methods-use-this
  async selectAxes() {
    return Promise.resolve(true);
  }

  /**
   * WIP
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
export type BatchedDataStream = Array<Array<string | number | null>>;

/**
 * The ColumnStatistics type is used to represent all the statistical values for a given column.
 */
export type ColumnStatistics = {
  columnName: string | number | null;
  sum: number;
  sumOfSquares: number;
  mean: number;
  stdDev: number;
};
