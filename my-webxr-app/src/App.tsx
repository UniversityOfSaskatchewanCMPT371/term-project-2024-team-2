import {XR, Controllers, VRButton} from '@react-three/xr'
import {Sky} from '@react-three/drei'
import '@react-three/fiber'
import './styles.css'
import {Canvas} from '@react-three/fiber'
import Floor from './Components/Floor'
// import RotatingBox from './Components/RotatingBox'
// import Button from './Components/Button'
import Axis from "./Components/axis.tsx";

// minNum and maxNum will be from the csv file
const minNum = 0;
const maxNum = 10;
// scaleFactor adjusts the size of the 3D axis
const scaleFactor = 0.5;
// labelOffset is the offset the axis ticks and labels will have
const labelOffset = 0.1 * scaleFactor
const startPointX = 0;
const startPointY = 0.82;
const startPointZ = 0;
// endPoint is used to determine what axis is being calculated, should not need to change
const endPoint = 1;
const radius = 0.002;

export default function App() {
    return (
        <>
            <VRButton/>
            <Canvas>
                <XR>
                    <Sky sunPosition={[0, 1, 0]}/>
                    <Floor/>
                    <ambientLight/>
                    <pointLight position={[10, 10, 10]}/>
                    <Controllers/>
                    {/*<Button position={[0, 1.5, -1]}/>*/}
                    {/*<RotatingBox position={[0.8, 1.5, -1]}/>*/}
                    {/*<RotatingBox position={[-0.8, 1.5, -1]}/>*/}
                    <Axis minValue={minNum} maxValue={maxNum} scaleFactor={scaleFactor} startX={startPointX}
                          startY={startPointY} startZ={startPointZ} endPoint={endPoint} radius={radius}
                          labelOffset={labelOffset}/>
                </XR>
            </Canvas>
        </>
    )
}

