import WriteHook from '../smoketest/TestHookWrite';
import SingleAxis from './SingleAxis';

interface AxisProps {
  minValue: number;
  maxValue: number;
  scaleFactor: number
  labelOffset: number;
  startX: number,
  startY: number,
  startZ: number,
  endPoint: number,
  radius: number
}

/**
 * Creates the x, y, z axis object for displaying in VR
 * @pre-condition None
 * @post-condition Returns the x, y, z axis object for displaying in VR
 * @param {number} minValue The minimum axis value
 * @param {number} maxValue The maximum axis value
 * @param {number} labelOffset how far away the tick label should be from the tick object
 * @param {number} scaleFactor the axis scale. (ie. the distance between each tick)
 * @param {number} startX the minimum 3D geometry location on the x-axis
 * @param {number} startY the minimum 3D geometry location on the y-axis
 * @param {number} startZ the minimum 3D geometry location on the z-axis
 * @param {number} endPoint the max value of the axes
 * @param {number} radius corner radius of the tick's shape
 * @return {JSX.Element} Returns the x, y, z axis object for displaying in VR
 * @constructor
 */
export default function GenerateXYZ({
  minValue,
  maxValue,
  labelOffset,
  scaleFactor,
  startX,
  startY,
  startZ,
  endPoint,
  radius,
}: AxisProps) {
  return (
    <group name="Axes">
      {/* X-axis */}
      <SingleAxis
        startX={startX}
        startY={startY}
        startZ={startZ}
        endX={startX + endPoint} // need this calculation to find full length of axis
        endY={startY}
        endZ={startZ}
        radius={radius}
        labelOffset={labelOffset}
        scaleFactor={scaleFactor}
        minValue={minValue}
        maxValue={maxValue}
        axis="x"
      />
      {WriteHook('Generated X-Axis')}
      {/* Y-axis */}
      <SingleAxis
        startX={startX}
        startY={startY}
        startZ={startZ}
        endX={startX}
        endY={startY + endPoint}
        endZ={startZ}
        radius={radius}
        labelOffset={labelOffset}
        scaleFactor={scaleFactor}
        minValue={minValue}
        maxValue={maxValue}
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
        endZ={startZ + endPoint}
        radius={radius}
        labelOffset={labelOffset}
        scaleFactor={scaleFactor}
        minValue={minValue}
        maxValue={maxValue}
        axis="z"
      />
      {WriteHook('Generated Z-Axis')}

    </group>
  );
}
