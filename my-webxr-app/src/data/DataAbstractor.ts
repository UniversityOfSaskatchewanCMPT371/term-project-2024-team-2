import DataPoint from '../repository/DataPoint';

export interface DataAbstractor {
  getAvailableFields: () => Promise<Array<DataPoint>>;
  storeCSV: (batchItems: Array<Array<string | number | null>>) => Promise;
  storePCA: (batchItems: Array<Array<string | number | null>>) => Promise;
  selectAxes: (columnXName: string, columnYName: string, columnZName: string) => Promise;
  selectPCA: (columnXName: string, columnYName: string, columnZName: string) => Promise;
}
