import { validate as uuidValidate } from 'uuid';
import handleColumnHeaders from '../../src/utils/ColumnHeadersHandler';

describe('handleColumnHeaders function', () => {
  it('returns unique column names when duplicates are present', () => {
    const columnNames = ['name', 'name', 'age', 'age', 'age'];
    const uniqueColumnNames = handleColumnHeaders(columnNames);
    expect(uniqueColumnNames).toEqual(['name', 'name_1', 'age', 'age_1', 'age_2']);
  });

  it('returns the same array when no duplicates are present', () => {
    const columnNames = ['name', 'surname', 'age'];
    const uniqueColumnNames = handleColumnHeaders(columnNames);
    expect(uniqueColumnNames).toEqual(['name', 'surname', 'age']);
  });

  it('replace an empty-string header with a non-empty header', () => {
    const columnNames = ['name', ''];
    const uniqueColumnNames = handleColumnHeaders(columnNames);
    expect(uniqueColumnNames).toHaveLength(2);
    expect(uniqueColumnNames[0]).toBe('name');

    const component = uniqueColumnNames[1].split('_');
    expect(component).toHaveLength(3);
    expect(component[0]).toEqual('column');
    expect(Number(component[1])).toEqual(2);
    expect(uuidValidate(component[2])).toBeTruthy();
  });

  // a parameterized test
  const whiteSpaceChars = [' ',
    '\r',
    '\n',
    '\t',
    '\f',
    '\v',
    '\u00a0',
    '\u1680',
    '\u2000',
    '\u200a',
    '\u2028',
    '\u2029',
    '\u202f',
    '\u205f',
    '\u3000',
    '\ufeff',
  ];
  test.each(whiteSpaceChars)('expect.soft should handle column names containing white space correctly', (columnNames) => {
    const uniqueColumnNames = handleColumnHeaders([columnNames]);

    expect(uniqueColumnNames).toHaveLength(1);
    const component = uniqueColumnNames[0].split('_');
    expect(component).toHaveLength(3);
    // first component (prefix) must be 'column'
    expect(component[0]).toEqual('column');
    // second component (index) must be 1
    expect(Number(component[1])).toEqual(1);
    // third component (uuid) must be a valid UUID
    expect(uuidValidate(component[2])).toBeTruthy();
  });

  it('returns an empty array when input is an empty array', () => {
    const columnNames: string[] = [];
    const uniqueColumnNames = handleColumnHeaders(columnNames);
    expect(uniqueColumnNames).toEqual([]);
  });
});
