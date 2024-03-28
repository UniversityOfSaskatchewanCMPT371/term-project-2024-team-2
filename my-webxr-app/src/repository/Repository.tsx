import DataPoint from './DataPoint';
import Column, {
  TableName, NumericColumn, RawColumn, StatsColumn,
} from './Column';

// The repository interface defines operations that can be
// done to/on the db.
export interface Repository {
  getPoints: (columnXName: string | null,
    columnYName: string | null,
    columnZName: string | null,
    columnType: TableName) => Promise<Array<DataPoint>>;
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
}
