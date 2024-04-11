export default class DataPoint {
  xValue: number;

  yValue: number;

  zValue: number;

  optionalCol1Value? : number;

  optionalCol2Value? : number;

  optionalCol3Value? : number;

  optionalCol4Value? : number;

  optionalCol5Value? : number;

  optionalCol6Value? : number;

  optionalCol7Value? : number;

  /**
   * Represents a 3-dimensional data point abstraction
   *
   * @param {number} xValue A value associated with the x-axis to be displayed.
   * @param {number} yValue A value associated with the y-axis to be displayed.
   * @param {number} zValue A value associated with the z-axis to be displayed.
   * @param optionalCol1Value A value associated with the first optional column to be displayed.
   * @param optionalCol2Value A value associated with the second optional column to be displayed.
   * @param optionalCol3Value A value associated with the third optional column to be displayed.
   * @param optionalCol4Value A value associated with the fourth optional column to be displayed.
   * @param optionalCol5Value A value associated with the fifth optional column to be displayed.
   * @param optionalCol6Value A value associated with the sixth optional column to be displayed.
   * @param optionalCol7Value A value associated with the seventh optional column to be displayed.
   * data point menu.
   * @pre-condition xValue, yValue, zValue are all numbers and optionalColumnValues is an array of
   * numbers or undefined
   * @post-condition The returned object defined element-wise operations on the data set
   */
  constructor(
    xValue: number,
    yValue: number,
    zValue: number,
    optionalCol1Value? : number,
    optionalCol2Value? : number,
    optionalCol3Value? : number,
    optionalCol4Value? : number,
    optionalCol5Value? : number,
    optionalCol6Value? : number,
    optionalCol7Value? : number,
  ) {
    this.xValue = xValue;
    this.yValue = yValue;
    this.zValue = zValue;
    this.optionalCol1Value = optionalCol1Value;
    this.optionalCol2Value = optionalCol2Value;
    this.optionalCol3Value = optionalCol3Value;
    this.optionalCol4Value = optionalCol4Value;
    this.optionalCol5Value = optionalCol5Value;
    this.optionalCol6Value = optionalCol6Value;
    this.optionalCol7Value = optionalCol7Value;
  }
}
