export default class DataPoint {
  xValue: number;

  yValue: number;

  zValue: number;

  /**
   * Represents a 3-dimensional data point abstraction
   *
   * @param {number} xValue A value associated with the x axis to be displayed.
   * @param {number} yValue A value associated with the y axis to be displayed.
   * @param {number} zValue A value associated with the z axis to be displayed.
   * @pre-condition hasMissingData correctly declares whether any of the values are undefined and
   *      xValue, yValue, zValue are all numbers, strings, or undefined
   * @post-condition The returned object defined element-wise operations on the data set
   */
  constructor(
    xValue: number,
    yValue: number,
    zValue: number,
  ) {
    this.xValue = xValue;
    this.yValue = yValue;
    this.zValue = zValue;
  }
}
