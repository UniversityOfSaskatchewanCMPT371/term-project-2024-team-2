import DataLayer, { BatchedDataStream } from '../../src/data/DataLayer';
import Column, { DataColumn } from '../../src/repository/Column';

/**
 * Test Hook for DataLayer.
 *
 * The PrivilegedDataLayer improves testability by publicising certain protected methods from
 * DataLayer that could not be tested otherwise.
 */
export default class PrivilegedDataLayer extends DataLayer {
  public static override transposeData(batchItems: BatchedDataStream) {
    return super.transposeData(batchItems);
  }

  public static override calculateColumnStatistics(
    column: Column<DataColumn>,
    columnName: string,
  ) {
    return super.calculateColumnStatistics(column, columnName);
  }
}
