import { XR, Controllers, VRButton } from '@react-three/xr'
import { Sky } from '@react-three/drei'
import '@react-three/fiber'
import './styles.css'
import { Canvas } from '@react-three/fiber'
import Floor from './Components/Floor'
// import RotatingBox from './Components/RotatingBox'
// import Button from './Components/Button'
import DataPoint from "./Components/DataPoint.tsx";
import { PointSelectionProvider } from "./contexts/PointSelectionContext.tsx";

export default function App() {
  return (
    <>
      <VRButton />
      <PointSelectionProvider>
        <Canvas>
          <XR>
            <Sky sunPosition={[0, 1, 0]} />
            <Floor />
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <Controllers />
            {/*<Button position={[0, 1.5, -1]} />*/}
            {/*<RotatingBox position={[0.8, 1.5, -1]} />*/}
            {/*<RotatingBox position={[-0.8, 1.5, -1]} />*/}

            <DataPoint id={0} meshProps={{ position: [0.25, 1.75, -0.75] }} />
            <DataPoint id={1} meshProps={{ position: [0, 1.75, -0.75] }} />
            <DataPoint id={2} meshProps={{ position: [-0.25, 1.75, -0.75] }} />
          </XR>
        </Canvas>
      </PointSelectionProvider>
    </>
  );
}
