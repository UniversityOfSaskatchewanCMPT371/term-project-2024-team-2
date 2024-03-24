// have to import fake-indexeddb/auto before dexie
import 'fake-indexeddb/auto';
import Dexie from 'dexie';
import { v4 as uuidv4 } from 'uuid';
import * as assert from 'assert';
import DbRepository from '../../src/repository/DbRepository';
import Column, { ColumnType, DataColumn, StatsColumn } from '../../src/repository/Column';

describe('DbRepository Test', () => {
  let repository: DbRepository;
  let testDbName: string;

  beforeEach(() => {
    // create a new unique db name for each test
    testDbName = `TestDb${uuidv4()}`;
    // confirm this db does not exist yet
    expect(Dexie.exists(testDbName)).resolves.toBe(false);

    // create a new repository for each test
    repository = new DbRepository(testDbName);
  });

  afterEach(async () => {
    // have to close the connection before deleting the db
    // not closing the connection will cause Dexie.delete to hang
    repository.closeConnection();
    await Dexie.delete(testDbName);
  });

  test('isTableEmpty - Check all empty tables', async () => {
    const isRawEmpty = await repository.isTableEmpty(ColumnType.RAW);
    const isStatsEmpty = await repository.isTableEmpty(ColumnType.STATS);
    const isStandardizedEmpty = await repository.isTableEmpty(ColumnType.STANDARDIZED);
    const isPcaEmpty = await repository.isTableEmpty(ColumnType.PCA);

    expect(isRawEmpty).toBe(true);
    expect(isStatsEmpty).toBe(true);
    expect(isStandardizedEmpty).toBe(true);
    expect(isPcaEmpty).toBe(true);
  });

  test('isTableEmpty - Check a non empty table', async () => {
    const column = new Column<DataColumn>('test', [1, 2, 3]);
    await repository.addColumn(column, ColumnType.RAW);
    const isEmpty = await repository.isTableEmpty(ColumnType.RAW);

    expect(isEmpty).toBe(false);
  });

  test('addColumn - add points when db has duplicate columns - expect Exception', async () => {
    const column = new Column<DataColumn>('test', ['CMPT371', 'Osgood', 'Oculus']);
    const dup = new Column<DataColumn>('test', [1, 2, 3]);
    await repository.addColumn(column, ColumnType.RAW);

    await expect(repository.addColumn(dup, ColumnType.RAW))
      .rejects
      .toBeInstanceOf(Error);
  });

  test('getPoints - Given duplicate column name - expect Exception', async () => {
    const column = new Column<DataColumn>('test', [1, 2]);
    await repository.addColumn(column, ColumnType.RAW);

    await expect(repository.getPoints(
      false,
      'test',
      'test',
      'test',
    ))
      .rejects
    // confirm that it did throw an assertion error with the correct message
      .toThrow(new assert.AssertionError({ message: 'The three columns must be distinct but got: test,test,test!' }));
  });

  test('getPoints - Given non-existent column name - expect Exception', async () => {
    const column = new Column<DataColumn>('test', [1, 2]);
    await repository.addColumn(column, ColumnType.RAW);

    await expect(repository.getPoints(
      false,
      'test',
      'nonExistentColumn1',
      'nonExistentColumn2',
    ))
      .rejects
      .toThrow(new assert.AssertionError({ message: 'Column nonExistentColumn1 does not exist!' }));
  });

  test('getAllColumnNames - Get all column names from statsColumns or the look up table', async () => {
    const testColumn1 = new Column<DataColumn>('column1', [1, 2, 3]);
    const testColumn2 = new Column<DataColumn>('column2', ['a', 'b', 'c']);
    const testColumn3 = new Column<DataColumn>('column3', [1.1, 2.2, 3.3]);
    repository.addColumn(testColumn1, ColumnType.RAW);
    repository.addColumn(testColumn2, ColumnType.RAW);
    repository.addColumn(testColumn3, ColumnType.RAW);

    const columnNames = await repository.getAllColumnNames();

    expect(columnNames).toEqual(['column1', 'column2', 'column3']);
  });

  test('getAllColumnNames - Get column names from empty table', async () => {
    const columnNames = await repository.getAllColumnNames();

    expect(columnNames).toEqual([]);
  });

  test('getStatsColumn - Retrieve a stats column from the look up table', async () => {
    const testColumn = new Column<StatsColumn>('test', {
      count: 3,
      sum: 6,
      sumOfSquares: 14,
      mean: 2,
      stdDev: 1,
    });
    await repository.addColumn(testColumn, ColumnType.STATS);

    const retrievedColumn = await repository.getStatsColumn('test');
    expect(retrievedColumn).toEqual(testColumn);
  });

  test('getStatsColumn - Attempt to retrieve a non-existent stats column', async () => {
    await expect(repository.getStatsColumn('nonExistentColumn'))
      .rejects
      .toThrow(new assert.AssertionError({ message: 'Column nonExistentColumn does not exist!' }));
  });

  test('getDataColumn - Retrieve a data column from Raw data table', async () => {
    const testColumn = new Column<DataColumn>('testColumn', [1, 2, 3]);
    await repository.addColumn(testColumn, ColumnType.RAW);

    const retrievedColumn = await repository.getDataColumn('testColumn', ColumnType.RAW);
    expect(retrievedColumn).toEqual(testColumn);
  });

  test('getDataColumn - Retrieve non-existent data column', async () => {
    await expect(repository.getDataColumn('nonExistentColumn', ColumnType.RAW))
      .rejects
      .toThrow(new assert.AssertionError({ message: 'Column nonExistentColumn does not exist!' }));
  });
});
