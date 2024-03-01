// the Column class represents a column in the csv file
// we will store csv data in the indexedDB as columns
export default class Column {
  name: string;

  values: Array<number | string | null>;

  constructor(name: string, values: Array<number | string | null>) {
    this.name = name;
    this.values = values;
  }
}
