import {DataPoint} from "./DataPoint.tsx";
import {Column} from "./IndexDbRepository.tsx";

export interface ColumnRepository{
    getPoints: (qualifyingPointOnly : boolean) => Promise<Array<DataPoint>>;
    addColumn: (column : Column) => void;
    addColumnBulk: (columns : Array<Column>) => void;
}