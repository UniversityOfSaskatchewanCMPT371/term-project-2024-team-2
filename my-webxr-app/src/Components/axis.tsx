import React from "react";
import * as THREE from "three";
import {Interactive} from "@react-three/xr";
import {Text} from "@react-three/drei";

interface AxisProps {
    start: [number, number, number];
    endX: [number, number, number];
    endY: [number, number, number];
    endZ: [number, number, number];
    radius: number;
    colorX: string;
    colorY: string;
    colorZ: string;
    labelOffset: number;
}
// So I currently have a 3D axis with 1-10 ticks.
// I need to make it so the ticks stay inline with the length of the graph always.
// So probably another changing variable to continuously adjust size and length.
// Then I will have to make numbers change along what data is inputted, or maybe have no numbers.
const Axis: React.FC<AxisProps> = ({
                                       start,
                                       endX,
                                       endY,
                                       endZ,
                                       radius,
                                       colorX,
                                       colorY,
                                       colorZ,
                                       labelOffset
                                   }) => {
    const tubePathX = new THREE.CatmullRomCurve3([new THREE.Vector3(...start), new THREE.Vector3(...endX)]);
    const tubePathY = new THREE.CatmullRomCurve3([new THREE.Vector3(...start), new THREE.Vector3(...endY)]);
    const tubePathZ = new THREE.CatmullRomCurve3([new THREE.Vector3(...start), new THREE.Vector3(...endZ)]);

    const axisLabelsX = Array.from({length: 10}, (_, i) => i + 1);
    const axisLabelsY = Array.from({length: 10}, (_, i) => i + 1);
    const axisLabelsZ = Array.from({length: 10}, (_, i) => i + 1);

    return (
        <Interactive>
            <group position={start}>
                {/* X-axis */}
                <mesh>
                    <tubeGeometry args={[tubePathX, 2, radius, 20, true]}/>
                    <meshStandardMaterial color={colorX}/>
                </mesh>
                {axisLabelsX.map((label, index) => (
                    <React.Fragment key={`labelX${index}`}>
                        <Text
                            position={[
                                start[0] + labelOffset * label,
                                endX[1] - 0.06,
                                endX[2]
                            ]}
                            fontSize={0.05}
                            color={0}
                        >
                            {label}
                        </Text>
                        {/* Ticks for X-axis */}
                        <mesh position={[start[0] + labelOffset * label, endX[1], endX[2]]}>
                            <boxGeometry args={[0.005, 0.02, 0]}/>
                            <meshStandardMaterial color={0}/>
                        </mesh>
                    </React.Fragment>
                ))}
                {/* Y-axis */}
                <mesh>
                    <tubeGeometry args={[tubePathY, 2, radius, 20, true]}/>
                    <meshStandardMaterial color={colorY}/>
                </mesh>
                {axisLabelsY.map((label, index) => (
                    <React.Fragment key={`labelY${index}`}>
                        <Text

                            position={[
                                endY[0] - 0.06,
                                start[1] + labelOffset * label,
                                endY[2]
                            ]}
                            fontSize={0.05}
                            color={0}
                        >
                            {label}
                        </Text>
                        {/* Ticks for Y-axis */}
                        <mesh position={[endY[0], start[1] + labelOffset * label, endY[2]]}>
                            <boxGeometry args={[0.02, 0.005, 0]}/>
                            <meshStandardMaterial color={0}/>
                        </mesh>
                    </React.Fragment>
                ))}
                {/* Z-axis */}
                <mesh>
                    <tubeGeometry args={[tubePathZ, 2, radius, 20, true]}/>
                    <meshStandardMaterial color={colorZ}/>
                </mesh>
                {axisLabelsZ.map((label, index) => (
                    <React.Fragment key={`labelZ${index}`}>
                        <Text
                            position={[
                                endZ[0],
                                endZ[1] - 0.06,
                                start[2] + labelOffset * label
                            ]}
                            fontSize={0.05}
                            color={0}
                        >
                            {label}
                        </Text>
                        {/* Ticks for Y-axis */}
                        <mesh position={[endZ[0], endZ[1], start[2] + labelOffset * label]}>
                            <boxGeometry args={[0, 0.02, 0.005]}/>
                            <meshStandardMaterial color={0}/>
                        </mesh>
                    </React.Fragment>
                ))}
            </group>
        </Interactive>
    )
        ;
};

export default Axis;
