import {DataPoint} from "./DataPoint.tsx";
import {Column} from "./DbRepository.tsx";

// The repository interface defines operations that can be
// done to/on the db.
export interface Repository {
    getPoints: (qualifyingPointOnly : boolean) => Promise<Array<DataPoint>>;
    addColumn: (column : Column) => void;
}