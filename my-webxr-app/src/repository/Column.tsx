// the Column class represents a column in the csv file
// we will store csv data in the indexedDB as columns

export default class Column {
  name: string;

  values: Array<number | string | null>;

  /**
   * Stores a CSV column
   *
   * @param name a string the is hte name of the column
   * @param values an array of data associated with the column
   * @pre-condition Name is a string and values are strings or numbers
   * @post-condition The column with the provided name will be represented by this object
   */
  constructor(name: string, values: Array<number | string | null>) {
    this.name = name;
    this.values = values;
  }
}
