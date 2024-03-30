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

// RawColumn is column in the raw data table as read in from csv
export type RawColumn = Array<string> | Array<number>;
// NumericColumn is a column in the pca or standardized data table
export type NumericColumn = Array<number>;

/**
 * The DataRow type is an abstraction of DataColumn for before CSV data is transposed into columns.
 */
export type DataRow = RawColumn;
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

export enum TableName {
  STATS,
  RAW,
  STANDARDIZED,
  PCA,
}
