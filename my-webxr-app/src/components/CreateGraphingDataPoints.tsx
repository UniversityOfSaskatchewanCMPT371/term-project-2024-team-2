import { useEffect, useState } from 'react';
import DataPoint from '../repository/DataPoint';
import createPosition from './Positions';
import GraphingDataPoint from './GraphingDataPoint';
import { useAxesSelectionContext } from '../contexts/AxesSelectionContext';
import { getDatabase } from '../data/DataAbstractor';
import { rollbar } from '../utils/LoggingUtils';

/**
 * This function creates an array of GraphingDataPoint components from the data points fetched from
 * the database.
 *
 * It uses the selected axes from the AxesSelectionContext to fetch the data points and their
 * maximum values. Where each data point consist of three values at the same index in the three
 * columns selected as the x, y, and z axes. The maximum values are the larges values in each of
 * the columns selected. The data points are then mapped to positions using the createPosition
 * function and rendered as GraphingDataPoint components.
 *
 * @preconds
 * - The selectedXAxis, selectedYAxis, and selectedZAxis must be valid column names in the database.
 * - The dataPoints array must not be empty.
 * - The AxisStartPoints array must contain exactly three numbers and be the same with the actual
 * hard-coded axis start points so that the points are plotted correctly.
 * - The length, scale, and max parameters must be positive numbers.
 * @returns {JSX.Element} An array of GraphingDataPoint components representing the plotted data
 * points.
 */
export default function CreateGraphingDataPoints(): JSX.Element {
  const { selectedXAxis, selectedYAxis, selectedZAxis } = useAxesSelectionContext();
  const [dataPoints, setDataPoints] = useState([]);
  const [maxValues, setMaxValues] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const database = getDatabase();
      await database.createDataPointsFrom3Columns(
        selectedXAxis as string,
        selectedYAxis as string,
        selectedZAxis as string,
      ).then(([dataPointsArray, maxValuesArray]) => {
        setDataPoints(dataPointsArray as never);
        setMaxValues(maxValuesArray as never);
      }).catch((error) => { rollbar.error(error); return []; });
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
          maxData: [maxValues[0], maxValues[1], maxValues[2]],
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
