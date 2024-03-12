import { DataAbstractor } from './DataAbstractor';
import { Repository } from '../repository/Repository';
import DbRepository from '../repository/DbRepository';
import DataPoint from '../repository/DataPoint';

/**
 * The Data Layer provides a set of methods for working with CSV and PCA data.
 */
export default class DataLayer implements DataAbstractor {
  // @ts-expect-error temp disable
  private repository: Repository;

  /**
   * Create a new Data Layer instance.
   * @param dbName (optional) the name of the Data Repository.
   * @private
   */
  private constructor(dbName?: string) {
    this.repository = new DbRepository(dbName ?? 'DAL_DB');
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
  async storeCSV() {
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
