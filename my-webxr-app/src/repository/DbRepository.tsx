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
   * Retrieves a column object from the specified table in the database based on the provided column
   * name and type.
   *
   * @param {string} columnName - The name of the column to be retrieved.
   * @param {ColumnType} columnType - The type of the column to be retrieved. This determines the
   * table to fetch the column from.
   * @returns {Promise<Column<NumericColumn | RawColumn>>} - Returns a promise that resolves to the
   * column object.
   * @throws {Error} - Throws an error if an invalid column type is provided or if the column does
   * not exist.
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
   * Retrieves the x, y, and z values from the specified columns in the database and returns them as
   * an array of DataPoint objects.
   *
   * This assumes a column from the raw data table is numeric, and both RAW and PCA tables are not
   * empty.
   *
   * If the specified column type is not RAW or PCA, an error is thrown.
   * If the lengths of the x, y, and z columns are not the same, an error is thrown.
   * If any error occurs during the execution of the function, an empty array is returned.
   *
   * @param {string} columnXName - Column names to use for the x values of the DataPoint.
   * @param {string} columnYName - Column names to use for the y values of the DataPoint.
   * @param {string} columnZName - Column names to use for the z values of the DataPoint.
   * @param {ColumnType} columnType - The type of the columns to retrieve data from. Must be either
   * RAW or PCA.
   * @returns {Promise<Array<DataPoint>>} A promise that resolves to an array of DataPoint objects.
   * @throws {Error} If the columnType is not RAW or PCA, or if the lengths of the x, y, and z
   * columns are not the same.
   * @pre-condition 3 column names must be distinct and existing in the db
   */
  async getPoints(
    columnXName: string,
    columnYName: string,
    columnZName: string,
    columnType: ColumnType,
  ): Promise<Array<DataPoint>> {
    // verify the three columns are distinct
    assert.equal(
      (new Set([columnXName, columnYName, columnZName])).size,
      3,
      `The three columns must be distinct but got: ${columnXName},${
        columnYName},${columnZName}!`,
    );

    assert.ok(
      columnType === ColumnType.RAW || columnType === ColumnType.PCA,
      'Invalid column type. Must be either RAW or PCA.',
    );

    // get the three columns
    const columnX = (await this.getColumn(columnXName, columnType));
    const columnY = (await this.getColumn(columnYName, columnType));
    const columnZ = (await this.getColumn(columnZName, columnType));

    assert.ok(columnX.values[0] === 'number', 'ColumnX must be numeric!');
    assert.ok(columnY.values[0] === 'number', 'ColumnY must be numeric!');
    assert.ok(columnZ.values[0] === 'number', 'ColumnZ must be numeric!');

    const sameLength = new Set([columnX.values.length,
      columnY.values.length,
      columnZ.values.length]);
    assert.equal(sameLength.size, 1, 'The number of values in the given columns must be the same, but '
            + `column ${columnXName} has ${columnX.values.length} values, `
            + `column ${columnYName} has ${columnY.values.length} values, and `
            + `column ${columnZName} has ${columnZ.values.length} values!`);

    const dataPoints = DbRepository.convertColumnsIntoDataPoints(
      columnX,
      columnY,
      columnZ,
    );
    return Promise.resolve(dataPoints);
  }

  /**
   * convertColumnsIntoDataPoints converts the columns into an array of DataPoints
   *
   * @param columnX the column to be used as the x-axis
   * @param columnY the column to be used as the y-axis
   * @param columnZ the column to be used as the z-axis
   * @return Array<DataPoint>
   */
  static convertColumnsIntoDataPoints(
    columnX: Column<NumericColumn | RawColumn>,
    columnY: Column<NumericColumn | RawColumn>,
    columnZ: Column<NumericColumn | RawColumn>,
  ): Array<DataPoint> {
    const dataPoints: Array<DataPoint> = [];

    for (let i = 0; i < columnX.values.length; i += 1) {
      const xValue = (columnX.values[i]);
      const yValue = (columnY.values[i]);
      const zValue = (columnZ.values[i]);

      dataPoints.push(new DataPoint(xValue, yValue, zValue));
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
