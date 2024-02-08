import { XR, Controllers, VRButton } from '@react-three/xr'
import { Sky } from '@react-three/drei'
import '@react-three/fiber'
import './styles.css'
import { Canvas } from '@react-three/fiber'

import Floor from "./components/Floor";
import DataPoint from "./components/DataPoint.tsx";
import { PointSelectionProvider } from "./contexts/PointSelectionContext.tsx";
import DataPointMenu from "./components/DataPointMenu.tsx";

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

            {/* Temporary display/test of the data points.
            These will eventually be created by the plot itself */}
            <DataPoint id={0} meshProps={{ position: [0.25, 1.75, -0.75] }} />
            <DataPoint id={1} meshProps={{ position: [0, 1.75, -0.75] }} />
            <DataPoint id={2} meshProps={{ position: [-0.25, 1.75, -0.75] }} />
            <DataPointMenu position={[0, 2.2, -0.75]} />
          </XR>
        </Canvas>
      </PointSelectionProvider>
    </>
  );
}
