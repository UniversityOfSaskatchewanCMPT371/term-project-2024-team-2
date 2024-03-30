import { Vector3 } from 'three';
// import assert from "../utils/Assert";
import assert from '../utils/Assert';
/**
  Creates a Vector for the points position relative to the size of the Axis and the Data
    given to the point ( would eventually want to create
  an axis Type to pass in instead of all these variables )
  @param {Array<number>} data - The actual data that determines the position of the point,
   must be in the format [x,y,z]
  @param {Array<number>} AxisStartPoints - The starting point of each Axis, there must be
   three entries in the format [x,y,z]
  @param {number} length - THis is the length of each axis
  @param {number} scale - This is the scale that is applied to the length, allows for easy
   adjustment of data point location as graph gets bigger/smaller
  @param {number} max - this is the maximum value of the data read in by the program
  @return {Vector3} - this is the final position of the point.
 */
const createPosition = ({
  data, AxisStartPoints, length, scale, max,
}: {
  data: Array<number>,
  AxisStartPoints: Array<number>,
  length: number,
  scale: number,
  max: number
}): Vector3 => {
  assert(
    data.length === 3,

    'Error in Positions.tsx, should be 3 entries of data to be mapped, [x,y,z]',
  );
  assert(
    AxisStartPoints.length === 3,
    'Error in Positions.tsx, should be 3 start points, [x,y,z]',
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
    data[0] <= max || data[1] <= max || data[2] <= max,
    'Error in Positions.tsx: Trying to map Data that does not exist within the domain '
           + 'of the graph, please check',
  );

  const xPosition = (((data[0] / max) * (scale * length)) / 2) + AxisStartPoints[0];
  const yPosition = (((data[1] / max) * (scale * length)) / 2) + AxisStartPoints[1];
  const zPosition = (((data[2] / max) * (scale * length)) / 2) + AxisStartPoints[2];

  return new Vector3(xPosition, yPosition, zPosition);
};
export default createPosition;
