import DataPoint from './DataPoint';
import Column, { ColumnType, DataColumn, StatsColumn } from './Column';

// The repository interface defines operations that can be
// done to/on the db.
export interface Repository {
  getPoints: (qualifyingPointOnly : boolean,
    columnXName: string,
    columnYName: string,
    columnZName: string) => Promise<Array<DataPoint>>;
  addColumn: (column: Column<DataColumn | StatsColumn>, columnType: ColumnType) => Promise<string>;
  addToExistingColumn: (column: Column<DataColumn | StatsColumn>) => Promise<string>;
}
