import Dexie from 'dexie';
import * as assert from 'assert';
import { Repository } from './Repository';
import DataPoint from './DataPoint';
import Column, { ColumnType, DataColumn, StatsColumn } from './Column';

export default class DbRepository extends Dexie implements Repository {
  // Declare implicit table properties.
  // just to inform Typescript of the object type stored in the table.
  private statsColumns!: Dexie.Table<Column<StatsColumn>, string>;

  private rawColumns!: Dexie.Table<Column<DataColumn>, string>;

  private standardizedColumns!: Dexie.Table<Column<DataColumn>, string>;

  private pcaColumns!: Dexie.Table<Column<DataColumn>, string>;

  constructor(dbName: string) {
    // create a db instance
    super(dbName);

    [this.statsColumns, this.rawColumns, this.standardizedColumns, this.pcaColumns].forEach(
      (table) => {
        if (table) {
          table.clear();
        }
      },
    );

    this.version(1).stores({
      // Declare tables, IDs and indexes
      // set the attribute 'name' as the primary key
      statsColumns: 'name',
      rawColumns: 'name',
      standardizedColumns: 'name',
      pcaColumns: 'name',
    });

    // explicitly open connection to the database
    // if not called, db.open() will be called automatically on first query to the db
    this.open();
  }

  /**
   * addColumn adds a column to the database
   * @param column the column to be added to the database
   * @param columnType the type of column to be added
   * @return Promise<string> the primary key of the column aka the name of the column
   */
  async addColumn(column: Column<DataColumn | StatsColumn>, columnType: ColumnType) {
    switch (columnType) {
      case ColumnType.STATS:
        return this.statsColumns.add(column as Column<StatsColumn>);
      case ColumnType.RAW:
        return this.rawColumns.add(column as Column<DataColumn>);
      case ColumnType.STANDARDIZED:
        return this.standardizedColumns.add(column as Column<DataColumn>);
      case ColumnType.PCA:
        return this.pcaColumns.add(column as Column<DataColumn>);
      default: // This shouldn't ever occur because of the Enum usage
        throw new Error(`Invalid columnType: ${columnType}`);
    }
  }

  // TODO: complete this function
  // eslint-disable-next-line class-methods-use-this
  async addToExistingColumn(column: Column<DataColumn | StatsColumn>): Promise<string> {
    return Promise.resolve(column.name);
  }

  /**
   * getColumn gets a column from the database
   * @param columnName the name of the column to be retrieved
   * @param columnType the type of the column to be retrieved
   * @return Promise<Column>
   * @private
   */
  private async getColumn(columnName: string, columnType: ColumnType) {
    let columnsTable;
    switch (columnType) {
      case ColumnType.STATS:
        columnsTable = this.statsColumns;
        break;
      case ColumnType.RAW:
        columnsTable = this.rawColumns;
        break;
      case ColumnType.STANDARDIZED:
        columnsTable = this.standardizedColumns;
        break;
      case ColumnType.PCA:
        columnsTable = this.pcaColumns;
        break;
      default: // This shouldn't ever occur because of the Enum usage
        throw new Error(`Invalid columnType: ${columnType}`);
    }

    const column = await columnsTable
      .where('name')
      .equals(columnName)
      .toArray();
    assert.ok(column.length <= 1, `Found more than one column with name ${columnName}!`);
    assert.ok(column.length === 1, `Column ${columnName} does not exist!`);

    return column[0];
  }

  /**
   * getPoints gets the points from the database
   * @param qualifyingPointOnly if true, only return points that have no missing data
   * @param columnXName the name of the column to be used as the x-axis
   * @param columnYName the name of the column to be used as the y-axis
   * @param columnZName the name of the column to be used as the z-axis
   * @pre-condition 3 column names must be distinct and existing in the db
   * @return Promise<Array<DataPoint>>
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
    const columnX = (await this.getColumn(columnXName, ColumnType.RAW)) as Column<DataColumn>;
    const columnY = (await this.getColumn(columnYName, ColumnType.RAW)) as Column<DataColumn>;
    const columnZ = (await this.getColumn(columnZName, ColumnType.RAW)) as Column<DataColumn>;

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
   * @param qualifyingPointOnly if true, only return points that have no missing data
   * @param columnX the column to be used as the x-axis
   * @param columnY the column to be used as the y-axis
   * @param columnZ the column to be used as the z-axis
   * @return Array<DataPoint>
   */
  static convertColumnsIntoDataPoints(
    qualifyingPointOnly: boolean,
    columnX: Column<DataColumn>,
    columnY: Column<DataColumn>,
    columnZ: Column<DataColumn>,
  ): Array<DataPoint> {
    const dataPoints: Array<DataPoint> = [];

    for (let i = 0; i < columnX.values.length; i += 1) {
      // Force type cast to string | number | null.
      // We can guarantee this, given the DataColumn generic consists of these types.
      const xValue = (columnX.values[i] as unknown as string | number | null);
      const yValue = (columnY.values[i] as unknown as string | number | null);
      const zValue = (columnZ.values[i] as unknown as string | number | null);
      const hasMissingData = xValue === null || yValue === null || zValue === null;

      // if only qualifying points are requested, add the point only if it has no missing data
      if (!qualifyingPointOnly || (qualifyingPointOnly && !hasMissingData)) {
        dataPoints.push(new DataPoint(hasMissingData, xValue, yValue, zValue));
      }
    }
    return dataPoints;
  }

  /**
   * closeConnection closes the connection to the database
   */
  closeConnection() {
    this.close();
  }
}
