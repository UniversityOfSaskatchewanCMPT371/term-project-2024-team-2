import PrivilegedDataLayer from './PrivilegedDataLayer';
import { BatchedDataStream } from '../../src/data/DataLayer';

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
