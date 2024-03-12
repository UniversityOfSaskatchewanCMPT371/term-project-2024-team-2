import DataAbstractor from './DataAbstractor';
import { Repository } from '../repository/Repository';
import DbRepository from '../repository/DbRepository';
import DataPoint from '../repository/DataPoint';

/**
 * The Data Layer provides a set of methods for working with CSV and PCA data.
 */
export default class DataLayer implements DataAbstractor {
  // @ts-expect-error temp ignore
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
   * @param batchItems A 2D array of CSV data that is referenced by row.
   * @protected
   */
  protected static transposeData(batchItems: Array<Array<string | number | null>>) {
    const rows = batchItems.length;
    const cols = batchItems[0].length;
    const grid: Array<Array<string | number | null>> = [];
    for (let j = 0; j < cols; j += 1) {
      grid[j] = Array(rows);
    }
    for (let i = 0; i < rows; i += 1) {
      for (let j = 0; j < cols; j += 1) {
        grid[j][i] = batchItems[i][j];
      }
    }
    return grid;
  }

  /**
   * Calculate the statistics for a set of data. Items that are not a number are treated as 0.
   * @param batchItems transposed data referenced column-wise.
   * @protected
   */
  protected static calculateStatistics(batchItems: Array<Array<string | number | null>>) {
    const statsArray: Array<NonNullable<unknown>> = [];
    batchItems.forEach((column) => {
      const numberedItems = column.map((item) => {
        if (typeof item === 'number') {
          return item;
        }
        return 0;
      });
      const count = numberedItems.length - 1;
      const sampleDev = numberedItems.reduce((runningTotal, x) => runningTotal + x, 0);
      const sampleStdDev = numberedItems.reduce((runningTotal, x) => runningTotal + x ** 2, 0);
      const mean = sampleDev / count;
      const stdDev = Math.sqrt((sampleStdDev / count) - (mean ** 2));
      statsArray.push({
        columnName: column[0], sampleDev, sampleStdDev, mean, stdDev,
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
  async storeCSV(batchItems: Array<Array<string | number | null>>) {
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
