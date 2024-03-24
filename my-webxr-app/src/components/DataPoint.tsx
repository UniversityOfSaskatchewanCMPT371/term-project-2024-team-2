import { Interactive } from '@react-three/xr';
import { useState } from 'react';
import { BackSide, TextureLoader } from 'three';
// import * as log4js from "log4js";
import { useLoader } from '@react-three/fiber';
import { usePointSelectionContext } from '../contexts/PointSelectionContext';
import { DataPointProps } from '../types/DataPointTypes';
// eslint-disable-next-line import/no-absolute-path
import circleImg from '/circle.png';

export default function DataPoint({
  id, marker, color, columnX, columnY, columnZ, outlineScale, size, meshProps, positions,

}: DataPointProps) {
  /* State for the count of controllers hovering over the DataPoint */
  const [hoverCount, setHoverCount] = useState(0);
  /* Access the selected DataPoint State from the shared PointSelectionContext */
  const { selectedDataPoint, setSelectedDataPoint } = usePointSelectionContext();

  const adjustHoverCount = (amount: number) => {
    if (amount < 0 || amount > 2) {
      throw new Error(
        'Assertion failed: hoverCount should never be < 0 or > 2',
      );
    }

    // Critical Failure: log4js accesses process.env() which vite removes.
    // We will have to find a way around this.
    // log4js
    //   .getLogger()
    //   .debug("DataPoint #" + id + ": setting hover count to " + amount);
    setHoverCount(amount);
  };
  // console.log(pointProps);
  const CircleImg = useLoader(TextureLoader, circleImg);
  return (
    <Interactive
      onHover={() => adjustHoverCount(hoverCount + 1)}
      onBlur={() => adjustHoverCount(hoverCount - 1)}
      onSelect={() => {
        // If currently selected point selected again, de-select by clearing current selection
        if (selectedDataPoint?.id === id) {
          setSelectedDataPoint(null);

          // Update point to be selected and set its fields
        } else {
          setSelectedDataPoint({
            id, marker, color, columnX, columnY, columnZ, positions,
          });
        }
      }}
    >

      <points>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            array={positions}
            count={positions.length / 3} //
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          attach="material"
          map={CircleImg}
          color={0x000000}
          size={0.01}
          sizeAttenuation
          transparent={false}
          alphaTest={0.5}
          opacity={1.0}
        />
      </points>

      {/* This second mesh is the outline which works by rendering */}
      {/* only the BackSide of the mesh material */}
      <mesh
        {...meshProps}
        scale={outlineScale}
        visible={hoverCount !== 0 || selectedDataPoint?.id === id}
      >
        <sphereGeometry args={size} />
        <meshStandardMaterial
          color={selectedDataPoint?.id === id ? 'blue' : 'aqua'}
          side={BackSide}
        />
      </mesh>
    </Interactive>
  );
}

/**
 * Specify default values for DataPoint's optional props.
 */
DataPoint.defaultProps = {
  outlineScale: 1.25,
  size: [0.01, 10, 10],
  meshProps: {},
};
