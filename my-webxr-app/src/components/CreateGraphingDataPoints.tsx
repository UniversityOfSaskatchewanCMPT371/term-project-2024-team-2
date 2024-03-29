import { useEffect, useState } from 'react';
import DataLayer from '../data/DataLayer';
import { TableName } from '../repository/Column';
import DataPoint from '../repository/DataPoint';
import createPosition from './Positions';
import GraphingDataPoint from './GraphingDataPoint';
import { useAxesSelectionContext } from '../contexts/AxesSelectionContext';
import { getDatabase } from '../data/DataAbstractor';
import { rollbar } from '../utils/LoggingUtils';

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
 * @param {TableName} columnType - The type of the columns to use for the data points.
 * @returns {Promise<DataPoint[]>} A promise that resolves to an array of data points fetched from
 * the data layer.
 */
// Function to create data points
export async function fetchDataPoints(
  dataLayer: DataLayer,
  xColumnName: string,
  yColumnName: string,
  zColumnName: string,
  columnType: TableName,
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
 * @returns {JSX.Element} An array of GraphingDataPoint components representing the plotted data
 * points.
 */
export default function CreateGraphingDataPoints(): JSX.Element {
  const { selectedXAxis, selectedYAxis, selectedZAxis } = useAxesSelectionContext();
  const [dataPoints, setDataPoints] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const database = getDatabase();
      await database.createDataPointsFrom3Columns(
        selectedXAxis,
        selectedYAxis,
        selectedZAxis,
        TableName.PCA,
      ).then((value) => setDataPoints(value as never))
        .catch((error) => { rollbar.error(error); return []; });
    };
    fetchData();
  }, [selectedXAxis, selectedYAxis, selectedZAxis]);

  return (
    <>
      { (dataPoints as DataPoint[]).map((dataPoint, index) => {
        const position = createPosition({
          data: [dataPoint.xValue, dataPoint.yValue, dataPoint.zValue],
          AxisStartPoints: [0, 1.5, -1.5],
          length: 1,
          scale: 2,
          max: 10,
        });

        return (
          <GraphingDataPoint
            /* eslint-disable-next-line react/no-array-index-key */
            key={index}
            id={index}
            marker="circle"
            color="yellow"
            columnX={selectedXAxis as string}
            columnY={selectedYAxis as string}
            columnZ={selectedZAxis as string}
            actualData={[dataPoint.xValue, dataPoint.yValue, dataPoint.zValue]}
            size={[0.02, 32, 32]}
            meshProps={{ position }}
          />
        );
      })}
    </>
  );
}
