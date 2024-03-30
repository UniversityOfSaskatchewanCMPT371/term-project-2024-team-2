import * as THREE from 'three';
import GenerateTick from './GenerateTicks';

interface SingleAxisProps {
  startX: number;
  startY: number;
  startZ: number;
  endX: number;
  endY: number;
  endZ: number;
  scaleFactor: number;
  radius: number;
  labelOffset: number;
  maxValue: number;
  axis: string;
}

/**
 * Creates a Single axis object
 * Helper function to for GenerateXYZ()
 *
 * @pre-conditions - maxValue is a non-negative integer
 *
 * @param {number} startX the minimum 3D geometry location on the x-axis
 * @param {number} startY the minimum 3D geometry location on the y-axis
 * @param {number} startZ the minimum 3D geometry location on the z-axis
 * @param {number} endX the maximum 3D geometry location on the x-axis
 * @param {number} endY the maximum 3D geometry location on the y-axis
 * @param {number} endZ the maximum 3D geometry location on the z-axis
 * @param {number} radius corner radius of the tick's shape
 * @param {number} labelOffset how far away the tick label should be from the tick object
 * @param {number} scaleFactor the axis scale. (ie. the distance between each tick)
 * @param {number} maxValue The absolute maximum axis value will be plotted
 * @param {string} axis the 'x', 'y', or 'z' axis to display
 * @return {JSX.Element} Returns the x, y, or z axis object for displaying in VR
 * @constructor
 */
export default function SingleAxis({
  startX,
  startY,
  startZ,
  endX,
  endY,
  endZ,
  radius,
  labelOffset,
  scaleFactor,
  maxValue,
  axis,
}: SingleAxisProps): JSX.Element {
  // There are 10 ticks and labels for every ticks on each side of the axis, with one stay at the
  // origin. Total of 21 ticks and labels.
  const numLabels: number = 10;
  const labelIncrement = maxValue / numLabels;
  const axisTicks: number[] = [];
  // fill axisTicks with tick labels, round of two decimal places
  for (let i = -maxValue; i <= maxValue; i += labelIncrement) {
    axisTicks.push(Number(i.toFixed(2)));
  }

  // axisGeometry will be the shape of the axis, decided in conditional
  let axisGeometry: THREE.CylinderGeometry | undefined;
  // the starting position of the axis, same for all axes
  const position: THREE.Vector3 = new THREE.Vector3(startX, startY, startZ);
  // rotation is adjusted to give us the correct rotation for x, y, z axes, decided in conditional
  let rotation: THREE.Euler | undefined;
  // color of the axis decided in conditional
  let color: string | undefined;

  // the conditional checks to see which axis is being created,
  // if the start and end are equal then the length is 0, we are not creating that axis
  if (startX !== endX) {
    // color for the axis
    color = 'red';
    // creating the cylinder, with correct position and rotation for x-axis
    axisGeometry = new THREE.CylinderGeometry(radius, radius, scaleFactor, 10);
    rotation = new THREE.Euler(0, 0, Math.PI / 2);
  } else if (startY !== endY) {
    color = 'forestgreen';
    axisGeometry = new THREE.CylinderGeometry(radius, radius, scaleFactor, 10);
    rotation = new THREE.Euler(0, 0, 0);
  } else if (startZ !== endZ) {
    color = 'blue';
    axisGeometry = new THREE.CylinderGeometry(radius, radius, scaleFactor, 10);
    rotation = new THREE.Euler(Math.PI / 2, 0, 0);
  }

  // setting material to the color chosen from the conditional
  const material: THREE.MeshBasicMaterial | undefined = new THREE.MeshBasicMaterial({ color });

  return (
    <group name="A Single Axis">
      {/* Create the axis and color it */}
      <mesh
        name="Axis Line"
        geometry={axisGeometry}
        material={material}
        position={position}
        rotation={rotation}
      />
      {/* call GenerateTick for each axis and assign text label to each tick */}
      {axisTicks.map((label) => GenerateTick(
        startX,
        startY,
        startZ,
        labelOffset,
        scaleFactor,
        radius,
        label,
        axis,
        maxValue,
      ))}
    </group>
  );
}
