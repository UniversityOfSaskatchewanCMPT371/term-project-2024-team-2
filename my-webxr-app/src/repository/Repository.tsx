import DataPoint from './DataPoint';
import Column from './Column';

// The repository interface defines operations that can be
// done to/on the db.
export interface Repository {
  getPoints: (qualifyingPointOnly: boolean,
    columnXName: string,
    columnYName: string,
    columnZName: string) => Promise<Array<DataPoint>>;
  addColumn: (column: Column) => Promise<string>;

  getPossibleAxes: () => Promise<string[]>;

  selectRepresentingColumn: (xName: string, yName: string, zName: string) => Promise<Column[]>

}
