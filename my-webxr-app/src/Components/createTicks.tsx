import {Text} from "@react-three/drei";

// this function creates the ticks and labels for the axes
export const GenerateTicks = (
    startX: number,
    startY: number,
    startZ: number,
    labelOffset: number,
    scaleFactor: number,
    radius: number,
    label: number,
    increment: number,
    axis: string,
) => {
    let positionTicks: [number, number, number] | undefined;
    let positionLabels: [number, number, number] | undefined;
    let ticksShape: [number, number, number] | undefined;

    // conditional to check which axis we want the ticks and labels to be on
    if (axis === "x") {
        positionTicks = [
            // this calculation gives the correct space between each tick
            startX + labelOffset * label * scaleFactor / 2,
            startY,
            startZ
        ];
        positionLabels = [
            // this calculation gives the correct space between each label
            startX + labelOffset * label * scaleFactor / 2,
            startY - 0.02,
            startZ
        ];
        ticksShape = [0.002, radius * 7, radius * 2];
    } else if (axis === "y") {
        positionTicks = [
            startX,
            startY + labelOffset * label * scaleFactor / 2,
            startZ
        ];
        positionLabels = [
            startX + 0.03,
            startY + labelOffset * label * scaleFactor / 2,
            startZ
        ];
        ticksShape = [radius * 7, 0.002, radius * 2];
    } else if (axis === "z") {
        positionTicks = [
            startX,
            startY,
            startZ + labelOffset * label * scaleFactor / 2
        ];
        positionLabels = [
            startX,
            startY - 0.02,
            startZ + labelOffset * label * scaleFactor / 2
        ];
        ticksShape = [0.002, radius * 7, radius * 2];
    }

    // labelText is assigned the correct label by multiplying by the increment
    const labelText: string = `${label * increment}`;

    return (
        <group>
            {/* this mesh contains the position and shape of ticks */}
            <mesh position={positionTicks}>
                <boxGeometry args={ticksShape}/>
                <meshStandardMaterial color={"black"}/>
            </mesh>
            {/* this Text contains the position and shape of labels */}
            <Text
                position={positionLabels}
                fontSize={0.02}
                color="black"
            >
                {labelText}
            </Text>
        </group>
    );
};
