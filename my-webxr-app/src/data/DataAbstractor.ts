import DataPoint from '../repository/DataPoint';

export interface DataAbstractor {
  getAvailableFields: () => Promise<Array<DataPoint>>;
  storeCSV: (batchItems: Array<Array<string | number | null>>) => Promise<boolean>;
  storePCA: (batchItems: Array<Array<string | number | null>>) => Promise<boolean>;
  selectAxes: (columnXName: string, columnYName: string, columnZName: string) => Promise<boolean>;
  selectPCA: (columnXName: string, columnYName: string, columnZName: string) => Promise<boolean>;
}
