import PrivilegedDataLayer from './PrivilegedDataLayer';
import { BatchedDataStream } from '../../src/data/DataLayer';
import Column, { DataColumn, StatsColumn } from '../../src/repository/Column';

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

  test('calculateStatistics on a null data column', () => {
    columnName = 'test 1';
    testColumnValues = [null, null, null];
    testColumn = new Column<DataColumn>(columnName, testColumnValues);
    resultColumn = PrivilegedDataLayer.calculateColumnStatistics(testColumn, columnName);

    expectedColumnValues = {
      count: 3,
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
      sumOfSquares: 14,
      mean: 2,
      stdDev: 0.816,
    };
    expectedColumn = new Column<StatsColumn>(columnName, expectedColumnValues);
    expect(resultColumn.values.count).toEqual(expectedColumn.values.count);
    expect(resultColumn.values.sum).toEqual(expectedColumn.values.sum);
    expect(resultColumn.values.sumOfSquares).toEqual(expectedColumn.values.sumOfSquares);
    expect(resultColumn.values.mean).toEqual(expectedColumn.values.mean);
    expect(resultColumn.values.stdDev).toBeCloseTo(expectedColumn.values.stdDev, 3);
  });

  test('calculateStatistics on a constant data column, has no stdDev', () => {
    columnName = 'test 1';
    testColumnValues = [2, 2, 2];
    testColumn = new Column<DataColumn>(columnName, testColumnValues);
    resultColumn = PrivilegedDataLayer.calculateColumnStatistics(testColumn, columnName);

    expectedColumnValues = {
      count: 3,
      sum: 6,
      sumOfSquares: 12,
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
      sumOfSquares: 9,
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
      sumOfSquares: 1573,
      mean: 27.5,
      stdDev: 5.5,
    };
    expectedColumn = new Column<StatsColumn>(columnName, expectedColumnValues);
    expect(resultColumn.values.count).toEqual(expectedColumn.values.count);
    expect(resultColumn.values.sum).toEqual(expectedColumn.values.sum);
    expect(resultColumn.values.sumOfSquares).toEqual(expectedColumn.values.sumOfSquares);
    expect(resultColumn.values.mean).toEqual(expectedColumn.values.mean);
    expect(resultColumn.values.stdDev).toEqual(expectedColumn.values.stdDev);
  });
});
