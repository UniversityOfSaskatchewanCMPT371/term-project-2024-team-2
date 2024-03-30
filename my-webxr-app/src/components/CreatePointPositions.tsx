import { Vector3 } from 'three';
import assert from '../utils/Assert';

/**
 * Creates a Vector for the points position relative to the size of the Axis and the Data given to
 * the point.
 * @pre-condition - The maxData must be an array of three non-negative integers.
 * @post-condition - Returns a vector of where the point will sit in 3D VR space
 * @param {Array<number>} data - The actual data that determines the position of the point, must be
 * in the format [x,y,z]
 * @param {Array<number>} AxisStartPoints - The starting point of each Axis, there must be three
 * entries in the format [x,y,z]
 * @param {number} length - THis is the length of each axis
 * @param {number} scale - This is the scale that is applied to the length, allows for easy
 * adjustment of data point location as graph gets bigger/smaller
 * @param {Array<number>} maxData - this is the maximum values of the three axes x, y, z.
 * @return {Vector3} - this is the final position of the point.
 */
const createPointPositions = ({
  data, AxisStartPoints, length, scale, maxData,
}: {
  data: Array<number>;
  AxisStartPoints: Array<number>;
  length: number;
  scale: number;
  maxData: Array<number>
}): Vector3 => {
  assert(
    data.length === 3,
    'Error in CreatePointPositions.tsx, should be 3 entries of data to be mapped, [x,y,z]',
  );
  assert(
    AxisStartPoints.length === 3,
    'Error in CreatePointPositions.tsx, should be 3 start points, [x,y,z]',
  );
  assert(
    length !== undefined && length > 0,
    'Error in Position.tsx, length of Axis should never be 0 or less ',
  );
  assert(
    scale !== undefined && scale > 0,
    'Error in Position.tsx, Scale should never be 0 or less',
  );
  assert(
    maxData[0] >= 0 && maxData[1] >= 0 && maxData[2] >= 0,
    'Error in CreatePointPositions.tsx, maxData should be non-negative numbers',
  );
  assert(
    data[0] <= maxData[0] || data[1] <= maxData[1] || data[2] <= maxData[2],
    'Error in CreatePointPositions.tsx: Trying to map Data that does not exist within the domain '
           + 'of the graph, please check',
  );

  const xPosition = (((data[0] / maxData[0]) * (scale * length)) / 2) + AxisStartPoints[0];
  const yPosition = (((data[1] / maxData[1]) * (scale * length)) / 2) + AxisStartPoints[1];
  const zPosition = (((data[2] / maxData[2]) * (scale * length)) / 2) + AxisStartPoints[2];

  return new Vector3(xPosition, yPosition, zPosition);
};
export default createPointPositions;
