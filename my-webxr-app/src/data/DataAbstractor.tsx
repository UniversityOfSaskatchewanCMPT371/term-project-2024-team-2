import DataPoint from '../repository/DataPoint';
// eslint-disable-next-line import/no-cycle
import DataLayer from './DataLayer';

/**
 * The DataAbstractor interface defines a set of common operations available to the Data
 * Abstraction Layer.
 */
export default interface DataAbstractor {
  getAvailableFields: () => Promise<string[]>;
  getAllPcaColumnNames: () => Promise<string[]>;
  getAllNumericRawColumnNames: () => Promise<string[]>;
  storeCSV: (batchItems: Array<Array<string> | Array<number>>) => Promise<boolean>;
  storePCA: (columnNames: string[]) => Promise<boolean>;
  calculateStatistics:() => Promise<boolean>;
  createDataPointsFrom3Columns: (
    columnX: string,
    ColumnY: string,
    ColumnZ: string,
  ) => Promise<DataPoint[]>;
  storeStandardizedData:() => Promise<boolean>;
}

export const getDatabase = () => new DataLayer('CsvDataBase') as DataAbstractor;
