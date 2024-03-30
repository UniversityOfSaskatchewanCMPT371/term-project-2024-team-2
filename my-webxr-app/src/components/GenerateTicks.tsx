import { Text } from '@react-three/drei';

/**
 * Creates a single tick to be tied to an axis
 * @pre-condition - labelOffset of 1 seems to be the best value for the tick label to be displayed.
 * @post-condition
 * - A labeled element that can be displayed in the VR Space.
 * - The tick is displayed at the correct position on the axis.
 * - The space between each tick in 3 axes is the same.
 * @param {number} startX the minimum value on the x-axis
 * @param {number} startY the minimum value on the y-axis
 * @param {number} startZ the minimum value on the z-axis
 * @param {number} labelOffset how far away the tick label should be from the tick object
 * @param {number} scaleFactor the axis scale. (ie. the distance between each tick)
 * @param {number} radius corner radius of the tick's shape
 * @param {number} label the number to display with the tick
 * @param {string} axis the label of the axis we are displaying one ('x', 'y', or 'z')
 * @param {number} maxValue the maximum value plotted point of the axis
 * @return {JSX.Element} the tick element and its number label
 * @constructor
 */
export default function GenerateTicks(
  startX: number,
  startY: number,
  startZ: number,
  labelOffset: number,
  scaleFactor: number,
  radius: number,
  label: number,
  axis: string,
  maxValue: number,
): JSX.Element {
  let positionTicks: [number, number, number] | undefined;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let positionLabels: [number, number, number] | undefined;
  let ticksShape: [number, number, number] | undefined;
  // conditional to check which axis we want the ticks and labels to be on
  // 'label / maxValue' will give the same space between each tick no matter the maxValue and axes
  if (axis === 'x') {
    positionTicks = [
      // this calculation gives the correct space between each tick
      startX + (labelOffset * (label / maxValue) * scaleFactor) / 2,
      startY,
      startZ,
    ];
    positionLabels = [
      // this calculation gives the correct space between each label
      startX + (labelOffset * (label / maxValue) * scaleFactor) / 2,
      startY - 0.02,
      startZ,
    ];
    ticksShape = [0.002, radius * 7, radius * 2];
  } else if (axis === 'y') {
    positionTicks = [
      startX,
      startY + (labelOffset * (label / maxValue) * scaleFactor) / 2,
      startZ,
    ];
    positionLabels = [
      startX + 0.03,
      startY + (labelOffset * (label / maxValue) * scaleFactor) / 2,
      startZ,
    ];
    ticksShape = [radius * 7, 0.002, radius * 2];
  } else if (axis === 'z') {
    positionTicks = [
      startX,
      startY,
      startZ + (labelOffset * (label / maxValue) * scaleFactor) / 2,
    ];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    positionLabels = [
      startX,
      startY - 0.02,
      startZ + (labelOffset * (label / maxValue) * scaleFactor) / 2,
    ];
    ticksShape = [0.002, radius * 7, radius * 2];
  }

  const labelText: string = `${label}`;

  return (
    <group key={label} name="tick">
      {/* this mesh contains the position and shape of ticks */}
      <mesh position={positionTicks}>
        <boxGeometry args={ticksShape} />
        <meshStandardMaterial color="black" />
      </mesh>
      <Text
        position={positionLabels}
        font="https://cdn.jsdelivr.net/gh/lojjic/unicode-font-resolver@v1.0.1/packages/data/font-files/latin/sans-serif.normal.100.woff"
        fontSize={0.02}
        color="black"
      >
        {labelText}
      </Text>
    </group>
  );
}
