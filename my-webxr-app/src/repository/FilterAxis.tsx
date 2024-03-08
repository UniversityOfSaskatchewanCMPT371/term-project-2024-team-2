import Column from './Column';

export function isIntColumn(column: Column) {
  // Check if all values in the column are integers
  return column.values.every((value) => typeof value === 'number' && Number.isInteger(value));
}

export function getIntColumns(columns: Array<Column>) {
  return columns.filter(isIntColumn);
}

export default function getColumnNames(columns: Array<Column>) {
  return getIntColumns(columns).map((obj) => obj.name);
}
