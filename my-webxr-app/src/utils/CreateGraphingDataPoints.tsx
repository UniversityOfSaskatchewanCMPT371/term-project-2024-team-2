import DataLayer from '../data/DataLayer';
import { ColumnType } from '../repository/Column';
import DataPoint from '../repository/DataPoint';
import createPosition from '../components/Positions';
import GraphingDataPoint from '../components/GraphingDataPoint';

/**
 * Asynchronously fetches data points from the provided data layer using the specified 3 column
 * names and column type.
 *
 * @preconds
 * - The columnType must be either 'Raw' or 'PCA'.
 * - If the columnType is 'Raw', all columns must contain numeric data.
 * - All three columns are in the same table.
 *
 * @param {DataLayer} dataLayer - The data layer from which to fetch the data points.
 * @param {string} xColumnName - The name of the column to use for the x-values of the data points.
 * @param {string} yColumnName - The name of the column to use for the y-values of the data points.
 * @param {string} zColumnName - The name of the column to use for the z-values of the data points.
 * @param {ColumnType} columnType - The type of the columns to use for the data points.
 * @returns {Promise<DataPoint[]>} A promise that resolves to an array of data points fetched from
 * the data layer.
 */
// Function to create data points
export async function fectchDataPoints(
  dataLayer: DataLayer,
  xColumnName: string,
  yColumnName: string,
  zColumnName: string,
  columnType: ColumnType,
) {
  return dataLayer.createDataPointsFrom3Columns(xColumnName, yColumnName, zColumnName, columnType);
}

/**
 * TODO: we may want different scale for each axis and so will required max item of each columns
 * Creates an array of GraphingDataPoint components from the provided data points. This function
 * should be call in conjunction with createPosition, I split them into two function for the sake of
 * testing.
 *
 * @preconds
 * - The dataPoints array must not be empty.
 * - The xColumnName, yColumnName, and zColumnName must correspond to properties of the DataPoint
 * objects.
 * - The AxisStartPoints array must contain exactly three numbers.
 * - The length, scale, and max parameters must be positive numbers.
 *
 * @param {DataPoint[]} dataPoints - The data points to plot.
 * @param {string} xColumnName - The name of the column to use for the x-values of the data points.
 * @param {string} yColumnName - The name of the column to use for the y-values of the data points.
 * @param {string} zColumnName - The name of the column to use for the z-values of the data points.
 * @param {number[]} AxisStartPoints - The starting points of the axes.
 * @param {number} length - The length of the axes.
 * @param {number} scale - The scale factor for the data points.
 * @param {number} max - The maximum value among the data points.
 * @returns {JSX.Element[]} An array of GraphingDataPoint components representing the plotted data
 * points.
 */
export function createGraphingDataPoints(
  dataPoints: DataPoint[],
  xColumnName: string,
  yColumnName: string,
  zColumnName: string,
  AxisStartPoints: number[],
  length: number,
  scale: number,
  max: number,
): JSX.Element[] {
  return dataPoints.map((dataPoint, index) => {
    const position = createPosition({
      data: [dataPoint.xValue, dataPoint.yValue, dataPoint.zValue],
      AxisStartPoints,
      length,
      scale,
      max,
    });

    return (
      <GraphingDataPoint
        /* eslint-disable-next-line react/no-array-index-key */
        key={index}
        id={index}
        marker="circle"
        color="gray"
        columnX={xColumnName}
        columnY={yColumnName}
        columnZ={zColumnName}
        actualData={[dataPoint.xValue, dataPoint.yValue, dataPoint.zValue]}
        size={[0.02, 32, 32]}
        meshProps={{ position }}
      />
    );
  });
}
