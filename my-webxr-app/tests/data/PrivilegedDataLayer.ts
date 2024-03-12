import DataLayer from '../../src/data/DataLayer';

/**
 * The PrivilegedDataLayer improves testability by publicising certain protected methods from
 * DataLayer that could not be tested otherwise.
 */
export default class PrivilegedDataLayer extends DataLayer {
  public static override transposeData(batchItems: Array<Array<string | number | null>>) {
    return super.transposeData(batchItems);
  }

  public static override calculateStatistics(batchItems: Array<Array<string | number | null>>) {
    return super.calculateStatistics(batchItems);
  }
}
