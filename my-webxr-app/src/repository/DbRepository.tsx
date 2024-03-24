import Dexie from 'dexie';
import * as assert from 'assert';
import { Repository } from './Repository';
import DataPoint from './DataPoint';
import Column, {
  ColumnType, RawColumn, NumericColumn, StatsColumn,
} from './Column';

export default class DbRepository extends Dexie implements Repository {
  // Declare implicit table properties.
  // just to inform Typescript of the object type stored in the table.
  private statsColumns!: Dexie.Table<Column<StatsColumn>, string>;

  private rawColumns!: Dexie.Table<Column<RawColumn>, string>;

  private standardizedColumns!: Dexie.Table<Column<NumericColumn>, string>;

  private pcaColumns!: Dexie.Table<Column<NumericColumn>, string>;

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
   * Checks if the table is empty
   *
   * @param {ColumnType} columnType the type of column table to be checked
   */

  async isTableEmpty(columnType: ColumnType): Promise<boolean> {
    let count = 0;

    switch (columnType) {
      case ColumnType.RAW:
        count = await this.rawColumns.count();
        break;
      case ColumnType.STATS:
        count = await this.statsColumns.count();
        break;
      case ColumnType.STANDARDIZED:
        count = await this.standardizedColumns.count();
        break;
      case ColumnType.PCA:
        count = await this.pcaColumns.count();
        break;
      default:
        throw new Error(`Unknown column type: ${columnType}`);
    }

    return count === 0;
  }

  /**
   * addColumn adds a column to the database
   * @param column the column to be added to the database
   * @param columnType the type of column to be added
   * @return Promise<string> the primary key of the column aka the name of the column
   */
  async addColumn(column: Column<RawColumn | StatsColumn | NumericColumn>, columnType: ColumnType) {
    switch (columnType) {
      case ColumnType.STATS:
        return this.statsColumns.add(column as Column<StatsColumn>);
      case ColumnType.RAW:
        return this.rawColumns.add(column as Column<RawColumn>);
      case ColumnType.STANDARDIZED:
        return this.standardizedColumns.add(column as Column<NumericColumn>);
      case ColumnType.PCA:
        return this.pcaColumns.add(column as Column<NumericColumn>);
      default: // This shouldn't ever occur because of the Enum usage
        throw new Error(`Invalid columnType: ${columnType}`);
    }
  }

  /**
   * Updates a column in the database based on the column type.
   * This excludes stats column because stats column is a look up table, and value should not be
   * updated manually
   *
   * @param {Column<NumericColumn | RawColumn | StatsColumn>} column - The column to be updated.
   * @param {ColumnType} columnType - The type of the column to be updated.
   * @returns {Promise<boolean>} - Returns a promise that resolves to a boolean indicating whether
   * the update was successful.
   * @throws {Error} - Throws an error if an invalid column type is provided.
   */

  async updateColumn(
    column: Column<NumericColumn | RawColumn>,
    columnType: ColumnType,
  ): Promise<boolean> {
    let columnsTable;
    switch (columnType) {
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
    try {
      await columnsTable.put(column);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Return a column object from the RawData/StandardizedData/PCAData table based on given column
   * name and column type.
   *
   * @param columnName the name of the column to be retrieved
   * @param columnType the type of the column to be retrieved
   * @return Promise<Column> the column object
   */
  async getColumn(
    columnName: string,
    columnType: ColumnType,
  ): Promise<Column<RawColumn | NumericColumn>> {
    let columnsTable;
    switch (columnType) {
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
    * Return a column object from the StatsData table (Look up table) based on given column name.
   *
   * @param columnName the name of the column to be retrieved
   * @return Promise<Column> the column object
   */
  async getStatsColumn(columnName: string) {
    const column = await this.statsColumns.where('name').equals(columnName).toArray();
    assert.ok(column.length <= 1, `Found more than one column with name ${columnName}!`);
    assert.ok(column.length === 1, `Column ${columnName} does not exist!`);
    return column[0];
  }

  /**
   * getPoints gets the points from the database
   * TODO: allow this to also get points from the pca table, only gets points from the raw table now
   *
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
    const columnX = (await this.getColumn(columnXName, ColumnType.RAW)) as
      Column<RawColumn>;
    const columnY = (await this.getColumn(columnYName, ColumnType.RAW)) as
      Column<RawColumn>;
    const columnZ = (await this.getColumn(columnZName, ColumnType.RAW)) as
      Column<RawColumn>;

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
    columnX: Column<RawColumn | NumericColumn>,
    columnY: Column<RawColumn | NumericColumn>,
    columnZ: Column<RawColumn | NumericColumn>,
  ): Array<DataPoint> {
    const dataPoints: Array<DataPoint> = [];

    for (let i = 0; i < columnX.values.length; i += 1) {
      // Force type cast to string | number | null.
      // We can guarantee this, given the DataColumn generic consists of these types.
      const xValue = (columnX.values[i]);
      const yValue = (columnY.values[i]);
      const zValue = (columnZ.values[i]);
      const hasMissingData = xValue === null || yValue === null || zValue === null;

      // if only qualifying points are requested, add the point only if it has no missing data
      if (!qualifyingPointOnly || (qualifyingPointOnly && !hasMissingData)) {
        dataPoints.push(new DataPoint(hasMissingData, xValue, yValue, zValue));
      }
    }
    return dataPoints;
  }

  /**
   * Retrieves all column names from the raw data table in the database.
   *
   * This will include all columns that have been added from the CSV.
   * The method uses Dexie's `toCollection` and `keys` methods to retrieve all keys which is column
   * names from the `rawColumns` table without loading the entire column into memory.
   *
   * @returns {Promise<string[]>} A promise resolves to an array of column names.
   */
  async getCsvColumnNames(): Promise<string[]> {
    return await this.rawColumns.toCollection().keys() as string[];
  }

  /**
   * Retrieves all numeric column names from the stat data table in the database.
   *
   * Use the same logic as `getAllColumnNames` to save memory.
   * @returns {Promise<string[]>} A promise resolves to an array of column names.
   */
  async getStatsColumnNames(): Promise<string[]> {
    return await this.statsColumns.toCollection().keys() as string[];
  }

  /**
   * Retrieves all PCA column names from the PCA data table in the database.
   *
   * Use the same logic as `getAllColumnNames` to save memory.
   * @returns {Promise<string[]>} A promise resolves to an array of column names.
   */
  async getPcaColumnNames(): Promise<string[]> {
    return await this.pcaColumns.toCollection().keys() as string[];
  }

  /**
   * Retrieves all standardized column names from the standardized data table in the database.
   *
   * Use the same logic as `getAllColumnNames` to save memory.
   * @returns {Promise<string[]>} A promise resolves to an array of column names.
   */
  async getStandardizedColumnNames(): Promise<string[]> {
    return await this.standardizedColumns.toCollection().keys() as string[];
  }

  /**
   * closeConnection closes the connection to the database
   */
  closeConnection() {
    this.close();
  }
}
