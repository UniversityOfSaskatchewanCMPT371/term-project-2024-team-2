import DataLayer, { BatchedDataStream } from '../../src/data/DataLayer';

/**
 * The PrivilegedDataLayer improves testability by publicising certain protected methods from
 * DataLayer that could not be tested otherwise.
 */
export default class PrivilegedDataLayer extends DataLayer {
  public static override transposeData(batchItems: BatchedDataStream) {
    return super.transposeData(batchItems);
  }
}
