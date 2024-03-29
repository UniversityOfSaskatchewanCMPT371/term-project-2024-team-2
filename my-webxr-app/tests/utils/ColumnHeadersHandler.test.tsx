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
    expect(uniqueColumnNames).toEqual(['name', 'column_2']);
  });

  it('replace two empty-string headers with a non-empty headers', () => {
    const columnNames = ['col1', 'col2', ''];
    const uniqueColumnNames = handleColumnHeaders(columnNames);
    expect(uniqueColumnNames).toEqual(['col1', 'col2', 'column_3']);
  });

  it('returns an empty array when input is an empty array', () => {
    const columnNames: string[] = [];
    const uniqueColumnNames = handleColumnHeaders(columnNames);
    expect(uniqueColumnNames).toEqual([]);
  });
});
