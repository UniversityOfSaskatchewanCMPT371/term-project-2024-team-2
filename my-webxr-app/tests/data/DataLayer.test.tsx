import { afterEach, describe, expect } from 'vitest';
import { Matrix } from 'ml-matrix';
import { v4 as uuidv4 } from 'uuid';
import Dexie from 'dexie';
import PrivilegedDataLayer from './PrivilegedDataLayer';
import DataLayer, { BatchedDataStream } from '../../src/data/DataLayer';
import Column, {
  TableName,
  NumericColumn,
  RawColumn,
  StatsColumn,
} from '../../src/repository/Column';
import { Repository } from '../../src/repository/Repository';
import DbRepository from '../../src/repository/DbRepository';

describe('Validate transposeData() operation', () => {
  test('transposeData with an empty data table (0x0)', async () => {
    const rowBased: BatchedDataStream = [];
    const columnBased: BatchedDataStream = [];

    expect(PrivilegedDataLayer.transposeData(rowBased)).toEqual(columnBased);
  });

  test('transposeData with a single row/column of data (1x1)', async () => {
    const rowBased = [['hello']];
    const columnBased = [['hello']];

    expect(PrivilegedDataLayer.transposeData(rowBased)).toEqual(columnBased);
  });

  test('transposeData with a single column and two rows of data (2x1)', async () => {
    const rowBased = [['col1'], ['value1']];
    const columnBased = [['col1', 'value1']];

    expect(PrivilegedDataLayer.transposeData(rowBased)).toEqual(columnBased);
  });

  test('transposeData with a single column and five rows of data (5x1)', async () => {
    const rowBased = [['col1'], ['value1'], ['value2'], ['value3'], ['value4']];
    const columnBased = [['col1', 'value1', 'value2', 'value3', 'value4']];

    expect(PrivilegedDataLayer.transposeData(rowBased)).toEqual(columnBased);
  });

  test('transposeData with a single row and two columns of data (1x2)', async () => {
    const rowBased = [['col1', 'col2']];
    const columnBased = [['col1'], ['col2']];

    expect(PrivilegedDataLayer.transposeData(rowBased)).toEqual(columnBased);
  });

  test('transposeData with a single row and five columns of data (1x5)', async () => {
    const rowBased = [['col1', 'col2', 'col3', 'col4', 'col5']];
    const columnBased = [['col1'], ['col2'], ['col3'], ['col4'], ['col5']];

    expect(PrivilegedDataLayer.transposeData(rowBased)).toEqual(columnBased);
  });

  test('transposeData with two rows and two columns of data (2x2)', async () => {
    const rowBased = [['col1', 'col2'], ['value1', 'value2']];
    const columnBased = [['col1', 'value1'], ['col2', 'value2']];

    expect(PrivilegedDataLayer.transposeData(rowBased)).toEqual(columnBased);
  });

  test('transposeData with five rows and five columns of data (5x5)', async () => {
    const rowBased = [
      ['col1', 'col2', 'col3', 'col4', 'col5'],
      ['row1-1', 'row1-2', 'row1-3', 'row1-4', 'row1-5'],
      ['row2-1', 'row2-2', 'row2-3', 'row2-4', 'row2-5'],
      ['row3-1', 'row3-2', 'row3-3', 'row3-4', 'row3-5'],
      ['row4-1', 'row4-2', 'row4-3', 'row4-4', 'row4-5'],
    ];
    const columnBased = [
      ['col1', 'row1-1', 'row2-1', 'row3-1', 'row4-1'],
      ['col2', 'row1-2', 'row2-2', 'row3-2', 'row4-2'],
      ['col3', 'row1-3', 'row2-3', 'row3-3', 'row4-3'],
      ['col4', 'row1-4', 'row2-4', 'row3-4', 'row4-4'],
      ['col5', 'row1-5', 'row2-5', 'row3-5', 'row4-5'],
    ];

    expect(PrivilegedDataLayer.transposeData(rowBased)).toEqual(columnBased);
  });
});

describe('Validate calculateColumnsStatistics() operation', () => {
  let columnName: string;
  let testColumnValues: RawColumn;
  let testColumn: Column<NumericColumn>;
  let resultColumn: Column<StatsColumn>;
  let expectedColumnValues: StatsColumn;
  let expectedColumn: Column<StatsColumn>;

  test('calculateStatistics on a normal data column', () => {
    columnName = 'test 1';
    testColumnValues = [1, 2, 3];
    testColumn = new Column<NumericColumn>(columnName, testColumnValues);
    resultColumn = PrivilegedDataLayer.calculateColumnStatistics(testColumn, columnName);

    expectedColumnValues = {
      count: 3,
      sum: 6,
      sumOfSquares: 2,
      mean: 2,
      stdDev: 1,
    };
    expectedColumn = new Column<StatsColumn>(columnName, expectedColumnValues);
    expect(resultColumn.values.count).toEqual(expectedColumn.values.count);
    expect(resultColumn.values.sum).toEqual(expectedColumn.values.sum);
    expect(resultColumn.values.sumOfSquares).toEqual(expectedColumn.values.sumOfSquares);
    expect(resultColumn.values.mean).toEqual(expectedColumn.values.mean);
    expect(resultColumn.values.stdDev).toEqual(expectedColumn.values.stdDev);
  });

  test('calculateStatistics on a constant data column, has no stdDev', () => {
    columnName = 'test 1';
    testColumnValues = [2, 2, 2];
    testColumn = new Column<NumericColumn>(columnName, testColumnValues);
    resultColumn = PrivilegedDataLayer.calculateColumnStatistics(testColumn, columnName);

    expectedColumnValues = {
      count: 3,
      sum: 6,
      sumOfSquares: 0,
      mean: 2,
      stdDev: 0,
    };
    expectedColumn = new Column<StatsColumn>(columnName, expectedColumnValues);
    expect(resultColumn.values.count).toEqual(expectedColumn.values.count);
    expect(resultColumn.values.sum).toEqual(expectedColumn.values.sum);
    expect(resultColumn.values.sumOfSquares).toEqual(expectedColumn.values.sumOfSquares);
    expect(resultColumn.values.mean).toEqual(expectedColumn.values.mean);
    expect(resultColumn.values.stdDev).toEqual(expectedColumn.values.stdDev);
  });

  test('calculateStatistics on a single point data column', () => {
    columnName = 'test 1';
    testColumnValues = [3];
    testColumn = new Column<NumericColumn>(columnName, testColumnValues);
    resultColumn = PrivilegedDataLayer.calculateColumnStatistics(testColumn, columnName);

    expectedColumnValues = {
      count: 1,
      sum: 3,
      sumOfSquares: 0,
      mean: 3,
      stdDev: 0,
    };
    expectedColumn = new Column<StatsColumn>(columnName, expectedColumnValues);
    expect(resultColumn.values.count).toEqual(expectedColumn.values.count);
    expect(resultColumn.values.sum).toEqual(expectedColumn.values.sum);
    expect(resultColumn.values.sumOfSquares).toEqual(expectedColumn.values.sumOfSquares);
    expect(resultColumn.values.mean).toEqual(expectedColumn.values.mean);
    expect(resultColumn.values.stdDev).toEqual(expectedColumn.values.stdDev);
  });

  test('calculateStatistics on a two points data column', () => {
    columnName = 'test 1';
    testColumnValues = [22, 33];
    testColumn = new Column<NumericColumn>(columnName, testColumnValues);
    resultColumn = PrivilegedDataLayer.calculateColumnStatistics(testColumn, columnName);
    expectedColumnValues = {
      count: 2,
      sum: 55,
      sumOfSquares: 60.5,
      mean: 27.5,
      stdDev: 7.778,
    };
    expectedColumn = new Column<StatsColumn>(columnName, expectedColumnValues);
    expect(resultColumn.values.count).toEqual(expectedColumn.values.count);
    expect(resultColumn.values.sum).toEqual(expectedColumn.values.sum);
    expect(resultColumn.values.sumOfSquares).toEqual(expectedColumn.values.sumOfSquares);
    expect(resultColumn.values.mean).toEqual(expectedColumn.values.mean);
    expect(resultColumn.values.stdDev).toBeCloseTo(expectedColumn.values.stdDev, 3);
  });
});

describe('Validate storeCSV() operation', () => {
  let dbName: string;
  let dataLayer: DataLayer;
  let repository: Repository;

  beforeEach(() => {
    dbName = `Test_DB${uuidv4()}`;
    expect(Dexie.exists(dbName)).resolves.toBe(false);

    dataLayer = new PrivilegedDataLayer(dbName);
    // We can't create a new repository as that would make two connections to the same DB.
    repository = (dataLayer as PrivilegedDataLayer).getInternalRepository();
  });

  afterEach(async () => {
    // Close connection before deleting; this is private, so we need to typecast.
    (repository as DbRepository).closeConnection();
    await Dexie.delete(dbName);
  });

  test('should store 1 batch correctly', async () => {
    const batchItems: BatchedDataStream = [
      ['column1', 'column2'],
      ['value1a', 'value2a'],
      ['value1b', 'value2b'],
      ['value1c', 'value2c'],
    ];

    const resolve = await dataLayer.storeCSV(batchItems);
    expect(resolve).toEqual(true);

    const column1 = await repository.getColumn('column1', TableName.RAW);
    const column2 = await repository.getColumn('column2', TableName.RAW);

    expect(column1.values).toEqual(['value1a', 'value1b', 'value1c']);
    expect(column2.values).toEqual(['value2a', 'value2b', 'value2c']);
  });

  test('should store 2 batch correctly', async () => {
    const firstBatchItems: BatchedDataStream = [
      ['column1', 'column2'],
      ['value1a', 'value2a'],
      ['value1b', 'value2b'],
      ['value1c', 'value2c'],
    ];

    const secondBatchItems: BatchedDataStream = [
      ['value1d', 'value2d'],
      ['value1e', 'value2e'],
      ['value1f', 'value2f'],
    ];

    const resolve1 = await dataLayer.storeCSV(firstBatchItems);
    const resolve2 = await dataLayer.storeCSV(secondBatchItems);

    expect(resolve1).toEqual(true);
    expect(resolve2).toEqual(true);

    const column1 = await repository.getColumn('column1', TableName.RAW);
    const column2 = await repository.getColumn('column2', TableName.RAW);

    expect(column1.values).toEqual(['value1a', 'value1b', 'value1c', 'value1d', 'value1e', 'value1f']);
    expect(column2.values).toEqual(['value2a', 'value2b', 'value2c', 'value2d', 'value2e', 'value2f']);
  });

  test('should store 3 batch correctly', async () => {
    const firstBatchItems: BatchedDataStream = [
      ['column1', 'column2'],
      ['value1a', 'value2a'],
      ['value1b', 'value2b'],
    ];
    const secondBatchItems: BatchedDataStream = [
      ['value1c', 'value2c'],
      ['value1d', 'value2d'],
    ];
    const thirdBatchItems: BatchedDataStream = [
      ['value1e', 'value2e'],
      ['value1f', 'value2f'],
    ];

    const resolve1 = await dataLayer.storeCSV(firstBatchItems);
    const resolve2 = await dataLayer.storeCSV(secondBatchItems);
    const resolve3 = await dataLayer.storeCSV(thirdBatchItems);

    expect(resolve1).toEqual(true);
    expect(resolve2).toEqual(true);
    expect(resolve3).toEqual(true);

    const column1 = await repository.getColumn('column1', TableName.RAW);
    const column2 = await repository.getColumn('column2', TableName.RAW);

    expect(column1.values).toEqual(['value1a', 'value1b', 'value1c', 'value1d', 'value1e', 'value1f']);
    expect(column2.values).toEqual(['value2a', 'value2b', 'value2c', 'value2d', 'value2e', 'value2f']);
  });
});

describe('Validate standardizeQualityColumn() operation', () => {
  let dbName: string;
  let dataLayer: DataLayer;
  let repository: Repository;
  let testRawColumn: Column<NumericColumn>;
  let testStatsColumn: Column<StatsColumn>;
  let resultColumn: Column<NumericColumn>;
  let expectStandardizedColumn: Array<number>;

  beforeEach(() => {
    dbName = `Test_DB${uuidv4()}`;
    expect(Dexie.exists(dbName)).resolves.toBe(false);

    dataLayer = new PrivilegedDataLayer(dbName);
    // We can't create a new repository as that would make two connections to the same DB.
    repository = (dataLayer as PrivilegedDataLayer).getInternalRepository();
  });

  afterEach(async () => {
    // Close connection before deleting; this is private, so we need to typecast.
    (repository as DbRepository).closeConnection();
    await Dexie.delete(dbName);
  });

  test('standardizeColumn - Standardize a numeric column', async () => {
    testRawColumn = new Column<NumericColumn>('testColumn', [1, 5, 1, 5, 8]);
    await repository.addColumn(testRawColumn, TableName.RAW);
    testStatsColumn = PrivilegedDataLayer.calculateColumnStatistics(testRawColumn, 'testColumn');
    await repository.addColumn(testStatsColumn, TableName.STATS);
    resultColumn = await dataLayer.standardizeColumn('testColumn');

    expectStandardizedColumn = [-1, 0.333, -1, 0.333, 1.333];
    resultColumn.values.forEach((value, index) => {
      expect(value).toBeCloseTo(expectStandardizedColumn[index], 3);
    });
  });

  test('standardizeColumn - Standardize a numeric column', async () => {
    testRawColumn = new Column<NumericColumn>('testColumn', [2, 5, 4, 3, 1]);
    await repository.addColumn(testRawColumn, TableName.RAW);
    testStatsColumn = PrivilegedDataLayer.calculateColumnStatistics(testRawColumn, 'testColumn');
    await repository.addColumn(testStatsColumn, TableName.STATS);
    resultColumn = await dataLayer.standardizeColumn('testColumn');

    expectStandardizedColumn = [-0.632, 1.265, 0.632, 0, -1.265];
    resultColumn.values.forEach((value, index) => {
      expect(value).toBeCloseTo(expectStandardizedColumn[index], 3);
    });
  });

  test('standardizeColumn - Standardize a numeric column', async () => {
    testRawColumn = new Column<NumericColumn>('testColumn', [3, 6, 2, 2, 2]);
    await repository.addColumn(testRawColumn, TableName.RAW);
    testStatsColumn = PrivilegedDataLayer.calculateColumnStatistics(testRawColumn, 'testColumn');
    await repository.addColumn(testStatsColumn, TableName.STATS);
    resultColumn = await dataLayer.standardizeColumn('testColumn');

    expectStandardizedColumn = [0, 1.732, -0.577, -0.577, -0.577];
    resultColumn.values.forEach((value, index) => {
      expect(value).toBeCloseTo(expectStandardizedColumn[index], 3);
    });
  });

  test('standardizeColumn - Standardize a numeric column', async () => {
    testRawColumn = new Column<NumericColumn>('testColumn', [4, 7, 3, 1, 2]);
    await repository.addColumn(testRawColumn, TableName.RAW);
    testStatsColumn = PrivilegedDataLayer.calculateColumnStatistics(testRawColumn, 'testColumn');
    await repository.addColumn(testStatsColumn, TableName.STATS);
    resultColumn = await dataLayer.standardizeColumn('testColumn');

    expectStandardizedColumn = [0.261, 1.564, -0.174, -1.042, -0.608];
    resultColumn.values.forEach((value, index) => {
      expect(value).toBeCloseTo(expectStandardizedColumn[index], 3);
    });
  });
});

describe('Validate writeStandardizedData() operation', () => {
  let dbName: string;
  let dataLayer: DataLayer;
  let repository: Repository;
  let testRawColumn: Column<NumericColumn>;
  let testStatsColumn: Column<StatsColumn>;

  beforeEach(() => {
    dbName = `Test_DB${uuidv4()}`;
    expect(Dexie.exists(dbName)).resolves.toBe(false);

    dataLayer = new PrivilegedDataLayer(dbName);
    // We can't create a new repository as that would make two connections to the same DB.
    repository = (dataLayer as PrivilegedDataLayer).getInternalRepository();
  });

  afterEach(async () => {
    // Close connection before deleting; this is private, so we need to typecast.
    (repository as DbRepository).closeConnection();
    await Dexie.delete(dbName);
  });

  test('writeStandardizedData - Standardize on quality column and save', async () => {
    testRawColumn = new Column<NumericColumn>('testColumn', [1, 5, 1, 5, 8]);
    await repository.addColumn(testRawColumn, TableName.RAW);
    testStatsColumn = PrivilegedDataLayer.calculateColumnStatistics(testRawColumn, 'testColumn');
    await repository.addColumn(testStatsColumn, TableName.STATS);

    const result = await dataLayer.storeStandardizedData();
    expect(result).toEqual(true);

    const standardizedColumn = await repository.getColumn('testColumn', TableName.STANDARDIZED);
    const expectedValues = [-1, 0.333, -1, 0.333, 1.333];
    standardizedColumn.values.forEach((value, index) => {
      expect(value).toBeCloseTo(expectedValues[index], 3);
    });
  });

  test('writeStandardizedData - Standardize all quality columns with four different columns', async () => {
    const dataSets = [
      { data: [1, 5, 1, 5, 8], expected: [-1, 0.333, -1, 0.333, 1.333] },
      { data: [2, 5, 4, 3, 1], expected: [-0.632, 1.265, 0.632, 0, -1.265] },
      { data: [3, 6, 2, 2, 2], expected: [0, 1.732, -0.577, -0.577, -0.577] },
      { data: [4, 7, 3, 1, 2], expected: [0.261, 1.564, -0.174, -1.042, -0.608] },
    ];

    for (let i = 0; i < dataSets.length; i += 1) {
      const dataSet = dataSets[i];
      testRawColumn = new Column<NumericColumn>(`testColumn${i}`, dataSet.data);
      // eslint-disable-next-line no-await-in-loop
      await repository.addColumn(testRawColumn, TableName.RAW);
      testStatsColumn = PrivilegedDataLayer.calculateColumnStatistics(testRawColumn, `testColumn${i}`);
      // eslint-disable-next-line no-await-in-loop
      await repository.addColumn(testStatsColumn, TableName.STATS);
    }

    const result = await dataLayer.storeStandardizedData();
    expect(result).toEqual(true);

    for (let i = 0; i < dataSets.length; i += 1) {
      const dataSet = dataSets[i];
      // eslint-disable-next-line no-await-in-loop
      const standardizedColumn = await repository.getColumn(`testColumn${i}`, TableName.STANDARDIZED);
      // eslint-disable-next-line @typescript-eslint/no-loop-func
      standardizedColumn.values.forEach((value, index) => {
        expect(value).toBeCloseTo(dataSet.expected[index], 3);
      });
    }
  });
});

describe('Validate getAvailableFields operation', () => {
  let dbName: string;
  let dataLayer: DataLayer;
  let repository: Repository;
  let testPCAColumn: Column<NumericColumn>;
  let testStatsColumn: Column<StatsColumn>;

  beforeEach(() => {
    dbName = `Test_DB${uuidv4()}`;
    expect(Dexie.exists(dbName)).resolves.toBe(false);

    dataLayer = new PrivilegedDataLayer(dbName);
    // We can't create a new repository as that would make two connections to the same DB.
    repository = (dataLayer as PrivilegedDataLayer).getInternalRepository();
  });

  afterEach(async () => {
    // Close connection before deleting; this is private, so we need to typecast.
    (repository as DbRepository).closeConnection();
    await Dexie.delete(dbName);
  });

  test('getAvailableFields - Get column from both tables', async () => {
    testStatsColumn = new Column<StatsColumn>('statCol', {
      count: 3,
      sum: 6,
      sumOfSquares: 14,
      mean: 2,
      stdDev: 1,
    });
    testPCAColumn = new Column<NumericColumn>('pcaCol', [1, 5, 1, 5, 8]);
    await repository.addColumn(testPCAColumn, TableName.PCA);
    await repository.addColumn(testStatsColumn, TableName.STATS);

    const result = await dataLayer.getAvailableFields();
    expect(result).toEqual(['statCol', 'pcaCol']);
  });

  test('getAvailableFields - Get column from both tables, pca table empty', async () => {
    testStatsColumn = new Column<StatsColumn>('statCol', {
      count: 3,
      sum: 6,
      sumOfSquares: 14,
      mean: 2,
      stdDev: 1,
    });
    await repository.addColumn(testStatsColumn, TableName.STATS);

    const result = await dataLayer.getAvailableFields();
    expect(result).toEqual(['statCol']);
  });

  test('getAvailableFields - Get column from both tables, stat table empty', async () => {
    testPCAColumn = new Column<NumericColumn>('pcaCol', [1, 5, 1, 5, 8]);
    await repository.addColumn(testPCAColumn, TableName.PCA);

    const result = await dataLayer.getAvailableFields();
    expect(result).toEqual(['pcaCol']);
  });

  test('getAvailableFields - Get column from both tables, both table empty', async () => {
    const result = await dataLayer.getAvailableFields();
    expect(result).toEqual([]);
  });
});

describe('Validate getColumnsForPca operation', () => {
  let dbName: string;
  let dataLayer: DataLayer;
  let repository: Repository;
  let column1: Column<NumericColumn>;
  let column2: Column<NumericColumn>;
  let columnNames: string[];

  beforeEach(() => {
    dbName = `Test_DB${uuidv4()}`;
    expect(Dexie.exists(dbName)).resolves.toBe(false);

    dataLayer = new PrivilegedDataLayer(dbName);
    // We can't create a new repository as that would make two connections to the same DB.
    repository = (dataLayer as PrivilegedDataLayer).getInternalRepository();
  });

  afterEach(async () => {
    // Close connection before deleting; this is private, so we need to typecast.
    (repository as DbRepository).closeConnection();
    await Dexie.delete(dbName);
  });

  test('getColumnsForPca - get standardized columns', async () => {
    columnNames = ['column1', 'column2'];
    column1 = new Column<NumericColumn>('column1', [1, 2, 3]);
    column2 = new Column<NumericColumn>('column2', [4, 5, 6]);
    await repository.addColumn(column1, TableName.STANDARDIZED);
    await repository.addColumn(column2, TableName.STANDARDIZED);

    const result = await dataLayer.getColumnsForPca(columnNames, TableName.STANDARDIZED);

    expect(result).toBeInstanceOf(Matrix);
    expect(result.to2DArray()).toEqual([[1, 4], [2, 5], [3, 6]]);
  });

  test('getColumnsForPca - get raw columns', async () => {
    columnNames = ['column1', 'column2'];
    column1 = new Column<NumericColumn>('column1', [1, 2, 3]);
    column2 = new Column<NumericColumn>('column2', [4, 5, 6]);
    await repository.addColumn(column1, TableName.RAW);
    await repository.addColumn(column2, TableName.RAW);

    const result = await dataLayer.getColumnsForPca(columnNames, TableName.RAW);

    expect(result).toBeInstanceOf(Matrix);
    expect(result.to2DArray()).toEqual([[1, 4], [2, 5], [3, 6]]);
  });

  test('getStandardizedColumnsForPca - get non exist standardized columns, return empty matrix', async () => {
    columnNames = ['col1', 'col2'];
    const result = await dataLayer.getColumnsForPca(columnNames, TableName.STANDARDIZED);

    expect(result).toBeInstanceOf(Matrix);
    expect(result.rows).toEqual(0);
    expect(result.columns).toEqual(0);
  });

  test('getStandardizedColumnsForPca - get non exist raw columns, return empty matrix', async () => {
    columnNames = ['col1', 'col2'];
    const result = await dataLayer.getColumnsForPca(columnNames, TableName.RAW);

    expect(result).toBeInstanceOf(Matrix);
    expect(result.rows).toEqual(0);
    expect(result.columns).toEqual(0);
  });
});

describe('Validate calculatePCA operation', () => {
  let dbName: string;
  let dataLayer: DataLayer;
  let repository: Repository;
  let rawCol1: Column<RawColumn>;
  let rawCol2: Column<RawColumn>;
  let rawCol3: Column<RawColumn>;
  let rawCol4: Column<RawColumn>;
  let columnNames: string[];

  beforeEach(() => {
    dbName = `Test_DB${uuidv4()}`;
    expect(Dexie.exists(dbName)).resolves.toBe(false);

    dataLayer = new PrivilegedDataLayer(dbName);
    // We can't create a new repository as that would make two connections to the same DB.
    repository = (dataLayer as PrivilegedDataLayer).getInternalRepository();
  });

  afterEach(async () => {
    // Close connection before deleting; this is private, so we need to typecast.
    (repository as DbRepository).closeConnection();
    await Dexie.delete(dbName);
  });

  test('getColumnsForPca - test against hard values', async () => {
    columnNames = ['col1', 'col2', 'col3', 'col4'];

    rawCol1 = new Column<RawColumn>('col1', [1, 5, 1, 5, 8]);
    rawCol2 = new Column<RawColumn>('col2', [2, 5, 4, 3, 1]);
    rawCol3 = new Column<RawColumn>('col3', [3, 6, 2, 2, 2]);
    rawCol4 = new Column<RawColumn>('col4', [4, 7, 3, 1, 2]);
    await repository.addColumn(rawCol1, TableName.RAW);
    await repository.addColumn(rawCol2, TableName.RAW);
    await repository.addColumn(rawCol3, TableName.RAW);
    await repository.addColumn(rawCol4, TableName.RAW);

    const response1 = await dataLayer.calculateStatistics();
    expect(response1).toEqual(true);
    const response2 = await dataLayer.storeStandardizedData();
    expect(response2).toEqual(true);

    const result = await dataLayer.calculatePCA(columnNames);
    const expected: Matrix = new Matrix([
      [-0.014003307840190604, 0.7559747649563959, 0.941199614594691, -0.10185222583403578],
      [2.5565339942868186, -0.7804317748323727, -0.10686986110059982, -0.00575705265323978],
      [0.051480191864712074, 1.2531347040524978, -0.39667339694231407, 0.18214124212185656],
      [-1.0141500183909433, 0.0002388083099344046, -0.6798861824511148, -0.20122464897453102],
      [-1.5798608599203967, -1.2289165024864557, 0.24222982589933767, 0.1266926853399502],
    ]);
    expect(result).toBeInstanceOf(Matrix);
    for (let i = 0; i < result.rows; i += 1) {
      for (let j = 0; j < result.columns; j += 1) {
        expect(result.get(i, j)).toBeCloseTo(expected.get(i, j), 12);
      }
    }
  });
});

describe('Validate storePCA operation', () => {
  let dbName: string;
  let dataLayer: DataLayer;
  let repository: Repository;
  let rawCol1: Column<RawColumn>;
  let rawCol2: Column<RawColumn>;
  let rawCol3: Column<RawColumn>;
  let rawCol4: Column<RawColumn>;
  let testColumnNames: string[];
  let pcaColumnNames: string[];

  beforeEach(() => {
    dbName = `Test_DB${uuidv4()}`;
    expect(Dexie.exists(dbName)).resolves.toBe(false);

    dataLayer = new PrivilegedDataLayer(dbName);
    // We can't create a new repository as that would make two connections to the same DB.
    repository = (dataLayer as PrivilegedDataLayer).getInternalRepository();
  });

  afterEach(async () => {
    // Close connection before deleting; this is private, so we need to typecast.
    (repository as DbRepository).closeConnection();
    await Dexie.delete(dbName);
  });

  test('getStorePCA - test that PCA get store correctly', async () => {
    testColumnNames = ['col1', 'col2', 'col3', 'col4'];
    pcaColumnNames = ['PC1', 'PC2', 'PC3', 'PC4'];

    rawCol1 = new Column<RawColumn>('col1', [1, 5, 1, 5, 8]);
    rawCol2 = new Column<RawColumn>('col2', [2, 5, 4, 3, 1]);
    rawCol3 = new Column<RawColumn>('col3', [3, 6, 2, 2, 2]);
    rawCol4 = new Column<RawColumn>('col4', [4, 7, 3, 1, 2]);
    await repository.addColumn(rawCol1, TableName.RAW);
    await repository.addColumn(rawCol2, TableName.RAW);
    await repository.addColumn(rawCol3, TableName.RAW);
    await repository.addColumn(rawCol4, TableName.RAW);

    const response1 = await dataLayer.calculateStatistics();
    expect(response1).toEqual(true);
    const response2 = await dataLayer.storeStandardizedData();
    expect(response2).toEqual(true);
    const response3 = await dataLayer.storePCA(testColumnNames);
    expect(response3).toEqual(true);

    const resultPcaColumnNames = await repository.getPcaColumnNames();
    expect(resultPcaColumnNames).toEqual(pcaColumnNames);

    const resultPC1 = await repository.getColumn('PC1', TableName.PCA);
    expect(resultPC1.values).toEqual([
      -0.014003307840190604,
      2.5565339942868186,
      0.051480191864712074,
      -1.0141500183909433,
      -1.5798608599203967]);
    const resultPC2 = await repository.getColumn('PC2', TableName.PCA);
    expect(resultPC2.values).toEqual([
      0.7559747649563959,
      -0.7804317748323727,
      1.2531347040524978,
      0.0002388083099344046,
      -1.2289165024864557]);
    const resultPC3 = await repository.getColumn('PC3', TableName.PCA);
    expect(resultPC3.values).toEqual([
      0.941199614594691,
      -0.10686986110059982,
      -0.39667339694231407,
      -0.6798861824511148,
      0.24222982589933767]);
    const resultPC4 = await repository.getColumn('PC4', TableName.PCA);
    expect(resultPC4.values).toEqual([
      -0.10185222583403578,
      -0.00575705265323978,
      0.18214124212185656,
      -0.20122464897453102,
      0.1266926853399502]);
  });
});
