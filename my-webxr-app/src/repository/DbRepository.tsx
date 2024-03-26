import Dexie from 'dexie';
import * as assert from 'assert';
import { Repository } from './Repository';
import DataPoint from './DataPoint';
import Column from './Column';

/**
 * Concrete implementation of a data source in IndexedDB
 */
export default class DbRepository extends Dexie implements Repository {
  // Declare implicit table properties.
  // just to inform Typescript of the object type stored in the table.
  private columns!: Dexie.Table<Column, string>; // string = type of the primary key

  /**
   * Concrete implementation of a data source in IndexedDB
   *
   * @param dbName The name of the database to create
   * @pre-condition The dbName is a string
   * @post-condition A database with the provided dbName will be created in the browser's IndexedDB
   */
  constructor(dbName: string) {
    // create a db instance
    super(dbName);

    if (this.columns) {
      this.columns.clear();
    }

    this.version(1).stores({
      // Declare tables, IDs and indexes
      // set the attribute 'name' as the primary key
      columns: 'name',
    });

    // explicitly open connection to the database
    // if not called, db.open() will be called automatically on first query to the db
    this.open();
  }

  /**
   * Asynchronously adds a column to the database
   * @param {Column} column A column data object
   * @return {Promise<string>} The name of the column
   * @pre-condition The column is not already in the database
   * @post-condition The column will be added to the database and can be referenced by the
   *      returned name
   */
  async addColumn(column: Column): Promise<string> {
    return this.columns.add(column);
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
    assert.ok(column.length <= 1, `Found more than one column with name ${columnName}!`);
    assert.ok(column.length === 1, `Column ${columnName} does not exist!`);

    return column[0];
  }

  /**
   * Asynchronously retrieves the data points associated with the provided column names
   * @param {boolean} qualifyingPointOnly Whether or not to filter out data rows with
   *      undefined or missing values
   * @param {string} columnXName The name of the column to be plotted on the x-axis
   * @param {string} columnYName The name of the column to be plotted on the y-axis
   * @param {string} columnZName The name of the column to be plotted on the z-axis
   * @return {Promise<Array<DataPoint>>} An array of data point objects
   * @pre-condition 3 column names must be distinct and existing in the db
   * @post-condition A set of data points that can be plotted
   */
  async getPoints(
    qualifyingPointOnly: boolean,
    columnXName: string,
    columnYName: string,
    columnZName: string,
  ): Promise<Array<DataPoint>> {
    // verify the three columns are distinct
    assert.equal(
      (new Set([columnXName, columnYName, columnZName])).size,
      3,
      `The three columns must be distinct but got: ${columnXName},${
        columnYName},${columnZName}!`,
    );

    // get the three columns
    const columnX = await this.getColumn(columnXName);
    const columnY = await this.getColumn(columnYName);
    const columnZ = await this.getColumn(columnZName);

    const sameLength = new Set([columnX.values.length,
      columnY.values.length,
      columnZ.values.length]);
    assert.equal(sameLength.size, 1, 'The number of values in the given columns must be the same, but '
            + `column ${columnXName} has ${columnX.values.length} values, `
            + `column ${columnYName} has ${columnY.values.length} values, and `
            + `column ${columnZName} has ${columnZ.values.length} values!`);

    const dataPoints = DbRepository.convertColumnsIntoDataPoints(
      qualifyingPointOnly,
      columnX,
      columnY,
      columnZ,
    );
    return Promise.resolve(dataPoints);
  }

  /**
   * convertColumnsIntoDataPoints converts the columns into an array of DataPoints
   * @param {boolean} qualifyingPointOnly if true, only return points that have no missing data
   * @param {Column} columnX the column to be used as the x-axis
   * @param {Column} columnY the column to be used as the y-axis
   * @param {Column} columnZ the column to be used as the z-axis
   * @return {Array<DataPoint>} A row-wise representation of the data
   * @pre-condition The three data columns are the same length
   * @post-condition A row-wise representation of the data
   */
  static convertColumnsIntoDataPoints(
    qualifyingPointOnly: boolean,
    columnX: Column,
    columnY: Column,
    columnZ: Column,
  ): Array<DataPoint> {
    const dataPoints: Array<DataPoint> = [];

    const sameLength = new Set([columnX.values.length,
      columnY.values.length,
      columnZ.values.length]);
    assert.equal(sameLength.size, 1, 'The number of values in the given columns must be the same, but '
        + `column ${columnX.name} has ${columnX.values.length} values, `
        + `column ${columnY.name} has ${columnY.values.length} values, and `
        + `column ${columnZ.name} has ${columnZ.values.length} values!`);

    for (let i = 0; i < columnX.values.length; i += 1) {
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
