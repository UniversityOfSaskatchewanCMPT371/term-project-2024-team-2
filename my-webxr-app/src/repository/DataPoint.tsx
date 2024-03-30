export default class DataPoint {
  xValue: number;

  yValue: number;

  zValue: number;

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
