import {Repository} from "./Repository.tsx";
import {DataPoint} from "./DataPoint.tsx";
import Dexie from "dexie";
import * as assert from "assert";

export class Column {
    id?: number;
    name: string;
    values: Array<number | string | null>;

    constructor(name: string, values: Array<number | string | null>) {
        this.name = name;
        this.values = values;
    }
}

export class DbRepository extends Dexie implements Repository {
    // Declare implicit table properties.
    // (just to inform Typescript. Instantiated by Dexie in stores() method)
    private columns!: Dexie.Table<Column, number >; // number = type of the primkey
    //...other tables goes here...

    constructor(dbName: string) {
        // create a db instance
        super(dbName);

        if (this.columns) {
            this.columns.clear();
        }

        this.version(1).stores({
            // Declare tables, IDs and indexes
            // NOTE: Don’t declare all columns like in SQL.
            // You only declare properties you want to index, that is properties you want to use in a where(…) query.
            columns: '++id',
        });
    }

    addColumn(column : Column) {
        this.columns.add(column)
            .catch(e => console.error("Error: " + e));
    }

    addColumnBulk(columns : Array<Column>) {
        this.columns.bulkAdd(columns)
            .catch(e => console.error("Error: " + e));
    }

    async getPoints(qualifyingPointOnly : boolean): Promise<Array<DataPoint>> {
        const result = await this.columns.toArray();

        // transpose the result into an array of DataPoint
        if (result.length > 0) {
            const dataPoints: Array<DataPoint> = [];
            const numRows = result[0].values.length;

            // for each row
            for (let i = 0; i < numRows; i++) {
                let hasMissingData = false;
                const dataPointValues: Array<number | string | null> = [];
                // for each column
                for (let j = 0; j < result.length; j++) {
                    const columnValues = result[j].values;
                    assert.equal(columnValues.length, numRows);

                    if (columnValues[i] === null) {
                        hasMissingData = true;
                    }

                    dataPointValues.push(result[j].values[i]);
                }

                if (!qualifyingPointOnly) {
                    dataPoints.push(new DataPoint(hasMissingData, dataPointValues));
                } // if only qualifying points are requested, add the point only if it has no missing data
                else if (!hasMissingData) {
                    dataPoints.push(new DataPoint(hasMissingData, dataPointValues));
                }
            }

            return Promise.resolve(dataPoints);
        }

        return Promise.resolve([]);
    }

    // public for testing
    async resetDatabase() {
        this.columns.clear();
        await this.delete();
    }
}
