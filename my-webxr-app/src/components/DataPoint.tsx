import { Interactive } from '@react-three/xr';
import { useState } from 'react';
import { BackSide } from 'three';
// import * as log4js from "log4js";
import { SphereGeometryProps } from '@react-three/fiber';
import { usePointSelectionContext } from '../contexts/PointSelectionContext.tsx';

/**
 * Define an interface to require an ID number to differentiate each DataPoint
 * and allow other mesh properties to be set.
 */
interface DataPointProps {
  id: number;
  outlineScale?: number;
  size?: SphereGeometryProps['args'];
  meshProps?: JSX.IntrinsicElements['mesh'];
}

export default function DataPoint({
  id,
  outlineScale,
  size,
  meshProps,
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

  return (
    <Interactive
      onHover={() => adjustHoverCount(hoverCount + 1)}
      onBlur={() => adjustHoverCount(hoverCount - 1)}
      onSelect={() => {
        selectedDataPoint === id
          ? setSelectedDataPoint(null)
          : setSelectedDataPoint(id);
      }}
    >
      <mesh {...meshProps}>
        {/* Low numbers to try to minimize the number of faces we need to render */}
        {/* There will be a LOT of these present in the simulation */}
        <sphereGeometry args={size || [0.1, 10, 10]} />
        <meshStandardMaterial />
      </mesh>

      {/* This second mesh is the outline which works by rendering */}
      {/* only the BackSide of the mesh material */}
      <mesh
        {...meshProps}
        scale={outlineScale || 1.25}
        visible={hoverCount != 0 || selectedDataPoint === id}
      >
        <sphereGeometry args={size || [0.1, 10, 10]} />
        <meshStandardMaterial
          color={selectedDataPoint === id ? 'blue' : 'aqua'}
          side={BackSide}
        />
      </mesh>
    </Interactive>
  );
}
