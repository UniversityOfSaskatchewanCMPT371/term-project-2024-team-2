import { Interactive } from '@react-three/xr';
import { useState } from 'react';
import { BackSide } from 'three';
import { useRollbar } from '@rollbar/react';
import { usePointSelectionContext } from '../contexts/PointSelectionContext';
import { DataPointProps } from '../types/DataPointTypes';
import WriteHook from '../smoketest/TestHookWrite';

/**
 * Creates a VR element of an intractable datapoint
 * @pre-condition None
 * @post-condition a VR element of an intractable datapoint
 * @param {number} id the id of the object
 * @param {string} marker the marker to display in the data point summary
 * @param {string} color the colour of the object
 * @param {string} columnX the name of the x-axis data column
 * @param {string} columnY the name of the y-axis data column
 * @param {string} columnZ the name of the z-axis data column
 * @param {number | undefined} outlineScale the amount of outline to put around a hovered
 *    data element
 * @param {number[] | undefined} actualData the data to assign to the datapoint
 * @param {[radius: number | undefined, widthSegments: number | undefined,
 *    heightSegments: number | undefined, phiStart: number | undefined,
 *    phiLength: number | undefined, thetaStart: number | undefined,
 *    thetaLength: number | undefined] | undefined} size the radius of the datapoint
 * @param {(Omit<Node<Mesh<BufferGeometry, Material | Material[], Object3DEventMap>, Mesh>,
 *    "position" | "up" | "scale" | "rotation" | "matrix" | "quaternion" | "layers" | "dispose"> &
 *    {position?: Vector3, up?: Vector3, scale?: Vector3, rotation?: Euler, matrix?: Matrix4,
 *    quaternion?: Quaternion, layers?: Layers, dispose?: (() => void) | null} &
 *    EventHandlers) | undefined} meshProps Props to provide to the sphereMesh
 * @return {JSX.Element} a VR element of an intractable datapoint
 * @constructor
 */
export default function GraphingDataPoint({
  id, marker, color, columnX, columnY, columnZ, outlineScale, actualData, size, meshProps,
}: DataPointProps): JSX.Element {
  /* State for the count of controllers hovering over the GraphingDataPoint */
  const [hoverCount, setHoverCount] = useState(0);
  /* Access the selected GraphingDataPoint State from the shared PointSelectionContext */
  const { selectedDataPoint, setSelectedDataPoint } = usePointSelectionContext();
  const rollbar = useRollbar();

  const adjustHoverCount = (amount: number) => {
    if (amount < 0 || amount > 2) {
      throw new Error(
        'Assertion failed: hoverCount should never be < 0 or > 2',
      );
    }

    rollbar.debug(`GraphingDataPoint #${id}: setting hover count to ${amount}`);
    setHoverCount(amount);
    WriteHook('Datapoint is hovered : ');
  };

  return (
    <Interactive
      onHover={() => adjustHoverCount(hoverCount + 1)}
      onBlur={() => adjustHoverCount(hoverCount - 1)}
      onSelect={() => {
        // If currently selected point selected again, de-select by clearing current selection
        if (selectedDataPoint?.id === id) {
          setSelectedDataPoint(null);

        // Update point to be selected and set its fields
        } else {
          setSelectedDataPoint({
            id, marker, color, columnX, columnY, columnZ, actualData, meshProps,
          });
          WriteHook(`${String(actualData)} : `);
        }
      }}
    >
      {/* This first mesh stores custom data about the GraphingDataPoint */}
      <mesh
        userData={{
          id, columnX, columnY, columnZ, marker, actualData, color,
        }}
        {...meshProps}
      >
        {/* Low numbers to try to minimize the number of faces we need to render */}
        {/* There will be a LOT of these present in the simulation */}
        <octahedronGeometry args={size} />
        <meshStandardMaterial color="yellow" />
      </mesh>

      {/* This second mesh is the outline which works by rendering */}
      {/* only the BackSide of the mesh material */}
      {(hoverCount !== 0 || selectedDataPoint?.id === id) && (
      <mesh
        name="point sphere"
        {...meshProps}
        scale={outlineScale}
      >
        <octahedronGeometry args={size} />
        <meshStandardMaterial
          color={selectedDataPoint?.id === id ? 'darkorange' : 'purple'}
          side={BackSide}
        />
      </mesh>
      )}
    </Interactive>
  );
}

/**
 * Specify default values for GraphingDataPoint's optional props.
 */
GraphingDataPoint.defaultProps = {
  outlineScale: 1.25,
  size: [0.01, 10, 10],
  meshProps: {},
};
