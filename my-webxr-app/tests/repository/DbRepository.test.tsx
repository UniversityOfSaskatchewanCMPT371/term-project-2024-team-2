import Dexie from 'dexie';
import { v4 as uuidv4 } from 'uuid';
import * as assert from 'assert';
import DbRepository from '../../src/repository/DbRepository';
import Column, {
  TableName,
  NumericColumn,
  RawColumn,
  StatsColumn,
} from '../../src/repository/Column';
import DataPoint from '../../src/repository/DataPoint';

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
    const isRawEmpty = await repository.isTableEmpty(TableName.RAW);
    const isStatsEmpty = await repository.isTableEmpty(TableName.STATS);
    const isStandardizedEmpty = await repository.isTableEmpty(TableName.STANDARDIZED);
    const isPcaEmpty = await repository.isTableEmpty(TableName.PCA);

    expect(isRawEmpty).toBe(true);
    expect(isStatsEmpty).toBe(true);
    expect(isStandardizedEmpty).toBe(true);
    expect(isPcaEmpty).toBe(true);
  });

  test('isTableEmpty - Check a non empty table', async () => {
    const column = new Column<RawColumn>('test', [1, 2, 3]);
    await repository.addColumn(column, TableName.RAW);
    const isEmpty = await repository.isTableEmpty(TableName.RAW);

    expect(isEmpty).toBe(false);
  });

  test('addColumn - add points when db has duplicate columns - expect Exception', async () => {
    const column = new Column<RawColumn>('test', ['CMPT371', 'Osgood', 'Oculus']);
    const dup = new Column<RawColumn>('test', [1, 2, 3]);
    await repository.addColumn(column, TableName.RAW);

    await expect(repository.addColumn(dup, TableName.RAW))
      .rejects
      .toBeInstanceOf(Error);
  });

  test('getPoints - Given duplicate column name - expect Exception', async () => {
    const column = new Column<RawColumn>('test', [1, 2]);
    await repository.addColumn(column, TableName.RAW);

    await expect(repository.getPoints(
      'test',
      'test',
      'test',
    ))
      .rejects
    // confirm that it did throw an assertion error with the correct message
      .toThrow(new assert.AssertionError({ message: 'The three columns must be distinct but got: test,test,test!' }));
  });

  test('getPoints - Given non-existent column name - expect Exception', async () => {
    const column = new Column<RawColumn>('test', [1, 2]);
    await repository.addColumn(column, TableName.RAW);

    await expect(repository.getPoints(
      'test',
      'nonExistentColumn1',
      'nonExistentColumn2',
    ))
      .rejects
      .toThrow(new assert.AssertionError({ message: 'Column nonExistentColumn1 does not exist!' }));
  });

  test('getCSvColumnNames - Get all column names from raw data table', async () => {
    const testColumn1 = new Column<RawColumn>('column1', [1, 2, 3]);
    const testColumn2 = new Column<RawColumn>('column2', ['a', 'b', 'c']);
    const testColumn3 = new Column<RawColumn>('column3', [1.1, 2.2, 3.3]);
    repository.addColumn(testColumn1, TableName.RAW);
    repository.addColumn(testColumn2, TableName.RAW);
    repository.addColumn(testColumn3, TableName.RAW);

    const columnNames = await repository.getCsvColumnNames();

    expect(columnNames).toEqual(['column1', 'column2', 'column3']);
  });

  test('getCsvColumnNames - Get column names from empty table', async () => {
    const columnNames = await repository.getCsvColumnNames();

    expect(columnNames).toEqual([]);
  });

  test('getPcaColumnNames - Get all column names from pca data table', async () => {
    const testColumn1 = new Column<NumericColumn>('column1', [1, 2, 3]);
    const testColumn2 = new Column<NumericColumn>('column2', [10, 20, 30]);
    const testColumn3 = new Column<NumericColumn>('column3', [1.1, 2.2, 3.3]);
    repository.addColumn(testColumn1, TableName.PCA);
    repository.addColumn(testColumn2, TableName.PCA);
    repository.addColumn(testColumn3, TableName.PCA);

    const columnNames = await repository.getPcaColumnNames();

    expect(columnNames).toEqual(['column1', 'column2', 'column3']);
  });

  test('getPcaColumnNames - Get column names from empty table', async () => {
    const columnNames = await repository.getPcaColumnNames();

    expect(columnNames).toEqual([]);
  });

  test('getStandardizedColumnNames - Get all column names from standardized data table', async () => {
    const testColumn1 = new Column<NumericColumn>('column1', [1, 2, 3]);
    const testColumn2 = new Column<NumericColumn>('column2', [10, 20, 30]);
    const testColumn3 = new Column<NumericColumn>('column3', [1.1, 2.2, 3.3]);
    repository.addColumn(testColumn1, TableName.STANDARDIZED);
    repository.addColumn(testColumn2, TableName.STANDARDIZED);
    repository.addColumn(testColumn3, TableName.STANDARDIZED);

    const columnNames = await repository.getStandardizedColumnNames();

    expect(columnNames).toEqual(['column1', 'column2', 'column3']);
  });

  test('getStandardizedColumnNames - Get column names from empty table', async () => {
    const columnNames = await repository.getStandardizedColumnNames();

    expect(columnNames).toEqual([]);
  });

  test('getStatsColumnNames - Get all column names from stat data table', async () => {
    const testColumn1 = new Column<StatsColumn>('column1', {
      count: 3,
      sum: 6,
      sumOfSquares: 14,
      mean: 2,
      stdDev: 1,
    });
    const testColumn2 = new Column<StatsColumn>('column2', {
      count: 3,
      sum: 6,
      sumOfSquares: 14,
      mean: 2,
      stdDev: 1,
    });
    const testColumn3 = new Column<StatsColumn>('column3', {
      count: 3,
      sum: 6,
      sumOfSquares: 14,
      mean: 2,
      stdDev: 1,
    });
    repository.addColumn(testColumn1, TableName.STATS);
    repository.addColumn(testColumn2, TableName.STATS);
    repository.addColumn(testColumn3, TableName.STATS);

    const columnNames = await repository.getStatsColumnNames();

    expect(columnNames).toEqual(['column1', 'column2', 'column3']);
  });

  test('getStatsColumnNames - Get column names from empty table', async () => {
    const columnNames = await repository.getStatsColumnNames();

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
    await repository.addColumn(testColumn, TableName.STATS);

    const retrievedColumn = await repository.getStatsColumn('test');
    expect(retrievedColumn).toEqual(testColumn);
  });

  test('getStatsColumn - Attempt to retrieve a non-existent stats column', async () => {
    await expect(repository.getStatsColumn('nonExistentColumn'))
      .rejects
      .toThrow(new assert.AssertionError({ message: 'Column nonExistentColumn does not exist!' }));
  });

  test('getColumn - Retrieve a data column from Raw data table', async () => {
    const testColumn = new Column<RawColumn>('testColumn', [1, 2, 3]);
    await repository.addColumn(testColumn, TableName.RAW);

    const retrievedColumn = await repository.getColumn('testColumn', TableName.RAW);
    expect(retrievedColumn).toEqual(testColumn);
  });

  test('getColumn - Retrieve non-existent data column', async () => {
    await expect(repository.getColumn('nonExistentColumn', TableName.RAW))
      .rejects
      .toThrow(new assert.AssertionError({ message: 'Column nonExistentColumn does not exist!' }));
  });
});

describe('DbRepository - Test getPoints()', () => {
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

  test('getPoints - Given duplicate column name - expect Exception', async () => {
    const column = new Column<RawColumn>('test', [1, 2]);
    await repository.addColumn(column, TableName.RAW);

    await expect(repository.getPoints('test', 'test', 'test'))
      .rejects
    // confirm that it did throw an assertion error with the correct message
      .toThrow(new assert.AssertionError({ message: 'The three columns must be distinct but got: test,test,test!' }));
  });

  test('getPoints - Given non-existent column name - expect Exception', async () => {
    const column = new Column<RawColumn>('test', [1, 2]);
    await repository.addColumn(column, TableName.RAW);

    await expect(repository.getPoints('test', 'nonExistentColumn1', 'nonExistentColumn2'))
      .rejects
      .toThrow(new assert.AssertionError({ message: 'Column nonExistentColumn1 does not exist!' }));
  });

  test('getPoints - Given One column of string type - expect Exception', async () => {
    const column1 = new Column<RawColumn>('column1', [1.1, 2.2, 3.3]);
    const column2 = new Column('column2', ['CheeseCake', 'Takoyaki', 'Poutine']);
    const column3 = new Column('column3', [-1.1, -2.2, -3.3]);
    await repository.addColumn(column1, TableName.RAW);
    await repository.addColumn(column2, TableName.RAW);
    await repository.addColumn(column3, TableName.RAW);

    await expect(repository.getPoints('column1', 'column2', 'column3'))
      .rejects
      .toThrow(new assert.AssertionError({ message: 'ColumnY must be numeric!' }));
  });

  test('getPoints - Get points of 3 RAW DATA columns', async () => {
    const column1 = new Column<RawColumn>('column1', [1.1, 2.2, 3.3]);
    const column2 = new Column<RawColumn>('column2', [0.1, 0.2, 0.3]);
    const column3 = new Column<RawColumn>('column3', [-1.1, -2.2, -3.3]);
    await repository.addColumn(column1, TableName.RAW);
    await repository.addColumn(column2, TableName.RAW);
    await repository.addColumn(column3, TableName.RAW);

    const result = await repository.getPoints('column1', 'column2', 'column3');

    expect(result[0]).toHaveLength(3);
    expect(result[1]).toHaveLength(3);
    const expected = [new DataPoint(1.1, 0.1, -1.1),
      new DataPoint(2.2, 0.2, -2.2),
      new DataPoint(3.3, 0.3, -3.3)];
    expect(result[0]).toEqual(expect.arrayContaining(expected));
    expect(result[1]).toEqual([3.3, 0.3, -1.1]);
  });

  test('getPoints - Get points of 3 PCA DATA columns', async () => {
    const column1 = new Column<NumericColumn>('column1', [1.1, 2.2, 3.3]);
    const column2 = new Column<NumericColumn>('column2', [0.1, 0.2, 0.3]);
    const column3 = new Column<NumericColumn>('column3', [-1.1, -2.2, -3.3]);
    await repository.addColumn(column1, TableName.PCA);
    await repository.addColumn(column2, TableName.PCA);
    await repository.addColumn(column3, TableName.PCA);

    const result = await repository.getPoints('column1', 'column2', 'column3');

    expect(result[0]).toHaveLength(3);
    expect(result[1]).toHaveLength(3);
    const expected = [new DataPoint(1.1, 0.1, -1.1),
      new DataPoint(2.2, 0.2, -2.2),
      new DataPoint(3.3, 0.3, -3.3)];
    expect(result[0]).toEqual(expect.arrayContaining(expected));
    expect(result[1]).toEqual([3.3, 0.3, -1.1]);
  });

  test('getPoints - Get points of 2 PCA columns and 1 Raw column', async () => {
    const column1 = new Column<NumericColumn>('PC1', [1.1, 2.2, 3.3]);
    const column2 = new Column<NumericColumn>('PC2', [0.1, 0.2, 0.3]);
    const column3 = new Column<NumericColumn>('column3', [-1.1, -2.2, -3.3]);
    await repository.addColumn(column1, TableName.PCA);
    await repository.addColumn(column2, TableName.PCA);
    await repository.addColumn(column3, TableName.RAW);

    const result = await repository.getPoints('PC1', 'PC2', 'column3');

    expect(result[0]).toHaveLength(3);
    expect(result[1]).toHaveLength(3);
    const expected = [new DataPoint(1.1, 0.1, -1.1),
      new DataPoint(2.2, 0.2, -2.2),
      new DataPoint(3.3, 0.3, -3.3)];
    expect(result[0]).toEqual(expect.arrayContaining(expected));
    expect(result[1]).toEqual([3.3, 0.3, -1.1]);
  });

  test('getPoints - Get points of 1 PCA column and 2 Raw columns', async () => {
    const column1 = new Column<NumericColumn>('PC1', [1.1, 2.2, 3.3]);
    const column2 = new Column<NumericColumn>('column2', [0.1, 0.2, 0.3]);
    const column3 = new Column<NumericColumn>('column3', [-1.1, -2.2, -3.3]);
    await repository.addColumn(column1, TableName.PCA);
    await repository.addColumn(column2, TableName.RAW);
    await repository.addColumn(column3, TableName.RAW);

    const result = await repository.getPoints('PC1', 'column2', 'column3');

    expect(result[0]).toHaveLength(3);
    expect(result[1]).toHaveLength(3);
    const expected = [new DataPoint(1.1, 0.1, -1.1),
      new DataPoint(2.2, 0.2, -2.2),
      new DataPoint(3.3, 0.3, -3.3)];
    expect(result[0]).toEqual(expect.arrayContaining(expected));
    expect(result[1]).toEqual([3.3, 0.3, -1.1]);
  });
});
