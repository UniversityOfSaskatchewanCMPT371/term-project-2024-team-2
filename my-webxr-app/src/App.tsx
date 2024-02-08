import {XR, Controllers, VRButton} from '@react-three/xr'
import {Sky} from '@react-three/drei'
import '@react-three/fiber'
import './styles.css'
import {Canvas} from '@react-three/fiber'
import Floor from './Components/Floor'
// import RotatingBox from './Components/RotatingBox'
// import Button from './Components/Button'
import Axis from "./Components/axis.tsx";

// minNum and maxNum will be from the csv file, just hardcoded for now
const minNum: number = -10;
const maxNum: number = 10;
// scaleFactor adjusts the size of the 3D axis
const scaleFactor: number = 1;
// labelOffset is the offset the axis ticks and labels will have
const labelOffset: number = 0.1;
//starting point of the axis
const startPointX: number = 0;
const startPointY: number = 0.82;
const startPointZ: number = -0.15;
// endPoint is used to determine what axis is being calculated, should not need to change
const endPoint: number = 1;
// adjust the size of the tube, shouldn't need to change unless
const radius: number = 0.002;

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

