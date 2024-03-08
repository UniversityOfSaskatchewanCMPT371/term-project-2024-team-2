import Column from './Column';

export default function getMaxXYZ(xAxis: Column, yAxis: Column, zAxis: Column) {
  const xMax = Math.max(...(xAxis.values as number[]).map(Math.abs));
  const yMax = Math.max(...(yAxis.values as number[]).map(Math.abs));
  const zMax = Math.max(...(zAxis.values as number[]).map(Math.abs));
  return Math.max(xMax, yMax, zMax);
}
