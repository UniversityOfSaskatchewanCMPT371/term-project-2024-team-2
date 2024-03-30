import { Text } from '@react-three/drei';

/**
 * Creates a single tick to be tied to an axis
 * @pre-condition None
 * @post-condition A labeled element that can be displayed in the VR Space
 * @param {number} startX the minimum value on the x-axis
 * @param {number} startY the minimum value on the y-axis
 * @param {number} startZ the minimum value on the z-axis
 * @param {number} labelOffset how far away the tick label should be from the tick object
 * @param {number} scaleFactor the axis scale. (ie. the distance between each tick)
 * @param {number} radius corner radius of the tick's shape
 * @param {number} label the number to display with the tick
 * @param {number} increment the number of increments away from the start of the axis
 * @param {string} axis the label of the axis we are displaying one ('x', 'y', or 'z')
 * @return {JSX.Element} the tick element and its number label
 * @constructor
 */
export default function GenerateTick(
  startX: number,
  startY: number,
  startZ: number,
  labelOffset: number,
  scaleFactor: number,
  radius: number,
  label: number,
  increment: number,
  axis: string,
): JSX.Element {
  let positionTicks: [number, number, number] | undefined;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let positionLabels: [number, number, number] | undefined;
  let ticksShape: [number, number, number] | undefined;

  // conditional to check which axis we want the ticks and labels to be on
  if (axis === 'x') {
    positionTicks = [
      // this calculation gives the correct space between each tick
      startX + (labelOffset * label * scaleFactor) / 2,
      startY,
      startZ,
    ];
    positionLabels = [
      // this calculation gives the correct space between each label
      startX + (labelOffset * label * scaleFactor) / 2,
      startY - 0.02,
      startZ,
    ];
    ticksShape = [0.002, radius * 7, radius * 2];
  } else if (axis === 'y') {
    positionTicks = [
      startX,
      startY + (labelOffset * label * scaleFactor) / 2,
      startZ,
    ];
    positionLabels = [
      startX + 0.03,
      startY + (labelOffset * label * scaleFactor) / 2,
      startZ,
    ];
    ticksShape = [radius * 7, 0.002, radius * 2];
  } else if (axis === 'z') {
    positionTicks = [
      startX,
      startY,
      startZ + (labelOffset * label * scaleFactor) / 2,
    ];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    positionLabels = [
      startX,
      startY - 0.02,
      startZ + (labelOffset * label * scaleFactor) / 2,
    ];
    ticksShape = [0.002, radius * 7, radius * 2];
  }

  /* Text from drei breaks the jest testing, so need the disables */
  // labelText is assigned the correct label by multiplying by the increment
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const labelText: string = `${label * increment}`;

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
