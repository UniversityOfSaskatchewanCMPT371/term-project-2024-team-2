import RepoDataPoint from './RepoDataPoint';
import Column, {
  ColumnType, NumericColumn, RawColumn, StatsColumn,
} from './Column';

// The repository interface defines operations that can be
// done to/on the db.
export interface Repository {
  getPoints: (qualifyingPointOnly : boolean,
    columnXName: string,
    columnYName: string,
    columnZName: string) => Promise<Array<RepoDataPoint>>;
  addColumn: (column: Column<RawColumn | StatsColumn | NumericColumn>,
    columnType: ColumnType) => Promise<string>;
  getCsvColumnNames: () => Promise<string[]>;
  getStatsColumnNames: () => Promise<string[]>;
  getPcaColumnNames: () => Promise<string[]>;
  getColumn: (columnName: string,
    columnType: ColumnType) => Promise<Column<NumericColumn | RawColumn>>;
  updateColumn: (column: Column<NumericColumn | RawColumn>,
    columnType: ColumnType) => Promise<boolean>;
  getStatsColumn: (columnName: string) => Promise<Column<StatsColumn>>;
  isTableEmpty(columnType: ColumnType): Promise<boolean>;
}
