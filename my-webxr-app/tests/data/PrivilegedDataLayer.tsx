import DataLayer from '../../src/data/DataLayer';
import Column, { NumericColumn } from '../../src/repository/Column';
import { BatchedDataStream } from '../../src/utils/CsvUtils';

/**
 * Test Hook for DataLayer.
 *
 * The PrivilegedDataLayer improves testability by publicising certain protected methods from
 * DataLayer that could not be tested otherwise.
 */
export default class PrivilegedDataLayer extends DataLayer {
  public getInternalRepository() {
    return this.repository;
  }

  public static override transposeData(batchItems: BatchedDataStream) {
    return super.transposeData(batchItems);
  }

  public static override calculateColumnStatistics(
    column: Column<NumericColumn>,
    columnName: string,
  ) {
    return super.calculateColumnStatistics(column, columnName);
  }
}
