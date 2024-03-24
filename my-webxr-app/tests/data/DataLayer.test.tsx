import 'fake-indexeddb/auto';
import PrivilegedDataLayer from './PrivilegedDataLayer';
import DataLayer, { BatchedDataStream } from '../../src/data/DataLayer';
import Column, { ColumnType, DataColumn, StatsColumn } from '../../src/repository/Column';
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
  let testColumnValues: DataColumn;
  let testColumn: Column<DataColumn>;
  let resultColumn: Column<StatsColumn>;
  let expectedColumnValues: StatsColumn;
  let expectedColumn: Column<StatsColumn>;

  test('calculateStatistics on an empty data column', () => {
    columnName = 'test 1';
    testColumnValues = [];
    testColumn = new Column<DataColumn>(columnName, testColumnValues);
    resultColumn = PrivilegedDataLayer.calculateColumnStatistics(testColumn, columnName);

    expectedColumnValues = {
      count: 0,
      sum: 0,
      sumOfSquares: 0,
      mean: 0,
      stdDev: 0,
    };
    expectedColumn = new Column<StatsColumn>(columnName, expectedColumnValues);
    expect(resultColumn).toEqual(expectedColumn);
  });

  test('calculateStatistics on a normal data column', () => {
    columnName = 'test 1';
    testColumnValues = [1, 2, 3];
    testColumn = new Column<DataColumn>(columnName, testColumnValues);
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
    testColumn = new Column<DataColumn>(columnName, testColumnValues);
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
    testColumn = new Column<DataColumn>(columnName, testColumnValues);
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
    testColumn = new Column<DataColumn>(columnName, testColumnValues);
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
  let dataLayer: DataLayer;
  let repository: Repository;

  beforeEach(() => {
    indexedDB.deleteDatabase('Test_DB');
    repository = new DbRepository('Test_DB');
    dataLayer = new DataLayer('Test_DB');
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

    const column1 = await repository.getDataColumn('column1', ColumnType.RAW);
    const column2 = await repository.getDataColumn('column2', ColumnType.RAW);

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

    const column1 = await repository.getDataColumn('column1', ColumnType.RAW);
    const column2 = await repository.getDataColumn('column2', ColumnType.RAW);

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

    const column1 = await repository.getDataColumn('column1', ColumnType.RAW);
    const column2 = await repository.getDataColumn('column2', ColumnType.RAW);

    expect(column1.values).toEqual(['value1a', 'value1b', 'value1c', 'value1d', 'value1e', 'value1f']);
    expect(column2.values).toEqual(['value2a', 'value2b', 'value2c', 'value2d', 'value2e', 'value2f']);
  });
});

describe('Validate standardizeQualityColumn() operation', () => {
  let dataLayer: DataLayer;
  let repository: Repository;
  let testRawColumn: Column<DataColumn>;
  let testStatsColumn: Column<StatsColumn>;
  let resultColumn: Column<DataColumn>;
  let expectStandardizedColumn: Array<number>;

  beforeEach(() => {
    indexedDB.deleteDatabase('Test_DB');
    repository = new DbRepository('Test_DB');
    dataLayer = new DataLayer('Test_DB');
  });

  test('standardizeQualityColumns - Standardize a quality column', async () => {
    testRawColumn = new Column<DataColumn>('testColumn', [1, 5, 1, 5, 8]);
    await repository.addColumn(testRawColumn, ColumnType.RAW);
    testStatsColumn = PrivilegedDataLayer.calculateColumnStatistics(testRawColumn, 'testColumn');
    await repository.addColumn(testStatsColumn, ColumnType.STATS);
    resultColumn = await dataLayer.standardizeColumn('testColumn');

    expectStandardizedColumn = [-1, 0.333, -1, 0.333, 1.333];
    resultColumn.values.forEach((value, index) => {
      expect(value).toBeCloseTo(expectStandardizedColumn[index], 3);
    });
  });

  test('standardizeQualityColumns - Standardize a quality column', async () => {
    testRawColumn = new Column<DataColumn>('testColumn', [2, 5, 4, 3, 1]);
    await repository.addColumn(testRawColumn, ColumnType.RAW);
    testStatsColumn = PrivilegedDataLayer.calculateColumnStatistics(testRawColumn, 'testColumn');
    await repository.addColumn(testStatsColumn, ColumnType.STATS);
    resultColumn = await dataLayer.standardizeColumn('testColumn');

    expectStandardizedColumn = [-0.632, 1.265, 0.632, 0, -1.265];
    resultColumn.values.forEach((value, index) => {
      expect(value).toBeCloseTo(expectStandardizedColumn[index], 3);
    });
  });

  test('standardizeQualityColumns - Standardize a quality column', async () => {
    testRawColumn = new Column<DataColumn>('testColumn', [3, 6, 2, 2, 2]);
    await repository.addColumn(testRawColumn, ColumnType.RAW);
    testStatsColumn = PrivilegedDataLayer.calculateColumnStatistics(testRawColumn, 'testColumn');
    await repository.addColumn(testStatsColumn, ColumnType.STATS);
    resultColumn = await dataLayer.standardizeColumn('testColumn');

    expectStandardizedColumn = [0, 1.732, -0.577, -0.577, -0.577];
    resultColumn.values.forEach((value, index) => {
      expect(value).toBeCloseTo(expectStandardizedColumn[index], 3);
    });
  });

  test('standardizeQualityColumns - Standardize a quality column', async () => {
    testRawColumn = new Column<DataColumn>('testColumn', [4, 7, 3, 1, 2]);
    await repository.addColumn(testRawColumn, ColumnType.RAW);
    testStatsColumn = PrivilegedDataLayer.calculateColumnStatistics(testRawColumn, 'testColumn');
    await repository.addColumn(testStatsColumn, ColumnType.STATS);
    resultColumn = await dataLayer.standardizeColumn('testColumn');

    expectStandardizedColumn = [0.261, 1.564, -0.174, -1.042, -0.608];
    resultColumn.values.forEach((value, index) => {
      expect(value).toBeCloseTo(expectStandardizedColumn[index], 3);
    });
  });
});

describe('Validate writeStandardizedData() operation', () => {
  let dataLayer: DataLayer;
  let repository: Repository;
  let testRawColumn: Column<DataColumn>;
  let testStatsColumn: Column<StatsColumn>;

  beforeEach(() => {
    indexedDB.deleteDatabase('Test_DB');
    repository = new DbRepository('Test_DB');
    dataLayer = new DataLayer('Test_DB');
  });

  test('writeStandardizedData - Standardize on quality column and save', async () => {
    testRawColumn = new Column<DataColumn>('testColumn', [1, 5, 1, 5, 8]);
    await repository.addColumn(testRawColumn, ColumnType.RAW);
    testStatsColumn = PrivilegedDataLayer.calculateColumnStatistics(testRawColumn, 'testColumn');
    await repository.addColumn(testStatsColumn, ColumnType.STATS);

    const result = await dataLayer.storeStandardizedData();
    expect(result).toEqual(true);

    const standardizedColumn = await repository.getDataColumn('testColumn', ColumnType.STANDARDIZED);
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
      testRawColumn = new Column<DataColumn>(`testColumn${i}`, dataSet.data);
      // eslint-disable-next-line no-await-in-loop
      await repository.addColumn(testRawColumn, ColumnType.RAW);
      testStatsColumn = PrivilegedDataLayer.calculateColumnStatistics(testRawColumn, `testColumn${i}`);
      // eslint-disable-next-line no-await-in-loop
      await repository.addColumn(testStatsColumn, ColumnType.STATS);
    }

    const result = await dataLayer.storeStandardizedData();
    expect(result).toEqual(true);

    for (let i = 0; i < dataSets.length; i += 1) {
      const dataSet = dataSets[i];
      // eslint-disable-next-line no-await-in-loop
      const standardizedColumn = await repository.getDataColumn(`testColumn${i}`, ColumnType.STANDARDIZED);
      // console.log(standardizedColumn);
      // eslint-disable-next-line @typescript-eslint/no-loop-func
      standardizedColumn.values.forEach((value, index) => {
        expect(value).toBeCloseTo(dataSet.expected[index], 3);
      });
    }
  });
});
