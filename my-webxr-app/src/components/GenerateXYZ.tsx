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

// this will create the 3d axis by calling single axis for each axis
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
    </group>
  );
}
