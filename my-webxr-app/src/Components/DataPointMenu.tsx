import { Billboard, BillboardProps, Plane, Text } from "@react-three/drei";
import { RefAttributes } from "react";
import { JSX } from "react/jsx-runtime";
import { Group, Object3DEventMap } from "three";
import {usePointSelectionContext} from "../contexts/PointSelectionContext.tsx";

export default function DataPointMenu(
  billboardProps: JSX.IntrinsicAttributes &
    Omit<BillboardProps, "ref"> &
    RefAttributes<Group<Object3DEventMap>>,
) {
    const { selectedDataPoint } =
        usePointSelectionContext();

  return (
    <Billboard visible={selectedDataPoint != null} {...billboardProps}>
      <Plane args={[1.75, 0.25]}>
        <Text fontSize={0.1} color={"black"}>
          Here are data point #{selectedDataPoint} properties!
        </Text>
      </Plane>
    </Billboard>
  );
}
