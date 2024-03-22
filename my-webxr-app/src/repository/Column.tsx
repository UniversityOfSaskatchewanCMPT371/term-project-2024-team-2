// the Column class represents a column in the csv file
// we will store csv data in the indexedDB as columns
/**
 * The Column class represents a column(table) in IndexedDB.
 */
export default class Column<Type> {
  name: string;

  values: Type;

  constructor(name: string, values: Type) {
    this.name = name;
    this.values = values;
  }
}

/**
 * The DataColumn type is used to represent a column of data from IndexedDB.
 */
export type DataColumn = Array<string | number | null>;
/**
 * The DataRow type is an abstraction of DataColumn for before CSV data is transposed into columns.
 */
export type DataRow = DataColumn;
/**
 * The StatsColumn type is used to represent all the statistical values for a given column.
 */
export type StatsColumn = {
  count: number;
  sum: number;
  sumOfSquares: number;
  mean: number;
  stdDev: number;
};

export enum ColumnType {
  STATS,
  RAW,
  STANDARDIZED,
  PCA,
}
