import Dexie from 'dexie';
import assert from 'node:assert';
import { Repository } from './Repository';
import DataPoint from './DataPoint';
import Column, {
  TableName, RawColumn, NumericColumn, StatsColumn,
} from './Column';

/**
 * Concrete implementation of a data source in IndexedDB
 */
export default class DbRepository extends Dexie implements Repository {
  // Declare implicit table properties.
  // just to inform Typescript of the object type stored in the table.
  private statsColumns!: Dexie.Table<Column<StatsColumn>, string>;

  private rawColumns!: Dexie.Table<Column<RawColumn>, string>;

  private standardizedColumns!: Dexie.Table<Column<NumericColumn>, string>;

  private pcaColumns!: Dexie.Table<Column<NumericColumn>, string>;

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
   * @pre-condition None
   * @post-condition Returns whether a table type is empty
   * @param {TableName} tableName the name of table to be checked
   * @return {Promise<boolean>} whether or not the table is empty
   */
  async isTableEmpty(tableName: TableName): Promise<boolean> {
    let count = 0;

    switch (tableName) {
      case TableName.RAW:
        count = await this.rawColumns.count();
        break;
      case TableName.STATS:
        count = await this.statsColumns.count();
        break;
      case TableName.STANDARDIZED:
        count = await this.standardizedColumns.count();
        break;
      case TableName.PCA:
        count = await this.pcaColumns.count();
        break;
      default:
        throw new Error(`Unknown table name: ${tableName}`);
    }

    return count === 0;
  }

  /**
   * Adds a column to a table
   * @pre-condition The column name must be unique@post-condition The column will be added to the
   *    database and can be referenced by the returned name
   * @post-condition Creates a new column entry in the provided table
   * @param {Column<RawColumn | StatsColumn | NumericColumn>} column the column to be added to
   *    the database
   * @param {TableName} tableName the name of table to add column to
   * @return {PromiseExtended<string | void>} the primary key of the column aka the name of
   *    the column
   */
  async addColumn(column: Column<RawColumn | StatsColumn | NumericColumn>, tableName: TableName) {
    switch (tableName) {
      case TableName.STATS:
        return this.statsColumns.add(column as Column<StatsColumn>)
          .catch((e) => {
            e.inner.message = `Failed to add column: ${column.name} \n ${e.inner.message}`;
            throw e;
          });
      case TableName.RAW:
        return this.rawColumns.add(column as Column<RawColumn>)
          .catch((e) => {
            e.inner.message = `Failed to add column: ${column.name} \n ${e.inner.message}`;
            throw e;
          });
      case TableName.STANDARDIZED:
        return this.standardizedColumns.add(column as Column<NumericColumn>)
          .catch((e) => {
            e.inner.message = `Failed to add column: ${column.name} \n ${e.inner.message}`;
            throw e;
          });
      case TableName.PCA:
        return this.pcaColumns.add(column as Column<NumericColumn>)
          .catch((e) => {
            e.inner.message = `Failed to add column: ${column.name} \n ${e.inner.message}`;
            throw e;
          });
      default: // This shouldn't ever occur because of the Enum usage
        throw new Error(`Invalid table name: ${tableName}`);
    }
  }

  /**
   * Updates a column in the database.
   * This excludes stats column because stats column is a look-up table, and value should not be
   * updated manually.
   *
   * @pre-condition tableName is not STATS
   * @post-condition replaces the provided column in the database
   * @param {Column<NumericColumn | RawColumn>} column - The column to be updated.
   * @param {TableName} tableName - The table name contains column to be updated.
   * @returns {Promise<boolean>} - Returns a promise that resolves to a boolean indicating whether
   * the update was successful.
   * @throws {Error} - Throws an error if an invalid column type is provided.
   */
  async updateColumn(
    column: Column<NumericColumn | RawColumn>,
    tableName: TableName,
  ): Promise<boolean> {
    let columnsTable;
    switch (tableName) {
      case TableName.RAW:
        columnsTable = this.rawColumns;
        break;
      case TableName.STANDARDIZED:
        columnsTable = this.standardizedColumns;
        break;
      case TableName.PCA:
        columnsTable = this.pcaColumns;
        break;
      default: // This shouldn't ever occur because of the Enum usage
        throw new Error(`Invalid table name: ${tableName}`);
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
   * @pre-condition There exists only one column of the given name in the given table
   * @post-condition Returns the column associated with the provided key
   * @param {string} columnName - The name of the column to be retrieved.
   * @param {TableName} tableName - The name of table to retrieve column from. This determines the
   * table to fetch the column from.
   * @returns {Promise<Column<NumericColumn | RawColumn>>} - Returns a promise that resolves to the
   * column object.
   * @throws {Error} - Throws an error if an invalid column type is provided or if the column does
   * not exist.
   */
  async getColumn(
    columnName: string,
    tableName: TableName,
  ): Promise<Column<RawColumn | NumericColumn>> {
    let columnsTable;
    switch (tableName) {
      case TableName.RAW:
        columnsTable = this.rawColumns;
        break;
      case TableName.STANDARDIZED:
        columnsTable = this.standardizedColumns;
        break;
      case TableName.PCA:
        columnsTable = this.pcaColumns;
        break;
      default: // This shouldn't ever occur because of the Enum usage
        throw new Error(`Invalid table name: ${tableName}`);
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
   * @pre-condition There exists a column in the raw data table with the key columnName
   * @post-condition The stats associate with that column
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
   * Retrieves the x, y, and z values from the specified columns and the absolute max values of each
   * selects columns in the database, along with any optional value selected from optional data
   * values, and returns them as an array of DataPoint objects and an array
   * of three non-negative integer maximum values for x, y and z.
   *
   * @pre-condition
   * - The columns must exist in the database. Either in the 'RAW' table or the 'PCA' table.
   * - No columns in Raw table should have the same name as columns in PCA table (PC1, PC2, PC3,...)
   * - The columns must contain numeric data.
   * - The lengths of the x, y, and z columns must be the same.
   * - The three column names must be distinct.
   * @post-condition - A set of data points that can be plotted and each of column absolute max int
   * value.
   *
   * @param {string | null} columnXName - Column name to use for the x values of the DataPoint.
   * @param {string | null} columnYName - Column name to use for the y values of the DataPoint.
   * @param {string | null} columnZName - Column name to use for the z values of the DataPoint.
   * @param optionalColumn1Name - Optional column name to be display value on data menu if selected
   * @param optionalColumn2Name - Optional column name to be display value on data menu if selected
   * @param optionalColumn3Name - Optional column name to be display value on data menu if selected
   * @param optionalColumn4Name - Optional column name to be display value on data menu if selected
   * @param optionalColumn5Name - Optional column name to be display value on data menu if selected
   * @param optionalColumn6Name - Optional column name to be display value on data menu if selected
   * @param optionalColumn7Name - Optional column name to be display value on data menu if selected
   * @returns {Promise<[Array<DataPoint>, Array<number>]>} A promise that resolves to an array of
   * DataPoint objects and an array of maximum values from each x, y znd z column.
   * @throws {Error} If violates preconditions.
   */
  async getPoints(
    columnXName: string,
    columnYName: string,
    columnZName: string,
    optionalColumn1Name?: string,
    optionalColumn2Name?: string,
    optionalColumn3Name?: string,
    optionalColumn4Name?: string,
    optionalColumn5Name?: string,
    optionalColumn6Name?: string,
    optionalColumn7Name?: string,
  ): Promise<[Array<DataPoint>, Array<number>]> {
    // do nothing if null column entries selected
    if (columnXName == null || columnYName == null || columnZName == null) {
      return [[], []];
    }
    // verify the three columns are distinct
    assert.equal(
      (new Set([columnXName, columnYName, columnZName])).size,
      3,
      `The three columns must be distinct but got: ${columnXName},${
        columnYName},${columnZName}!`,
    );
    // do nothing if null column entries selected
    if (columnXName == null || columnYName == null || columnZName == null) {
      return [[], []];
    }

    // Check if the columns exist in the 'RAW' table, select it if it does, otherwise check the
    // 'PCA' table
    let columnX = await this.getColumn(columnXName, TableName.RAW).catch(() => null);
    let columnY = await this.getColumn(columnYName, TableName.RAW).catch(() => null);
    let columnZ = await this.getColumn(columnZName, TableName.RAW).catch(() => null);
    // Only query columns only if their names are provided
    let optionalColumn1 = optionalColumn1Name ? await this.getColumn(
      optionalColumn1Name,
      TableName.RAW,
    ).catch(() => null) : null;
    let optionalColumn2 = optionalColumn2Name ? await this.getColumn(
      optionalColumn2Name,
      TableName.RAW,
    ).catch(() => null) : null;
    let optionalColumn3 = optionalColumn3Name ? await this.getColumn(
      optionalColumn3Name,
      TableName.RAW,
    ).catch(() => null) : null;
    let optionalColumn4 = optionalColumn4Name ? await this.getColumn(
      optionalColumn4Name,
      TableName.RAW,
    ).catch(() => null) : null;
    let optionalColumn5 = optionalColumn5Name ? await this.getColumn(
      optionalColumn5Name,
      TableName.RAW,
    ).catch(() => null) : null;
    let optionalColumn6 = optionalColumn6Name ? await this.getColumn(
      optionalColumn6Name,
      TableName.RAW,
    ).catch(() => null) : null;
    let optionalColumn7 = optionalColumn7Name ? await this.getColumn(
      optionalColumn7Name,
      TableName.RAW,
    ).catch(() => null) : null;

    // If any of the columns do not exist in the 'RAW' table (null), check the 'PCA' table
    columnX = columnX || await this.getColumn(columnXName, TableName.PCA);
    columnY = columnY || await this.getColumn(columnYName, TableName.PCA);
    columnZ = columnZ || await this.getColumn(columnZName, TableName.PCA);
    // Only query columns if their names are provided, and they are not found in the 'RAW' table
    optionalColumn1 = optionalColumn1Name && optionalColumn1 === null ? await this.getColumn(
      optionalColumn1Name,
      TableName.PCA,
    ) : optionalColumn1;
    optionalColumn2 = optionalColumn2Name && optionalColumn2 === null ? await this.getColumn(
      optionalColumn2Name,
      TableName.PCA,
    ) : optionalColumn2;
    optionalColumn3 = optionalColumn3Name && optionalColumn3 === null ? await this.getColumn(
      optionalColumn3Name,
      TableName.PCA,
    ) : optionalColumn3;
    optionalColumn4 = optionalColumn4Name && optionalColumn4 === null ? await this.getColumn(
      optionalColumn4Name,
      TableName.PCA,
    ) : optionalColumn4;
    optionalColumn5 = optionalColumn5Name && optionalColumn5 === null ? await this.getColumn(
      optionalColumn5Name,
      TableName.PCA,
    ) : optionalColumn5;
    optionalColumn6 = optionalColumn6Name && optionalColumn6 === null ? await this.getColumn(
      optionalColumn6Name,
      TableName.PCA,
    ) : optionalColumn6;
    optionalColumn7 = optionalColumn7Name && optionalColumn7 === null ? await this.getColumn(
      optionalColumn7Name,
      TableName.PCA,
    ) : optionalColumn7;

    assert.ok(typeof columnX.values[0] === 'number', 'ColumnX must be numeric!');
    assert.ok(typeof columnY.values[0] === 'number', 'ColumnY must be numeric!');
    assert.ok(typeof columnZ.values[0] === 'number', 'ColumnZ must be numeric!');

    const sameLength = new Set([
      columnX.values.length,
      columnY.values.length,
      columnZ.values.length,
    ]);
    assert.equal(
      sameLength.size,
      1,
      'The number of values in the given columns must be the same, but '
        + `column ${columnXName} has ${columnX.values.length} values, `
        + `column ${columnYName} has ${columnY.values.length} values, and `
        + `column ${columnZName} has ${columnZ.values.length} values!`,
    );

    // Get the absolute max values of each column, and round of to the next integer
    const absValues = [
      columnX.values as number[],
      columnY.values as number[],
      columnZ.values as number[],
    ].map((column) => column.map(Math.abs));
    const [maxX, maxY, maxZ] = absValues.map((values) => Math.ceil(Math.max(...values)));
    const maxValues = [maxX, maxY, maxZ];
    const dataPoints = DbRepository.convertColumnsIntoDataPoints(
      columnX as Column<NumericColumn>,
      columnY as Column<NumericColumn>,
      columnZ as Column<NumericColumn>,
      optionalColumn1 as Column<NumericColumn>,
      optionalColumn2 as Column<NumericColumn>,
      optionalColumn3 as Column<NumericColumn>,
      optionalColumn4 as Column<NumericColumn>,
      optionalColumn5 as Column<NumericColumn>,
      optionalColumn6 as Column<NumericColumn>,
      optionalColumn7 as Column<NumericColumn>,
    );
    return Promise.resolve([dataPoints, maxValues]);
  }

  /**
   * Convert the columns into an array of DataPoints
   *
   * @pre-condition
   * - All columns must have the same length.
   * - All columns must contain numeric data.
   * @post-condition A row-wise representation of the data
   * @param {Column} columnX the column to be used as the x-axis
   * @param {Column} columnY the column to be used as the y-axis
   * @param {Column} columnZ the column to be used as the z-axis
   * @param optionalColumn1 the column to be used as the first optional column
   * @param optionalColumn2 the column to be used as the second optional column
   * @param optionalColumn3 the column to be used as the third optional column
   * @param optionalColumn4 the column to be used as the fourth optional column
   * @param optionalColumn5 the column to be used as the fifth optional column
   * @param optionalColumn6 the column to be used as the sixth optional column
   * @param optionalColumn7 the column to be used as the seventh optional column
   * @return Array<DataPoint>
   */
  static convertColumnsIntoDataPoints(
    columnX: Column<NumericColumn>,
    columnY: Column<NumericColumn>,
    columnZ: Column<NumericColumn>,
    optionalColumn1?: Column<NumericColumn>,
    optionalColumn2?: Column<NumericColumn>,
    optionalColumn3?: Column<NumericColumn>,
    optionalColumn4?: Column<NumericColumn>,
    optionalColumn5?: Column<NumericColumn>,
    optionalColumn6?: Column<NumericColumn>,
    optionalColumn7?: Column<NumericColumn>,
  ): Array<DataPoint> {
    // assert that all columns have the same length
    assert.equal(
      columnX.values.length,
      columnY.values.length,
      `The number of values in the given columns must be the same but column X has ${columnX.values.length} values 
      and column Y has ${columnY.values.length} values!`,
    );
    assert.equal(
      columnY.values.length,
      columnZ.values.length,
      `The number of values in the given columns must be the same but column Y has ${columnY.values.length} values 
      and column Z has ${columnZ.values.length} values!`,
    );

    const dataPoints: Array<DataPoint> = [];

    for (let i = 0; i < columnX.values.length; i += 1) {
      const xValue = (columnX.values[i]);
      const yValue = (columnY.values[i]);
      const zValue = (columnZ.values[i]);
      const optionalCol1Value = optionalColumn1 ? optionalColumn1.values[i] : undefined;
      const optionalCol2Value = optionalColumn2 ? optionalColumn2.values[i] : undefined;
      const optionalCol3Value = optionalColumn3 ? optionalColumn3.values[i] : undefined;
      const optionalCol4Value = optionalColumn4 ? optionalColumn4.values[i] : undefined;
      const optionalCol5Value = optionalColumn5 ? optionalColumn5.values[i] : undefined;
      const optionalCol6Value = optionalColumn6 ? optionalColumn6.values[i] : undefined;
      const optionalCol7Value = optionalColumn7 ? optionalColumn7.values[i] : undefined;
      dataPoints.push(new DataPoint(
        xValue,
        yValue,
        zValue,
        optionalCol1Value,
        optionalCol2Value,
        optionalCol3Value,
        optionalCol4Value,
        optionalCol5Value,
        optionalCol6Value,
        optionalCol7Value,
      ));
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
   * @pre-condition The raw data table exists
   * @post-condition Returns the array of all data column primary keys
   * @returns {Promise<string[]>} A promise resolves to an array of column names.
   */
  async getCsvColumnNames(): Promise<string[]> {
    return await this.rawColumns.toCollection().keys() as string[];
  }

  /**
   * Retrieves all numeric column names from the stat data table in the database.
   *
   * Use the same logic as `getAllColumnNames` to save memory.
   * @pre-condition The stats data table exists
   * @post-condition Returns the array of all data column primary keys
   * @returns {Promise<string[]>} A promise resolves to an array of column names.
   */
  async getStatsColumnNames(): Promise<string[]> {
    return await this.statsColumns.toCollection().keys() as string[];
  }

  /**
   * Retrieves all PCA column names from the PCA data table in the database.
   *
   * Use the same logic as `getAllColumnNames` to save memory.
   * @pre-condition The pca data table exists
   * @post-condition Returns the array of all pca column primary keys
   * @returns {Promise<string[]>} A promise resolves to an array of column names.
   */
  async getPcaColumnNames(): Promise<string[]> {
    return await this.pcaColumns.toCollection().keys() as string[];
  }

  /**
   * Retrieves all standardized column names from the standardized data table in the database.
   *
   * Use the same logic as `getAllColumnNames` to save memory.
   * @pre-condition The standardized data table exists
   * @post-condition Returns the array of all standardized column primary keys
   * @returns {Promise<string[]>} A promise resolves to an array of column names.
   */
  async getStandardizedColumnNames(): Promise<string[]> {
    return await this.standardizedColumns.toCollection().keys() as string[];
  }

  /**
     * Closes the database connection
     * @pre-condition The database connection is open
     * @post-condition The database connection is closed
     */
  closeConnection() {
    this.close();
  }

  /**
   * Clears all tables in the database
   * @pre-condition None
   * @post-condition All tables in the database are cleared
   * @return {Promise<void>} A promise that resolves when all tables have been cleared.
   */
  clearTables(): Promise<void> {
    assert.ok(this.rawColumns, 'Raw columns table does not exist');
    assert.ok(this.statsColumns, 'Stats columns table does not exist');
    assert.ok(this.standardizedColumns, 'Standardized columns table does not exist');
    assert.ok(this.pcaColumns, 'PCA columns table does not exist');
    this.rawColumns.clear();
    this.statsColumns.clear();
    this.standardizedColumns.clear();
    this.pcaColumns.clear();
    return Promise.resolve();
  }
}
