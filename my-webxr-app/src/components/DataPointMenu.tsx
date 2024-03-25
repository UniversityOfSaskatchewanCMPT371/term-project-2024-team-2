import {
  Billboard, BillboardProps, Plane, Text,
} from '@react-three/drei';
import { RefAttributes } from 'react';
import { JSX } from 'react/jsx-runtime';
import { Group } from 'three';
import { usePointSelectionContext } from '../contexts/PointSelectionContext';

export default function DataPointMenu(
  billboardProps: JSX.IntrinsicAttributes &
  Omit<BillboardProps, 'ref'> &
  RefAttributes<Group>,
) {
  /* Access the selected DataPoint State from the shared PointSelectionContext */
  const { selectedDataPoint } = usePointSelectionContext();

  return (
    <Billboard visible={selectedDataPoint != null} {...billboardProps}>
      <Plane args={[1.25, 0.8]}>
        {/* A negative depth offset brings the object closer to the viewer */}
        <Text fontSize={0.075} color="black" depthOffset={-4}>
          {`Here are data point # ${selectedDataPoint?.id ?? '-'} properties!\n\n`}
          {`Marker: ${selectedDataPoint?.marker ?? '-'}\n`}
          {`Color: ${selectedDataPoint?.color ?? '-'}\n`}
          {`x, y, z: ${
            selectedDataPoint?.actualData
              ? `${selectedDataPoint.actualData[0]}, ${selectedDataPoint.actualData[1]}, ${selectedDataPoint.actualData[2]}`
              : '0, 0, 0'
          }\n`}
          {`Column X: ${selectedDataPoint?.columnX ?? '-'}\n`}
          {`Column Y: ${selectedDataPoint?.columnY ?? '-'}\n`}
          {`Column Z: ${selectedDataPoint?.columnZ ?? '-'}`}
        </Text>
      </Plane>
    </Billboard>
  );
}
