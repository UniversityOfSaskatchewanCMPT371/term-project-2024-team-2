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
      <Plane args={[1.25, 0.75]}>
        <Text fontSize={0.075} color="black">
          Here are data point #
          {' '}
          {selectedDataPoint?.id ?? '-'}
          {' '}
          properties!
          {'\n\n'}
          Marker:
          {' '}
          {`${selectedDataPoint?.marker ?? '-'}\n`}
          Color:
          {' '}
          {`${selectedDataPoint?.color ?? '-'}\n`}
          x, y, z:
          {' '}
          {`${selectedDataPoint?.meshProps?.position ?? '-'}\n`}
          Column X:
          {' '}
          {`${selectedDataPoint?.columnX ?? '-'}\n`}
          Column Y:
          {' '}
          {`${selectedDataPoint?.columnY ?? '-'}\n`}
          Column Z:
          {' '}
          {selectedDataPoint?.columnZ ?? '-'}
        </Text>
      </Plane>
    </Billboard>
  );
}
