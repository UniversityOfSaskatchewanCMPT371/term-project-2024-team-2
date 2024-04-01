import { Sky } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Controllers, VRButton, XR } from '@react-three/xr';
import { Provider } from '@rollbar/react';
import Dexie from 'dexie';
import { useState } from 'react';
import LocalCsvReader, { UrlCsvReader } from './components/CsvReader';
import Floor from './components/Floor';
import ScaleSlider from './components/ScaleSlider';
import GraphingDataPointMenu from './components/GraphingDataPointMenu';
import { PointSelectionProvider } from './contexts/PointSelectionContext';
import './styles.css';
import TestingOptions from './smoketest/TestingOptions';
import { rollbarConfig } from './utils/LoggingUtils';
import DataAbstractor, { getDatabase } from './data/DataAbstractor';
import SelectAxesColumns from './components/SelectAxesMenu';
import { AxesSelectionProvider } from './contexts/AxesSelectionContext';
import CreateGraphingDataPoints from './components/CreateGraphingDataPoints';
import GenerateXYZ from './components/GenerateXYZ';

// labelOffset is the offset the axis ticks and labels will have
const labelOffset: number = 1;
// starting point of the axes
const startPointX: number = 0;
const startPointY: number = 1.5;
const startPointZ: number = -1.5;
const radius: number = 0.002;

Dexie.delete('CsvDataBase');
const DAL = getDatabase() as DataAbstractor;

export default function App() {
  // scaleFactor adjusts the size of the 3D axis
  const [scaleFactor, setScaleFactor] = useState(2);

  // a trigger when new file is uploaded
  const [reload, setReload] = useState(false);

  return (
    <Provider config={rollbarConfig}>
      <AxesSelectionProvider>
        <div>
          {import.meta.env.VITE_IS_TESTING === 'true' && <TestingOptions />}
          {/* Sample URL box and button */}
          <UrlCsvReader DAL={DAL} reload={reload} triggerReload={setReload} />
          <LocalCsvReader DAL={DAL} reload={reload} triggerReload={setReload} />
          <SelectAxesColumns reload={reload} database={DAL} />
          <ScaleSlider scale={scaleFactor} setScale={setScaleFactor} />
        </div>
        <VRButton />
        <PointSelectionProvider>
          <Canvas>
            <XR>
              <Sky sunPosition={[0.5, 0, 0.5]} />
              <Floor />
              <ambientLight />
              <pointLight position={[10, 10, 10]} />
              <Controllers />
              <GenerateXYZ
                scaleFactor={scaleFactor}
                labelOffset={labelOffset}
                startX={startPointX}
                startY={startPointY}
                startZ={startPointZ}
                radius={radius}
                database={DAL}
              />
              <CreateGraphingDataPoints
                scaleFactor={scaleFactor}
                startX={startPointX}
                startY={startPointY}
                startZ={startPointZ}
                database={DAL}
              />
              <GraphingDataPointMenu position={[0, 2.2, -1.6]} />
            </XR>
          </Canvas>
        </PointSelectionProvider>
      </AxesSelectionProvider>
    </Provider>
  );
}
