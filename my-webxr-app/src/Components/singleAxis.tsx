import React from "react";
import * as THREE from "three";
import {Text} from "@react-three/drei";

interface singleAxisProps {
    startX: number;
    startY: number;
    startZ: number;
    endX: number;
    endY: number;
    endZ: number;
    scaleFactor: number;
    radius: number;
    labelOffset: number;
    minValue: number;
    maxValue: number;
}

// this function will create an axis
const SingleAxis: React.FC<singleAxisProps> = ({
                                                   startX,
                                                   startY,
                                                   startZ,
                                                   endX,
                                                   endY,
                                                   endZ,
                                                   radius,
                                                   labelOffset,
                                                   scaleFactor,
                                                   minValue,
                                                   maxValue
                                               }) => {
    let axisGeometry;
    let position;
    let rotation;
    // starting coordinates for the axis
    const start = [startX, startY, startZ];
    // axisLabels the labels for the ticks on the axis
    const axisLabels = Array.from({length: maxValue - minValue + 1 + 20}, (_, i) => i + minValue - 10);

    let color: string = "";

    if (startX !== endX) {
        color = "red";
        axisGeometry = new THREE.CylinderGeometry(radius, radius, scaleFactor, 10);
        position = new THREE.Vector3(startX, startY, startZ);
        rotation = new THREE.Euler(0, 0, Math.PI / 2);
    } else if (startY !== endY) {
        color = "forestgreen";
        axisGeometry = new THREE.CylinderGeometry(radius, radius, scaleFactor, 10);
        position = new THREE.Vector3(startX, startY, startZ);
        rotation = new THREE.Euler(0, 0, 0);
    } else if (startZ !== endZ) {
        color = "blue";
        axisGeometry = new THREE.CylinderGeometry(radius, radius, scaleFactor, 10);
        position = new THREE.Vector3(startX, startY, startZ);
        rotation = new THREE.Euler(Math.PI / 2, 0, 0);
    }

    if (!axisGeometry) return null; // Return null if axisGeometry is not defined

    const material = new THREE.MeshBasicMaterial({color});

    return (
        <>
            {/* Create the axis (tube) and color it*/}
            <mesh geometry={axisGeometry} material={material} position={position} rotation={rotation}/>

            {/* create the ticks and matching labels for the axis */}
            {axisLabels.map(label => {
                let positionNums: [number, number, number] = [0, 0, 0];
                let positionTicks: [number, number, number] = [0, 0, 0];
                let ticksShape: [number, number, number] = [0, 0, 0]
                // if x-axis place ticks and numbers in on x-axis
                if (startX != endX) {
                    positionNums = [
                        start[0] + labelOffset * label * scaleFactor / 2,
                        start[1] - 0.015,
                        start[2]
                    ];
                    positionTicks = [
                        start[0] + labelOffset * label * scaleFactor / 2,
                        start[1],
                        start[2]
                    ];
                    ticksShape = [0.001, 0.01, 0]
                }
                // if y-axis place ticks and numbers in on y-axis
                else if (startY !== endY) {
                    positionNums = [
                        start[0] - 0.015,
                        start[1] + labelOffset * label * scaleFactor / 2,
                        start[2]
                    ];
                    positionTicks = [
                        start[0],
                        start[1] + labelOffset * label * scaleFactor / 2,
                        start[2]
                    ];
                    ticksShape = [0.01, 0.001, 0]
                }
                // if z-axis place ticks and numbers in on x-axis
                else if (startZ !== endZ) {
                    positionNums = [
                        start[0],
                        start[1] - 0.015,
                        start[2] + labelOffset * label * scaleFactor / 2
                    ];
                    positionTicks = [
                        start[0],
                        start[1],
                        start[2] + labelOffset * label * scaleFactor / 2
                    ];
                    ticksShape = [0, 0.01, 0.001]
                }

                return (
                    <React.Fragment key={`label${label}`}>
                        {/* numbers on axis */}
                        <Text
                            position={positionNums}
                            fontSize={0.01}
                            color={0}
                        >
                            {label}
                        </Text>
                        {/* ticks on axis */}
                        <mesh
                            position={positionTicks}
                        >
                            <boxGeometry args={ticksShape}/>
                            <meshStandardMaterial color={0}/>
                        </mesh>
                    </React.Fragment>
                );
            })}
        </>
    );
};

export default SingleAxis;