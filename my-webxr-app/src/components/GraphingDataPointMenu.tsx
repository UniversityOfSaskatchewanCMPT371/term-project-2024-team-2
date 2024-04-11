import {
  Billboard, BillboardProps, Plane, Text,
} from '@react-three/drei';
import React, { RefAttributes, useEffect, useState } from 'react';
import { JSX } from 'react/jsx-runtime';
import { Group } from 'three';
import { usePointSelectionContext } from '../contexts/PointSelectionContext';
import WriteHook from '../../smoketests/TestHookWrite';
import { DataPointProps } from '../types/DataPointTypes';

/**
 * Creates a billboard to display the related information of the data point
 * @pre-condition None
 * @post-condition a billboard to display the related information of the data point
 * @param {JSX.IntrinsicAttributes & Omit<BillboardProps,
 *      "ref"> & React.RefAttributes<Group>} billboardProps Props to provide to the Billboard
 *      element
 * @return {JSX.Element} a billboard to display the related information of the data point
 * @constructor
 */
export default function GraphingDataPointMenu(
  billboardProps: JSX.IntrinsicAttributes &
  Omit<BillboardProps, 'ref'> &
  RefAttributes<Group>,
) {
  /* Access the selected GraphingDataPoint State from the shared PointSelectionContext */
  const { selectedDataPoint } = usePointSelectionContext();

  // Only setup this useEffect if we're testing since it's only for smoketesting
  if (import.meta.env.VITE_IS_TESTING === 'true') {
    const [previous, setPrevious]: [
      DataPointProps | null,
      React.Dispatch<React.SetStateAction<DataPointProps | null>>,
    ] = useState(null as null | DataPointProps); // Fun TS moment; required cast for some reason

    useEffect(() => {
      const awaitWrite = async () => {
        await WriteHook(selectedDataPoint != null
          ? `Now showing info for DataPoint ${selectedDataPoint.id}; previously ${previous?.id
          || null}:`
          : `No more DataPoint info to display; previously ${previous?.id || null}:`);
        setPrevious(selectedDataPoint);
      };

      awaitWrite().then(); // Use .then() to wait for the promise
    }, [selectedDataPoint]);
  }

  return (
    <Billboard visible={selectedDataPoint != null} {...billboardProps}>
      <Plane args={[1.25, 0.8]}>
        <meshBasicMaterial color="gray" />
        {/* A negative depth offset brings the object closer to the viewer */}
        <Text fontSize={0.075} color="black" depthOffset={-4}>
          {`Data point #${selectedDataPoint?.id ?? '-'} properties!\n\n`}
          {WriteHook(`| ${String(selectedDataPoint?.id)} : `)}
          {`Color: ${selectedDataPoint?.color ?? '-'}\n`}
          {WriteHook(`${String(selectedDataPoint?.color)} : `)}

          {`(x-axis) ${selectedDataPoint?.columnX ?? '-'}: ${
            selectedDataPoint?.actualXYZData
              ? `${selectedDataPoint.actualXYZData[0]}` : '_'}\n`}

          {`(y-axis) ${selectedDataPoint?.columnY ?? '-'}: ${
            selectedDataPoint?.actualXYZData
              ? `${selectedDataPoint.actualXYZData[1]}` : '_'}\n`}

          {`(z-axis) ${selectedDataPoint?.columnZ ?? '-'}: ${
            selectedDataPoint?.actualXYZData
              ? `${selectedDataPoint.actualXYZData[2]}` : '_'}\n`}

        </Text>
      </Plane>
    </Billboard>
  );
}
