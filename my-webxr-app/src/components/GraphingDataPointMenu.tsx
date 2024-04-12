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
 * Creates a billboard to display the related information of a data point in a 3D graph.
 * The billboard is visible when a data point is selected and displays properties of the data point.
 *
 * @param {JSX.IntrinsicAttributes &
 * Omit<BillboardProps, "ref"> & React.RefAttributes<Group>} billboardProps
 * Props to provide to the Billboard element. These props control the appearance and behavior of the
 * billboard.
 *
 * @pre-condition A data point must be selected for the billboard to be visible.
 * @post-condition A billboard is returned that displays the properties of the selected data point.
 *
 * @return {JSX.Element} A billboard that displays the properties of the selected data point.
 * If no data point is selected, the billboard is not visible.
 *
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
      <Plane args={[1.25, 1.5]}>
        <meshBasicMaterial color="gray" />
        {/* A negative depth offset brings the object closer to the viewer */}
        <Text fontSize={0.075} color="black" depthOffset={-4}>
          {`Data point #${selectedDataPoint?.id ?? '-'} properties!\n\n`}
          {WriteHook(`| ${String(selectedDataPoint?.id)} : `)}
          {`[Color]    ${selectedDataPoint?.color ?? '-'}\n`}
          {WriteHook(`${String(selectedDataPoint?.color)} : `)}

          {`[X axis]    ${selectedDataPoint?.columnX ?? '-'}: ${
            selectedDataPoint?.actualXYZData
              ? `${selectedDataPoint.actualXYZData[0]}` : '_'}\n`}

          {`[Y axis]    ${selectedDataPoint?.columnY ?? '-'}: ${
            selectedDataPoint?.actualXYZData
              ? `${selectedDataPoint.actualXYZData[1]}` : '_'}\n`}

          {`[Z axis]    ${selectedDataPoint?.columnZ ?? '-'}: ${
            selectedDataPoint?.actualXYZData
              ? `${selectedDataPoint.actualXYZData[2]}` : '_'}\n`}

          {// Display optional column values if any of them are selected
  selectedDataPoint?.optionalColumns && selectedDataPoint?.optionalColumnData
  && (() => {
    let result = '';
    for (let i = 0; i < selectedDataPoint.optionalColumns.length; i += 1) {
      result += `[Col ${i + 1} ]    ${selectedDataPoint.optionalColumns[i]}: ${selectedDataPoint.optionalColumnData[i]}\n`;
    }
    return result;
  })()
}
        </Text>
      </Plane>
    </Billboard>
  );
}
