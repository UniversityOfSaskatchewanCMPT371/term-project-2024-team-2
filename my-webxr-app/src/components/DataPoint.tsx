import { Interactive } from "@react-three/xr";
import { useState } from "react";
import { BackSide } from "three";
import { usePointSelectionContext } from "../contexts/PointSelectionContext.tsx";

/**
 * Define an interface to require an ID number to differentiate each DataPoint
 * and allow other mesh properties to be set.
 */
interface DataPointProps {
  id: number;
  meshProps?: JSX.IntrinsicElements["mesh"];
}

export default function DataPoint({ id, meshProps }: DataPointProps) {
  /* State for the count of controllers hovering over the DataPoint */
  const [hoverCount, setHoverCount] = useState(0);
  /* Access the selected DataPoint State from the shared PointSelectionContext */
  const { selectedDataPoint, setSelectedDataPoint } =
    usePointSelectionContext();

  return (
    <Interactive
      onHover={() => setHoverCount(hoverCount + 1)}
      onBlur={() => setHoverCount(hoverCount - 1)}
      onSelect={() =>
        selectedDataPoint === id
          ? setSelectedDataPoint(null)
          : setSelectedDataPoint(id)
      }
    >
      <mesh {...meshProps}>
        {/* Low numbers to try to minimize the number of faces we need to render*/}
        {/* There will be a LOT of these present in the simulation */}
        <sphereGeometry args={[0.1, 10, 10]} />
        <meshStandardMaterial />
      </mesh>

      {/* This second mesh is the outline which works by rendering */}
      {/* only the BackSide of the mesh material */}
      <mesh
        {...meshProps}
        scale={1.25}
        visible={hoverCount != 0 || selectedDataPoint === id}
      >
        <sphereGeometry args={[0.1, 10, 10]} />
        <meshStandardMaterial
          color={selectedDataPoint === id ? "blue" : "aqua"}
          side={BackSide}
        />
      </mesh>
    </Interactive>
  );
}
