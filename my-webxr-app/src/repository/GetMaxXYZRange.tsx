import Column, { RawColumn } from './Column';

/*
  this function calculates the maximum absolute value from x,y,z axis columns
  @params:
      - xAxis: the label of the dropdown (the text beside it)
      - yAxis: the id of the dropdown (to classify x, y, or z)
      - zAxis: this will be the choices that can fill the dropdowns
  @pre-condition: valid columns for x,y,z axis
  @post-condition: absolute maximum value of the input axis columns
  @return: maximum value
 */
export default function getMaxXYZ(
  xAxis: Column<RawColumn>,
  yAxis: Column<RawColumn>,
  zAxis: Column<RawColumn>,
) {
  const xMax = Math.max(...(xAxis.values as number[]).map(Math.abs));
  const yMax = Math.max(...(yAxis.values as number[]).map(Math.abs));
  const zMax = Math.max(...(zAxis.values as number[]).map(Math.abs));
  return Math.max(xMax, yMax, zMax);
}
