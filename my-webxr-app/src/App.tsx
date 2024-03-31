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

// const batch: Array<Array<number | string>> = [
//   ['x', 'y', 'z'],
//   [0, 0, 0],
//   [1, 1, 1],
//   [2, 2, 2],
//   [3, 3, 3],
//   [4, 4, 4],
//   [5, 5, 5],
//   [6, 6, 6],
//   [7, 7, 7],
//   [8, 8, 8],
//   [9, 9, 9],
//   [10, 10, 10],
// ];
const maxValues: Array<number> = [10, 10, 10];
// labelOffset is the offset the axis ticks and labels will have
const labelOffset: number = 1;
// starting point of the axes
const startPointX: number = 0;
const startPointY: number = 1.5;
const startPointZ: number = -1.5;
const radius: number = 0.002;

Dexie.delete('CsvDataBase');
const DAL = getDatabase() as DataAbstractor;
// await DAL.storeCSV(batch);
// await DAL.calculateStatistics();
// await DAL.storeStandardizedData();
// await DAL.storePCA(await DAL.getAvailableFields());

export default function App() {
  // scaleFactor adjusts the size of the 3D axis
  const [scaleFactor, setScaleFactor] = useState(2);

  return (
    <Provider config={rollbarConfig}>
      <AxesSelectionProvider>
        <div>
          {import.meta.env.VITE_IS_TESTING === 'true' && <TestingOptions />}
          {/* Sample URL box and button */}
          <UrlCsvReader DAL={DAL} />
          <LocalCsvReader DAL={DAL} />
          <SelectAxesColumns database={DAL} />
        </div>
        <ScaleSlider scale={scaleFactor} setScale={setScaleFactor} />
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
                maxValues={maxValues}
                scaleFactor={scaleFactor}
                labelOffset={labelOffset}
                startX={startPointX}
                startY={startPointY}
                startZ={startPointZ}
                radius={radius}
              />
              <CreateGraphingDataPoints
                scaleFactor={scaleFactor}
                startX={startPointX}
                startY={startPointY}
                startZ={startPointZ}
              />
              <GraphingDataPointMenu position={[0, 2.2, -1.6]} />
            </XR>
          </Canvas>
        </PointSelectionProvider>
      </AxesSelectionProvider>
    </Provider>
  );
}
