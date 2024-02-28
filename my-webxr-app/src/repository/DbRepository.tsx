import {Repository} from "./Repository.tsx";
import {DataPoint} from "./DataPoint.tsx";
import Dexie from "dexie";
import * as assert from "assert";

// the Column class represents a column in the csv file
// we will store csv data in the indexedDB as columns
export class Column {
    name: string;
    values: Array<number | string | null>;

    constructor(name: string, values: Array<number | string | null>) {
        this.name = name;
        this.values = values;
    }
}

export class DbRepository extends Dexie implements Repository {
    // Declare implicit table properties.
    // just to inform Typescript of the object type stored in the table. Instantiated by Dexie in stores() method)
    private columns!: Dexie.Table<Column, string>; // string = type of the primary key

    constructor(dbName: string) {
        // create a db instance
        super(dbName);

        if (this.columns) {
            this.columns.clear();
        }

        this.version(1).stores({
            // Declare tables, IDs and indexes
            // set the attribute 'name' as the primary key
            columns: 'name'
        });

        // explicitly open connection to the database
        // if not called, db.open() will be called automatically on first query to the db
        this.open();
    }

    /*
    addColumn adds a column to the database
    @param column: the column to be added to the database
    @return Promise<void>
     */
    async addColumn(column: Column) {
        return this.columns.add(column)
            .then(() => console.log("Column " + column.name + " added to the database"))
            .catch((err) => {
                console.error("Error when adding column " + column.name + " to the database.");
                throw err;
            });
    }

    /*
    getColumn gets a column from the database
    @param columnName: the name of the column to be retrieved
    @return Promise<Column>
     */
    private async getColumn(columnName: string) {
        const column = await this.columns
            .where('name')
            .equals(columnName)
            .toArray();
        assert.ok(column.length <= 1, "Found more than one column with name " + columnName + "!");
        assert.ok(column.length === 1, "Column " + columnName + " does not exist!");

        return column[0];
    }

    /*
    getPoints gets the points from the database
    @param qualifyingPointOnly: if true, only return points that have no missing data
    @param columnXName: the name of the column to be used as the x-axis
    @param columnYName: the name of the column to be used as the y-axis
    @param columnZName: the name of the column to be used as the z-axis
    @return Promise<Array<DataPoint>>
     */
    async getPoints(qualifyingPointOnly: boolean,
                    columnXName: string,
                    columnYName: string,
                    columnZName: string): Promise<Array<DataPoint>> {
        // verify the three columns are distinct
        assert.equal((new Set([columnXName, columnYName, columnZName])).size, 3,
            "The three columns must be distinct but got: " + columnXName + ","
            + columnYName + "," + columnZName + "!");

        // get the three columns
        const columnX = await this.getColumn(columnXName);
        const columnY = await this.getColumn(columnYName);
        const columnZ = await this.getColumn(columnZName);

        const sameLength = new Set([columnX.values.length, columnY.values.length, columnZ.values.length]);
        assert.equal(sameLength.size, 1, "The number of values in the given columns must be the same, but " +
            "column " + columnXName + " has " + columnX.values.length + " values, " +
            "column " + columnYName + " has " + columnY.values.length + " values, and " +
            "column " + columnZName + " has " + columnZ.values.length + " values!");

        const dataPoints = this.convertColumnsIntoDataPoints(qualifyingPointOnly, columnX, columnY, columnZ);
        return Promise.resolve(dataPoints);
    }

    /*
    convertColumnsIntoDataPoints converts the columns into an array of DataPoints
    @param qualifyingPointOnly: if true, only return points that have no missing data
    @param columnX: the column to be used as the x-axis
    @param columnY: the column to be used as the y-axis
    @param columnZ: the column to be used as the z-axis
    @return Array<DataPoint>
     */
    private convertColumnsIntoDataPoints(qualifyingPointOnly: boolean,
                                         columnX: Column,
                                         columnY: Column,
                                         columnZ: Column): Array<DataPoint> {
        const dataPoints: Array<DataPoint> = [];

        for (let i = 0; i < columnX.values.length; i++) {
            const xValue = columnX.values[i];
            const yValue = columnY.values[i];
            const zValue = columnZ.values[i];
            const hasMissingData = xValue === null || yValue === null || zValue === null;

            // if only qualifying points are requested, add the point only if it has no missing data
            if (!qualifyingPointOnly || (qualifyingPointOnly && !hasMissingData)) {
                dataPoints.push(new DataPoint(hasMissingData, xValue, yValue, zValue));
            }
        }
        return dataPoints;
    }

    /*
    closeConnection closes the connection to the database
     */
    closeConnection() {
        this.close();
    }
}
