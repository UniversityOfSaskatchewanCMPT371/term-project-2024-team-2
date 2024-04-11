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
  storeCSV: (batchItems: Array<Array<string | number>>) => Promise<boolean>;
  storePCA: (columnNames: string[]) => Promise<boolean>;
  calculateStatistics:() => Promise<boolean>;
  createDataPointsFrom3Columns: (
    columnX: string,
    ColumnY: string,
    ColumnZ: string,
    OptionalColumn1?: string,
    OptionalColumn2?: string,
    OptionalColumn3?: string,
    OptionalColumn4?: string,
    OptionalColumn5?: string,
    OptionalColumn6?: string,
    OptionalColumn7?: string,
  ) => Promise<[Array<DataPoint>, Array<number>]>,
  resetFlag: () => Promise<boolean>;
  storeStandardizedData:() => Promise<boolean>;
}

export const getDatabase = () => new DataLayer('CsvDataBase') as DataAbstractor;
