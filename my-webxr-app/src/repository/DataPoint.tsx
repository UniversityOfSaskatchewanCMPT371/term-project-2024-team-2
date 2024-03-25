export default class DataPoint {
  xValue: number | string;

  yValue: number | string;

  zValue: number | string;

  constructor(
    xValue: number | string,
    yValue: number | string,
    zValue: number | string,
  ) {
    this.xValue = xValue;
    this.yValue = yValue;
    this.zValue = zValue;
  }
}
