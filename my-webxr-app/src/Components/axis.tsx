import React from "react";
import {Interactive} from "@react-three/xr";
import {OrbitControls} from "@react-three/drei";
import SingleAxis from "./singleAxis";


interface AxisProps {
    minValue: number;
    maxValue: number;
    scaleFactor: number
    labelOffset: number;
    startX: number,
    startY: number,
    startZ: number,
    endPoint: number,
    radius: number
}

// this will create the 3d axis by calling single axis
// still deciding if it will be 6 half axes or 3 full axes
const Axis: React.FC<AxisProps> = ({
                                       minValue,
                                       maxValue,
                                       labelOffset,
                                       scaleFactor,
                                       startX,
                                       startY,
                                       startZ,
                                       endPoint,
                                       radius,
                                   }) => {
    return (
        <Interactive>
            {/* position of the whole axis */}
            <group position={[startX, startY, startZ]}>
                {/* X-axis */}
                <SingleAxis
                    startX={startX}
                    startY={startY}
                    startZ={startZ}
                    endX={startX + endPoint}
                    endY={startY}
                    endZ={startZ}
                    radius={radius}
                    labelOffset={labelOffset}
                    scaleFactor={scaleFactor}
                    minValue={minValue}
                    maxValue={maxValue}
                />
                {/* Y-axis */}
                <SingleAxis
                    startX={startX}
                    startY={startY}
                    startZ={startZ}
                    endX={startX}
                    endY={startY + endPoint}
                    endZ={startZ}
                    radius={radius}
                    labelOffset={labelOffset}
                    scaleFactor={scaleFactor}
                    minValue={minValue}
                    maxValue={maxValue}
                />
                {/* Z-axis */}
                <SingleAxis
                    startX={startX}
                    startY={startY}
                    startZ={startZ}
                    endX={startX}
                    endY={startY}
                    endZ={startZ + endPoint}
                    radius={radius}
                    labelOffset={labelOffset}
                    scaleFactor={scaleFactor}
                    minValue={minValue}
                    maxValue={maxValue}
                />
            </group>
            <OrbitControls/>
        </Interactive>
    );
};

export default Axis;
