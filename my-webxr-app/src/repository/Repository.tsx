import DataPoint from './DataPoint';
import Column, {
  TableName, NumericColumn, RawColumn, StatsColumn,
} from './Column';

// The repository interface defines operations that can be
// done to/on the db.
// TODO swap over documentation
export interface Repository {
  getPoints: (
    columnXName: string,
    columnYName: string,
    columnZName: string,
    optionalColumn1Name?: string,
    optionalColumn2Name?: string,
    optionalColumn3Name?: string,
    optionalColumn4Name?: string,
    optionalColumn5Name?: string,
    optionalColumn6Name?: string,
    optionalColumn7Name?: string,
  ) => Promise<[Array<DataPoint>, Array<number>]>;
  addColumn: (column: Column<RawColumn | StatsColumn | NumericColumn>,
    columnType: TableName) => Promise<string>;
  getCsvColumnNames: () => Promise<string[]>;
  getStatsColumnNames: () => Promise<string[]>;
  getPcaColumnNames: () => Promise<string[]>;
  getColumn: (columnName: string,
    columnType: TableName) => Promise<Column<NumericColumn | RawColumn>>;
  updateColumn: (column: Column<NumericColumn | RawColumn>,
    columnType: TableName) => Promise<boolean>;
  getStatsColumn: (columnName: string) => Promise<Column<StatsColumn>>;
  isTableEmpty(columnType: TableName): Promise<boolean>;
  clearTables: () => Promise<void>;
}
