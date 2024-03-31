import { useEffect, useState } from 'react';
import { useRollbar } from '@rollbar/react';
import DataPoint from '../repository/DataPoint';
import createPosition from './Positions';
import GraphingDataPoint from './GraphingDataPoint';
import { useAxesSelectionContext } from '../contexts/AxesSelectionContext';
import { getDatabase } from '../data/DataAbstractor';

/**
 * TODO: we may want different scale for each axis and so will required max item of each columns
 * Creates an array of GraphingDataPoint components from the provided data points. This function
 * should be call in conjunction with createPosition, I split them into two function for the sake of
 * testing.
 *
 * @pre-condition
 * - The dataPoints array must not be empty.
 * - The xColumnName, yColumnName, and zColumnName must correspond to properties of the DataPoint
 * objects.
 * - The AxisStartPoints array must contain exactly three numbers.
 * - The length, scale, and max parameters must be positive numbers.
 * @post-condition An array of elements that will visually graph data.
 * @returns {JSX.Element} An array of GraphingDataPoint components representing the plotted data
 * points.
 */
export default function CreateGraphingDataPoints(): JSX.Element {
  const rollbar = useRollbar();
  const { selectedXAxis, selectedYAxis, selectedZAxis } = useAxesSelectionContext();
  const [dataPoints, setDataPoints] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const database = getDatabase();
      await database.createDataPointsFrom3Columns(
        selectedXAxis as string,
        selectedYAxis as string,
        selectedZAxis as string,
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
