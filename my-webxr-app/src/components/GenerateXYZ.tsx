import { useEffect, useState } from 'react';
import { useRollbar } from '@rollbar/react';
import WriteHook from '../smoketest/TestHookWrite';
import SingleAxis from './SingleAxis';
import { useAxesSelectionContext } from '../contexts/AxesSelectionContext';
import { getDatabase } from '../data/DataAbstractor';

interface AxisProps {
  scaleFactor: number
  labelOffset: number;
  startX: number,
  startY: number,
  startZ: number,
  radius: number,
}

/**
 * Creates the x, y, z axis object for displaying in VR
 *
 * It uses the selected axes from the AxesSelectionContext to fetch the data points and their
 * maximum values. The range of the axis is determined by those maximum values.
 *
 * @pre-condition None
 * @post-condition Returns the x, y, z axis object for displaying in VR
 * @param {number} labelOffset how far away the tick label should be from the tick object
 * @param {number} scaleFactor the axis scale. (ie. the distance between each tick in VR space)
 * @param {number} startX the minimum 3D geometry location on the x-axis
 * @param {number} startY the minimum 3D geometry location on the y-axis
 * @param {number} startZ the minimum 3D geometry location on the z-axis
 * @param {number} radius corner radius of the tick's shape
 * @return {JSX.Element} Returns the x, y, z axis object for displaying in VR
 * @constructor
 */
export default function GenerateXYZ({
  labelOffset,
  scaleFactor,
  startX,
  startY,
  startZ,
  radius,
}: AxisProps): JSX.Element {
  const rollbar = useRollbar();
  const { selectedXAxis, selectedYAxis, selectedZAxis } = useAxesSelectionContext();
  const [maxValues, setMaxValues] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const database = getDatabase();
      // console.log(
      //   `selectedXAxis: ${selectedXAxis},
      //   selectedYAxis: ${selectedYAxis},
      //   selectedZAxis: ${selectedZAxis}`,
      // );
      await database.createDataPointsFrom3Columns(
        selectedXAxis as string,
        selectedYAxis as string,
        selectedZAxis as string,
      ).then((result) => {
        console.log(`Result from createDataPointsFrom3Columns: ${JSON.stringify(result)}`);
        const [_, maxValuesArray] = result;
        setMaxValues(maxValuesArray as never);
      }).catch((error) => {
        rollbar.error(error);
        return [];
      });
    };
    fetchData();
  }, [selectedXAxis, selectedYAxis, selectedZAxis]);
  return (
    <group name="Axes">
      {/* X-axis */}
      <SingleAxis
        startX={startX}
        startY={startY}
        startZ={startZ}
        endX={startX + maxValues[0]}
        endY={startY}
        endZ={startZ}
        radius={radius}
        labelOffset={labelOffset}
        scaleFactor={scaleFactor}
        maxValue={maxValues[0]}
        axis="x"
      />
      {WriteHook('Generated X-Axis')}
      {/* Y-axis */}
      <SingleAxis
        startX={startX}
        startY={startY}
        startZ={startZ}
        endX={startX}
        endY={startY + maxValues[1]}
        endZ={startZ}
        radius={radius}
        labelOffset={labelOffset}
        scaleFactor={scaleFactor}
        maxValue={maxValues[1]}
        axis="y"
      />
      {WriteHook('Generated Y-Axis')}
      {/* Z-axis */}
      <SingleAxis
        startX={startX}
        startY={startY}
        startZ={startZ}
        endX={startX}
        endY={startY}
        endZ={startZ + maxValues[2]}
        radius={radius}
        labelOffset={labelOffset}
        scaleFactor={scaleFactor}
        maxValue={maxValues[2]}
        axis="z"
      />
      {WriteHook('Generated Z-Axis')}

    </group>
  );
}
