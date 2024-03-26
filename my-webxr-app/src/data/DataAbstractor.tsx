import { ColumnType } from '../repository/Column';
import DataPoint from '../repository/DataPoint';

/**
 * The DataAbstractor interface defines a set of common operations available to the Data
 * Abstraction Layer.
 */
export default interface DataAbstractor {
  getAvailableFields: () => Promise<string[]>;
  storeCSV: (batchItems: Array<Array<string> | Array<number>>) => Promise<boolean>;
  storePCA: (columnNames: string[]) => Promise<boolean>;
  calculateStatistics:() => Promise<boolean>;
  createDataPointsFrom3Columns:(
    columnX: string,
    ColumnY: string,
    ColumnZ: string,
    columnType: ColumnType,
  ) => Promise<DataPoint[]>;
}
