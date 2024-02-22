import React from 'react';
import { Interactive } from '@react-three/xr';
import SingleAxis from './singleAxis';

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

// this will create the 3d axis by calling single axis for each axis
const Axis: React.FC<AxisProps> = ({
  minValue,
  maxValue,
  labelOffset,
  scaleFactor,
  startX,
  startY,
  startZ,
  endPoint,
  radius,
}) => (
  <Interactive>
    {/* adjust position of the whole axis */}
    <group position={[startX, startY, startZ]}>
      {/* X-axis */}
      <SingleAxis
        startX={startX}
        startY={startY}
        startZ={startZ}
                    // need this calculation to find full length of axis
        endX={startX + endPoint}
        endY={startY}
        endZ={startZ}
        radius={radius}
        labelOffset={labelOffset}
        scaleFactor={scaleFactor}
        minValue={minValue}
        maxValue={maxValue}
        labelIncrement={0}
      />
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
        labelIncrement={0}
      />
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
        labelIncrement={0}
      />
    </group>
  </Interactive>
);

export default Axis;
