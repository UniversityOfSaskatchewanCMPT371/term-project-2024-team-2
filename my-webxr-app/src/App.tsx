import { Sky } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Controllers, VRButton, XR } from '@react-three/xr';
import { openDB } from 'idb';
import { Provider } from '@rollbar/react';
import { useEffect, useState } from 'react';
import { LocalCsvReader, UrlCsvReader } from './components/CsvReader';
import Floor from './components/Floor';
import ScaleSlider from './components/ScaleSlider';
import GenerateXYZ from './components/GenerateXYZ';
import GraphingDataPointMenu from './components/GraphingDataPointMenu';
import { PointSelectionProvider } from './contexts/PointSelectionContext';
import './styles.css';
import TestingOptions from './smoketest/TestingOptions';
import { rollbarConfig } from './utils/LoggingUtils';

// minNum and maxNum will be from the csv file, just hardcoded for now
const maxNum: Array<number> = [10, 100, 1000];
// labelOffset is the offset the axis ticks and labels will have
const labelOffset: number = 1;
// starting point of the axis
const startPointX: number = 0;
const startPointY: number = 1.5;
const startPointZ: number = -1.5;
// const startPointY: number = 0;
// const startPointZ: number = 0;
// endPoint is used to determine what axis is being calculated, should not need to change
// adjust the size of the tube, shouldn't need to change unless
const radius: number = 0.002;

export default function App() {
  // Database name and store name will be pass as prop to reader components,
  // this is to ensure the consistency of the database name and store name.
  const dbName = 'CsvDataBase';
  const storeName = 'CsvData';

  // scaleFactor adjusts the size of the 3D axis
  const [scaleFactor, setScaleFactor] = useState(2);

  // Initialize the database and store for csv data
  useEffect(() => {
    const initializeDB = async () => {
      await openDB(dbName, 1, {
        upgrade(db) {
          if (db.objectStoreNames.contains(storeName)) {
            db.deleteObjectStore(storeName);
          }
          db.createObjectStore(storeName);
        },
      });
    };
    initializeDB();
  }, [dbName, storeName]);
  return (
    <>
      <div>
        {import.meta.env.VITE_IS_TESTING === 'true' && <TestingOptions />}
        {/* Sample URL box and button */}
        <UrlCsvReader dbName={dbName} storeName={storeName} />
        <LocalCsvReader dbName={dbName} storeName={storeName} />
        <button
          type="button"
          onClick={async () => {
            const db = await openDB(dbName, 1);
            const data = await db.getAll(storeName);
            /* eslint-disable-next-line no-console */
            console.table(data);
          }}
        >
          Print Data to Console
        </button>
      </div>
      <ScaleSlider scale={scaleFactor} setScale={setScaleFactor} />
      <VRButton />
      <Provider config={rollbarConfig}>
        <PointSelectionProvider>
          <Canvas>
            <XR>
              <Sky sunPosition={[0.5, 0, 0.5]} />
              <Floor />
              <ambientLight />
              <pointLight position={[10, 10, 10]} />
              <Controllers />
              <GenerateXYZ
                maxValues={maxNum}
                scaleFactor={scaleFactor}
                startX={startPointX}
                startY={startPointY}
                startZ={startPointZ}
                radius={radius}
                labelOffset={labelOffset}
              />
              <GraphingDataPointMenu position={[0, 2.2, -1.6]} />
            </XR>
          </Canvas>
        </PointSelectionProvider>
      </Provider>
    </>
  );
}
