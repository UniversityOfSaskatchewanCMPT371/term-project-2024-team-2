// eslint-disable-next-line import/no-cycle
import { BatchedDataStream } from './DataLayer';

/**
 * The DataAbstractor interface defines a set of common operations available to the Data
 * Abstraction Layer.
 */
export default interface DataAbstractor {
  getAvailableFields: () => Promise<string[]>;
  storeCSV: (batchItems: BatchedDataStream) => Promise<boolean>;
  storePCA: () => Promise<boolean>;
  selectAxes: (columnXName: string, columnYName: string, columnZName: string) => Promise<boolean>;
  selectPCA: (columnXName: string, columnYName: string, columnZName: string) => Promise<boolean>;
  calculateStatistics:() => Promise<boolean>;
}
