import { useState } from "react";
import { Interactive } from "@react-three/xr";
import { BackSide } from "three";

export default function DataPoint(meshProps: JSX.IntrinsicElements["mesh"]) {
  const [isHovered, setIsHovered] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  return (
    <Interactive
      onHover={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      onSelect={() => setIsSelected(!isSelected)}
    >
      <mesh {...meshProps}>
        {/* Low numbers to try to minimize the number of faces we need to render*/}
        {/* There will be a LOT of these present in the simulation */}
        <sphereGeometry args={[0.1, 10, 10]} />
        <meshStandardMaterial />
      </mesh>
      <mesh {...meshProps} scale={1.25} visible={isHovered || isSelected}>
        <sphereGeometry args={[0.1, 10, 10]} />
        <meshStandardMaterial
          color={isSelected ? "blue" : "aqua"}
          side={BackSide}
        />
      </mesh>
    </Interactive>
  );
}
