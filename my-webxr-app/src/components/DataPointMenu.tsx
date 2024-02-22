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
    // Spreading is justified since it is not feasible to account for all possible billboard props
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Billboard visible={selectedDataPoint != null} {...billboardProps}>
      <Plane args={[1.75, 0.25]}>
        <Text fontSize={0.1} color="black">
          Here are data point #
          {selectedDataPoint == null ? '-' : selectedDataPoint}
          {' '}
          properties!
        </Text>
      </Plane>
    </Billboard>
  );
}
