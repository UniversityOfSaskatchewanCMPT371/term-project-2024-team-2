import WriteHook from '../smoketest/TestHookWrite';
import SingleAxis from './SingleAxis';

interface AxisProps {
  maxValues: Array<number>;
  scaleFactor: number
  labelOffset: number;
  startX: number,
  startY: number,
  startZ: number,
  radius: number
}

/**
 * Creates the x, y, z axis object for displaying in VR
 * @pre-condition None
 * @post-condition Returns the x, y, z axis object for displaying in VR
 * @param {Array<number>} maxValues The 3 maximum values piloted on the three axes x, y, z.
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
  maxValues,
  labelOffset,
  scaleFactor,
  startX,
  startY,
  startZ,
  radius,
}: AxisProps) {
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
