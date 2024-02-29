import { Interactive } from "@react-three/xr";
import { useState } from "react";
import { BackSide } from "three";
// import * as log4js from "log4js";
import { usePointSelectionContext } from "../contexts/PointSelectionContext.tsx";
import {MeshProps, SphereGeometryProps} from "@react-three/fiber";

/**
 * Define an interface to require an ID number to differentiate each DataPoint
 * and allow other mesh properties to be set.
 */
interface DataPointProps {
  id: number;
  column1: string;
  column2: string;
  column3: number;
  color: string
  marker: string
  outlineScale?: number;
  size?: SphereGeometryProps["args"];
  meshProps?: JSX.IntrinsicElements["mesh"];
}

export default function DataPoint({
  id, marker, color, column1, column2, column3, outlineScale, size, meshProps

}: DataPointProps) {
  /* State for the count of controllers hovering over the DataPoint */
  const [hoverCount, setHoverCount] = useState(0);
  /* Access the selected DataPoint State from the shared PointSelectionContext */
  const { selectedDataPoint, setSelectedDataPoint } =
    usePointSelectionContext();

  const adjustHoverCount = (amount: number) => {
    if (amount < 0 || amount > 2) {
      throw new Error(
        "Assertion failed: hoverCount should never be < 0 or > 2",
      );
    }

    // Critical Failure: log4js accesses process.env() which vite removes.
    // We will have to find a way around this.
    // log4js
    //   .getLogger()
    //   .debug("DataPoint #" + id + ": setting hover count to " + amount);
    setHoverCount(amount);
  };

  // Display the point characteristics in console
  const showSelectedDataPointInfo = (id: number, marker: string, color: string, column1: string, column2: string, column3: number, meshProps?: MeshProps ) => {
    console.log("Selected Data Point:");
    console.log("ID:", id);
    console.log("Marker:", marker);
    console.log("Color:", color);
    console.log("Position:", meshProps?.position);
    console.log("Column 1:", column1);
    console.log("Column 2:", column2);
    console.log("Column 3:", column3);
  }

  return (
    <Interactive
      onHover={() => adjustHoverCount(hoverCount + 1)}
      onBlur={() => adjustHoverCount(hoverCount - 1)}
      onSelect={() => {
        // Clear current selection
        if (selectedDataPoint?.id === id) {
          setSelectedDataPoint(null);
        }
        // Update new selected point with its characteristics and print to UI
        else {
          setSelectedDataPoint({id, marker, color, column1, column2, column3, meshProps});
          console.log(selectedDataPoint?.meshProps?.position)
          showSelectedDataPointInfo(id, marker, color, column1, column2, column3, meshProps);
        }
      }}
    >
      {/* This first mesh stores custom data about the DataPoint */}
      <mesh userData={{ id, column1, column2, column3, marker, color }} {...meshProps}>
        {/* Low numbers to try to minimize the number of faces we need to render*/}
        {/* There will be a LOT of these present in the simulation */}
        <sphereGeometry args={size || [0.1, 10, 10]} />
        <meshStandardMaterial />
      </mesh>

      {/* This second mesh is the outline which works by rendering */}
      {/* only the BackSide of the mesh material */}
      <mesh
        {...meshProps}
        scale={outlineScale || 1.25}
        visible={hoverCount != 0 || selectedDataPoint?.id === id}
      >
        <sphereGeometry args={size || [0.1, 10, 10]} />
        <meshStandardMaterial
          color={selectedDataPoint?.id === id ? "blue" : "aqua"}
          side={BackSide}
        />
      </mesh>
    </Interactive>
  );
}
