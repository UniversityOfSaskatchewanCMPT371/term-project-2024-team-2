export default class DataPoint {
  xValue: number;

  yValue: number;

  zValue: number;

  optionalColumnValues?: number[];

  /**
   * Represents a 3-dimensional data point abstraction
   *
   * @param {number} xValue A value associated with the x-axis to be displayed.
   * @param {number} yValue A value associated with the y-axis to be displayed.
   * @param {number} zValue A value associated with the z-axis to be displayed.
   * @param {number[]} optionalColumnValues An array of optional column values to be displayed in
   * data point menu.
   * @pre-condition xValue, yValue, zValue are all numbers and optionalColumnValues is an array of
   * numbers or undefined
   * @post-condition The returned object defined element-wise operations on the data set
   */
  constructor(
    xValue: number,
    yValue: number,
    zValue: number,
    optionalColumnValues?: number[],
  ) {
    this.xValue = xValue;
    this.yValue = yValue;
    this.zValue = zValue;
    this.optionalColumnValues = optionalColumnValues;
  }
}
