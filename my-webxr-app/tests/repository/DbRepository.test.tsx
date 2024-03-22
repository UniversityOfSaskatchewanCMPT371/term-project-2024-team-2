// have to import fake-indexeddb/auto before dexie
import 'fake-indexeddb/auto';
import Dexie from 'dexie';
import { v4 as uuidv4 } from 'uuid';
import * as assert from 'assert';
import DbRepository from '../../src/repository/DbRepository';
import DataPoint from '../../src/repository/DataPoint';
import Column, { ColumnType, DataColumn } from '../../src/repository/Column';

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

  test('getPoints - Get all points of 3 given columns', async () => {
    const column1 = new Column<DataColumn>('column1', [1.1, null, 3.3]);
    const column2 = new Column<DataColumn>('column2', ['CheeseCake', 'Takoyaki', 'Poutine']);
    const column3 = new Column<DataColumn>('column3', [-1.1, -2.2, -3.3]);
    repository.addColumn(column1, ColumnType.RAW);
    repository.addColumn(column2, ColumnType.RAW);
    repository.addColumn(column3, ColumnType.RAW);

    const result = await repository.getPoints(false, 'column1', 'column2', 'column3');

    expect(result).toHaveLength(3);
    const expected = [new DataPoint(false, 1.1, 'CheeseCake', -1.1),
      new DataPoint(true, null, 'Takoyaki', -2.2),
      new DataPoint(false, 3.3, 'Poutine', -3.3)];
    expect(result).toEqual(expect.arrayContaining(expected));
  });

  test('getPoints - Get points of 3 given columns - filter out points missing data', async () => {
    const column1 = new Column<DataColumn>('column1', [1.1, null, 3.3]);
    const column2 = new Column<DataColumn>('column2', ['CheeseCake', 'Takoyaki', 'Poutine']);
    const column3 = new Column<DataColumn>('column3', [-1.1, -2.2, -3.3]);
    repository.addColumn(column1, ColumnType.RAW);
    repository.addColumn(column2, ColumnType.RAW);
    repository.addColumn(column3, ColumnType.RAW);

    const result = await repository.getPoints(true, 'column1', 'column2', 'column3');

    expect(result).toHaveLength(2);
    const expected = [new DataPoint(false, 1.1, 'CheeseCake', -1.1),
      new DataPoint(false, 3.3, 'Poutine', -3.3)];
    expect(result).toEqual(expect.arrayContaining(expected));
  });

  test('getAllColumnNames - Get all column names from statsColumns or the look up table', async () => {
    const testColumn1 = new Column<DataColumn>('column1', [1, 2, 3]);
    const testColumn2 = new Column<DataColumn>('column2', ['a', 'b', 'c']);
    const testColumn3 = new Column<DataColumn>('column3', [1.1, 2.2, 3.3]);
    repository.addColumn(testColumn1, ColumnType.STATS);
    repository.addColumn(testColumn2, ColumnType.STATS);
    repository.addColumn(testColumn3, ColumnType.STATS);

    const columnNames = await repository.getAllColumnNames();

    expect(columnNames).toEqual(['column1', 'column2', 'column3']);
  });

  test('getAllColumnNames - Get column names from empty table', async () => {
    const columnNames = await repository.getAllColumnNames();

    expect(columnNames).toEqual([]);
  });
});
