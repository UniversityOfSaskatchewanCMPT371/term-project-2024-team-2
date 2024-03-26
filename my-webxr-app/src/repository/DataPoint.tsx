export default class DataPoint {
  hasMissingData: boolean;

  xValue: number | string | null;

  yValue: number | string | null;

  zValue: number | string | null;

  /**
   * Represents a 3-dimensional data point abstraction
   *
   * @param hasMissingData Whether one of the data elements is undefined.
   * @param xValue A value associated with the x axis to be displayed.
   * @param yValue A value associated with the y axis to be displayed.
   * @param zValue A value associated with the z axis to be displayed.
   * @pre-condition hasMissingData correctly declares whether any of the values are undefined and
   *      xValue, yValue, zValue are all numbers, strings, or undefined
   * @post-condition The returned object defined element-wise operations on the data set
   */
  constructor(
    hasMissingData: boolean,
    xValue: number | string | null,
    yValue: number | string | null,
    zValue: number | string | null,
  ) {
    this.hasMissingData = hasMissingData;
    this.xValue = xValue;
    this.yValue = yValue;
    this.zValue = zValue;
  }
}
