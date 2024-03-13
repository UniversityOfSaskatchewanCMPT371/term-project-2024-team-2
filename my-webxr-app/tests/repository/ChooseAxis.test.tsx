import 'fake-indexeddb/auto';
import Dexie from 'dexie';
import { v4 as uuidv4 } from 'uuid';
import DbRepository from '../../src/repository/DbRepository';
import getColumnNames, { getIntColumns, isIntColumn } from '../../src/repository/FilterAxis';
import getMaxXYZ from '../../src/repository/GetMaxXYZRange';
import { getColumnTitles, setRepresentingColumns } from '../../src/utils/GetColumnNames';

describe('Test Functions in FilterAxis', () => {
  test('isIntColumn - Check if integer column is integers only', async () => {
    const data = { name: 'col1', values: [1, 2, 3] };
    const result = isIntColumn(data);
    expect(result).toEqual(true);
  });

  test('isIntColumn - Check if non integer column is integers only', async () => {
    const data = { name: 'col1', values: ['string', 'test', 'hi'] };
    const result = isIntColumn(data);
    expect(result).toEqual(false);
  });

  test('isIntColumn - Check if mixed type column is integers only', async () => {
    const data = { name: 'col1', values: [1, 'test', 3] };
    const result = isIntColumn(data);
    expect(result).toEqual(false);
  });

  test('getIntColumns - Get the columns (all have integers) from test data', async () => {
    const data = [
      { name: 'column1', values: [1, 2, 3] },
      { name: 'column2', values: [4, 5, 6] },
      { name: 'column3', values: [7, 8, 9] },
    ];
    const result = getIntColumns(data);
    expect(result).toHaveLength(3);
    const expected = [
      { name: 'column1', values: [1, 2, 3] },
      { name: 'column2', values: [4, 5, 6] },
      { name: 'column3', values: [7, 8, 9] },
    ];
    expect(result).toEqual(expect.arrayContaining(expected));
  });

  test('getIntColumns - Get the columns, should ignore the bad column', async () => {
    const data = [
      { name: 'column1', values: [1, 2, 3] },
      { name: 'column2', values: [4, 5, 6] },
      { name: 'column3', values: [7, 8, 9] },
      { name: 'badColumn', values: [6, 'hello', 'string'] },
    ]; const result = getIntColumns(data);
    expect(result).toHaveLength(3);
    const expected = [
      { name: 'column1', values: [1, 2, 3] },
      { name: 'column2', values: [4, 5, 6] },
      { name: 'column3', values: [7, 8, 9] },
    ];
    expect(result).toEqual(expect.arrayContaining(expected));
  });

  test('getColumnNames - Get the names of the columns', async () => {
    const data = [
      { name: 'column1', values: [1, 2, 3] },
      { name: 'column2', values: [4, 5, 6] },
      { name: 'column3', values: [7, 8, 9] },
    ]; const result = getColumnNames(data);
    const expected = ['column1', 'column2', 'column3'];
    expect(result).toEqual(expect.arrayContaining(expected));
  });

  test('getColumnNames - Get the names of the columns, ignoring the non int column', async () => {
    const data = [
      { name: 'column1', values: [1, 2, 3] },
      { name: 'column2', values: [4, 5, 6] },
      { name: 'column3', values: [7, 8, 9] },
      { name: 'badColumn', values: [6, 'hello', 'string'] },
    ]; const result = getColumnNames(data);
    const expected = ['column1', 'column2', 'column3'];
    expect(result).toEqual(expect.arrayContaining(expected));
  });

  test('getMaxXYZ - Get the max value for the XYZ range (negative max value)', async () => {
    const xAxis = { name: 'X', values: [100, 2, 30] };
    const yAxis = { name: 'Y', values: [4, 5, 600] };
    const zAxis = { name: 'Z', values: [-700, 80, 9] };
    const result = getMaxXYZ(xAxis, yAxis, zAxis);
    const expected = 700;
    expect(result).toEqual(expected);
  });

  test('getMaxXYZ - Get the max value for the XYZ range', async () => {
    const xAxis = { name: 'X', values: [100, 2, 30] };
    const yAxis = { name: 'Y', values: [4, 5, 600] };
    const zAxis = { name: 'Z', values: [700, 80, 9] };
    const result = getMaxXYZ(xAxis, yAxis, zAxis);
    const expected = 700;
    expect(result).toEqual(expected);
  });

  test('getMaxXYZ - Get the max value for the XYZ range (duplicate max value)', async () => {
    const xAxis = { name: 'X', values: [0, 2, -10] };
    const yAxis = { name: 'Y', values: [4, 5, -100] };
    const zAxis = { name: 'Z', values: [100, 80, 9] };
    const result = getMaxXYZ(xAxis, yAxis, zAxis);
    const expected = 100;
    expect(result).toEqual(expected);
  });
});

describe('FilterAxis Test With Repository', () => {
  let repository: DbRepository;
  let testDbName: string;

  beforeEach(() => {
    // create a new unique db name for each test
    testDbName = `TestDb${uuidv4()}`;
    // confirm this db does not exist yet
    expect(Dexie.exists(testDbName)).resolves.toBe(false);

    // create a new repository for each test
    repository = new DbRepository(testDbName);
    repository.addColumn({ name: 'column1', values: [1, 2, 3] });
    repository.addColumn({ name: 'column2', values: [4, 5, 6] });
    repository.addColumn({ name: 'column3', values: [7, 8, 9] });
  });

  afterEach(async () => {
    // have to close the connection before deleting the db
    // not closing the connection will cause Dexie.delete to hang
    repository.closeConnection();
    await Dexie.delete(testDbName);
  });
  test('getPossibleAxes - Get the possible axes with data in repo', async () => {
    const result = await repository.getPossibleAxes();
    const expected = ['column1', 'column2', 'column3'];
    expect(result).toEqual(expect.arrayContaining(expected));
  });

  test('getPossibleAxes - Get the possible axes with data in repo containing a column of bad data', async () => {
    await repository.addColumn({ name: 'badColumn', values: ['1', 'test', 3] });
    const result = await repository.getPossibleAxes();
    const expected = ['column1', 'column2', 'column3'];
    expect(result).toEqual(expect.arrayContaining(expected));
  });

  test('selectRepresentingColumns - Get the columns of the select XYZ axes', async () => {
    const result = await repository.selectRepresentingColumn('column1', 'column2', 'column3');
    const expected = [
      { name: 'column1', values: [1, 2, 3] },
      { name: 'column2', values: [4, 5, 6] },
      { name: 'column3', values: [7, 8, 9] },
    ];
    expect(result).toEqual(expect.arrayContaining(expected));
  });

  test('selectRepresentingColumns - Get the columns of the select XYZ axes, more than 3 rows in repo', async () => {
    await repository.addColumn({ name: 'X', values: [100, 20, 3] });
    await repository.addColumn({ name: 'Y', values: [-53, 53, 53] });
    await repository.addColumn({ name: 'Z', values: [5, -5, 5] });

    const result = await repository.selectRepresentingColumn('X', 'Y', 'Z');
    const expected = [
      { name: 'X', values: [100, 20, 3] },
      { name: 'Y', values: [-53, 53, 53] },
      { name: 'Z', values: [5, -5, 5] },
    ];
    expect(result).toEqual(expect.arrayContaining(expected));
  });

  test('getColumnTitles - Gets all possible column names from db', async () => {
    await repository.addColumn({ name: 'X', values: [100, 20, 3] });
    await repository.addColumn({ name: 'Y', values: [-53, 53, 53] });
    await repository.addColumn({ name: 'Z', values: [5, -5, 5] });

    const result = await getColumnTitles(testDbName);
    const expected = ['X', 'Y', 'Z', 'column1', 'column2', 'column3'];
    expect(result).toEqual(expect.arrayContaining(expected));
  });

  test('getColumnTitles - Gets all possible column names from db with a string value', async () => {
    await repository.addColumn({ name: 'X', values: ['string', 20, 3] });

    const result = await getColumnTitles(testDbName);
    const expected = ['column1', 'column2', 'column3'];
    expect(result).toEqual(expect.arrayContaining(expected));
  });

  test('selectRepresentingColumn - Gets x, y, z columns', async () => {
    await repository.addColumn({ name: 'X', values: ['string', 20, 3] });
    const result = await setRepresentingColumns(testDbName, 'column1', 'column2', 'column3');
    const expected = [{ name: 'column1', values: [1, 2, 3] },
      { name: 'column2', values: [4, 5, 6] },
      { name: 'column3', values: [7, 8, 9] }];
    expect(result).toEqual(expect.arrayContaining(expected));
  });
});
