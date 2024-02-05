import {XR, Controllers, VRButton} from '@react-three/xr'
import {Sky} from '@react-three/drei'
import '@react-three/fiber'
import './styles.css'
import {Canvas} from '@react-three/fiber'
import Floor from './Components/Floor'
// import RotatingBox from './Components/RotatingBox'
// import Button from './Components/Button'
import Axis from "./Components/axis.tsx";

const startPointX = 0;
const startPointY = 0.70;
const startPointZ = -0.30;
const endPoint = 2;
const startPoint: [number, number, number] = [startPointX, startPointY, startPointZ]
const endPointX: [number, number, number] = [endPoint, startPointY, startPointZ];
const endPointY: [number, number, number] = [startPointX, endPoint + startPointY, startPointZ];
const endPointZ: [number, number, number] = [startPointX, startPointY, endPoint + startPointZ];
const radius = 0.005;
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
                    <Axis start={startPoint} endX={endPointX} endY={endPointY} endZ={endPointZ} radius={radius}
                          colorX={"red"} colorY={"yellow"} colorZ={"blue"} labelOffset={0.1}/>
                </XR>
            </Canvas>
        </>
    )
}

