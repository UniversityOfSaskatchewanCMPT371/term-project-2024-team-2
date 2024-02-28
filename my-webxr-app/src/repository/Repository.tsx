import {DataPoint} from "./DataPoint.tsx";
import {Column} from "./DbRepository.tsx";

// The repository interface defines operations that can be
// done to/on the db.
export interface Repository {
    getPoints: (qualifyingPointOnly : boolean,
                columnXName: string,
                columnYName: string,
                columnZName: string) => Promise<Array<DataPoint>>;
    addColumn: (column : Column) => Promise<void>;
}