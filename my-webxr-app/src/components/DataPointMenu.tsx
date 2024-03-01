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
          {selectedDataPoint == null ? '-' : selectedDataPoint.id}
          {' '}
          properties!
          {'\n\n'}
          Marker:
          {' '}
          {selectedDataPoint == null ? '-' : `${selectedDataPoint.marker}\n`}
          Color:
          {' '}
          {selectedDataPoint == null ? '-' : `${selectedDataPoint.color}\n`}
          x, y, z:
          {' '}
          {selectedDataPoint == null ? '-' : `${selectedDataPoint.meshProps?.position}\n`}
          Column X:
          {' '}
          {selectedDataPoint == null ? '-' : `${selectedDataPoint.columnX}\n`}
          Column Y:
          {' '}
          {selectedDataPoint == null ? '-' : `${selectedDataPoint.columnY}\n`}
          Column Z:
          {' '}
          {selectedDataPoint == null ? '-' : selectedDataPoint.columnZ}
        </Text>
      </Plane>
    </Billboard>
  );
}
