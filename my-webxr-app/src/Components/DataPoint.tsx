import { Interactive } from "@react-three/xr";
import { useState } from "react";
import { BackSide } from "three";
import { usePointSelectionContext } from "../contexts/PointSelectionContext.tsx";

interface DataPointProps {
  id: number;
  meshProps?: JSX.IntrinsicElements["mesh"];
}

export default function DataPoint({ id, meshProps }: DataPointProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { selectedDataPoint, setSelectedDataPoint } =
    usePointSelectionContext();

  const setIsSelected = () => {
    selectedDataPoint === id
      ? setSelectedDataPoint(null)
      : setSelectedDataPoint(id);
  };

  return (
    <Interactive
      onHover={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      onSelect={() => setIsSelected()}
    >
      <mesh {...meshProps}>
        {/* Low numbers to try to minimize the number of faces we need to render*/}
        {/* There will be a LOT of these present in the simulation */}
        <sphereGeometry args={[0.1, 10, 10]} />
        <meshStandardMaterial />
      </mesh>
      <mesh
        {...meshProps}
        scale={1.25}
        visible={isHovered || selectedDataPoint === id}
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
