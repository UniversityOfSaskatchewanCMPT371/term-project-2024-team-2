import * as THREE from 'three';
import GenerateTick from './CreateTick';

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
  minValue: number;
  maxValue: number;
  axis: string;
}

/**
 * Creates a Single axis object
 * @param {number} startX the minimum 3D geometry location on the x-axis
 * @param {number} startY the minimum 3D geometry location on the y-axis
 * @param {number} startZ the minimum 3D geometry location on the z-axis
 * @param {number} endX the maximum 3D geometry location on the x-axis
 * @param {number} endY the maximum 3D geometry location on the y-axis
 * @param {number} endZ the maximum 3D geometry location on the z-axis
 * @param {number} radius corner radius of the tick's shape
 * @param {number} labelOffset how far away the tick label should be from the tick object
 * @param {number} scaleFactor the axis scale. (ie. the distance between each tick)
 * @param {number} minValue The minimum axis value
 * @param {number} maxValue The maximum axis value
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
  minValue,
  maxValue,
  axis,
}: SingleAxisProps) {
  // Calculate the range in positive and negative directions
  const maxNum: number = Math.abs(maxValue);
  const minNum: number = Math.abs(minValue);

  // Determine the label increment based on the ranges
  // adjust these to change increment of the labels that appear under the ticks
  let labelIncrement = 0;
  if (maxNum <= 10 && minNum <= 10) {
    labelIncrement = 1;
  } else if (maxNum <= 20 && minNum <= 20) {
    labelIncrement = 2;
  } else if (maxNum <= 50 && minNum <= 50) {
    labelIncrement = 5;
  } else if (maxNum <= 100 && minNum <= 100) {
    labelIncrement = 10;
  } else if (maxNum <= 500 && minNum <= 500) {
    labelIncrement = 50;
  } else if (maxNum <= 1000 && minNum <= 1000) {
    labelIncrement = 100;
  } else if (maxNum <= 5000 && minNum <= 5000) {
    labelIncrement = 500;
  } else if (maxNum <= 10000 && minNum <= 10000) {
    labelIncrement = 1000;
  } else {
    labelIncrement = 10000;
  }

  // create list to hold
  const axisTicks: number[] = [];
  // The number of labels on each side of the axis
  const numLabels: number = 10;
  // fill axisTicks with the range of tick labels
  for (let i = -numLabels; i <= numLabels; i += 1) {
    axisTicks.push(i);
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
      <mesh name="Axis Line" geometry={axisGeometry} material={material} position={position} rotation={rotation} />
      {/* call GenerateTick for each axis */}
      {axisTicks.map((label) => GenerateTick(
        startX,
        startY,
        startZ,
        labelOffset,
        scaleFactor,
        radius,
        label,
        labelIncrement,
        axis,
      ))}
    </group>
  );
}
