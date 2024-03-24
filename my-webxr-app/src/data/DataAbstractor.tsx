/**
 * The DataAbstractor interface defines a set of common operations available to the Data
 * Abstraction Layer.
 */
export default interface DataAbstractor {
  getAvailableFields: () => Promise<string[]>;
  storeCSV: (batchItems: Array<Array<string> | Array<number>>) => Promise<boolean>;
  storePCA: () => Promise<boolean>;
  selectAxes: (columnXName: string, columnYName: string, columnZName: string) => Promise<boolean>;
  selectPCA: (columnXName: string, columnYName: string, columnZName: string) => Promise<boolean>;
  calculateStatistics:() => Promise<boolean>;
}
