import { Interactive } from '@react-three/xr';
import { useState } from 'react';
import { BackSide } from 'three';
// import * as log4js from "log4js";
import { usePointSelectionContext } from '../contexts/PointSelectionContext';
import { DataPointProps } from '../types/DataPointTypes';

export default function GraphingDataPoint({
  id, marker, color, columnX, columnY, columnZ, outlineScale, actualData, size, meshProps,

}: DataPointProps) {
  /* State for the count of controllers hovering over the GraphingDataPoint */
  const [hoverCount, setHoverCount] = useState(0);
  /* Access the selected GraphingDataPoint State from the shared PointSelectionContext */
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
    //   .debug("GraphingDataPoint #" + id + ": setting hover count to " + amount);
    setHoverCount(amount);
  };

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
            id, marker, color, columnX, columnY, columnZ, actualData, meshProps,
          });
        }
      }}
    >
      {/* This first mesh stores custom data about the GraphingDataPoint */}
      <mesh
        userData={{
          id, columnX, columnY, columnZ, marker, actualData, color,
        }}
        {...meshProps}
      >
        {/* Low numbers to try to minimize the number of faces we need to render */}
        {/* There will be a LOT of these present in the simulation */}
        <sphereGeometry args={size} />
        <meshStandardMaterial />
      </mesh>

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
 * Specify default values for GraphingDataPoint's optional props.
 */
GraphingDataPoint.defaultProps = {
  outlineScale: 1.25,
  size: [0.01, 10, 10],
  meshProps: {},
};
