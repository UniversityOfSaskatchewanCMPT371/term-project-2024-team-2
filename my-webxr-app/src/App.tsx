import { XR, Controllers, VRButton } from '@react-three/xr';
import { Sky } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import './styles.css';
import { useEffect } from 'react';
import { openDB } from 'idb';

import Axis from './components/Axis';
import Floor from './components/Floor';
import RotatingBox from './components/RotatingBox';
import Button from './components/Button';
import { LocalCsvReader, UrlCsvReader } from './components/CsvReader';
import DataPoint from './components/DataPoint';
import { PointSelectionProvider } from './contexts/PointSelectionContext';
import DataPointMenu from './components/DataPointMenu';

// minNum and maxNum will be from the csv file, just hardcoded for now
const minNum: number = -10;
const maxNum: number = 10;
// scaleFactor adjusts the size of the 3D axis
const scaleFactor: number = 1;
// labelOffset is the offset the axis ticks and labels will have
const labelOffset: number = 0.1;
// starting point of the axis
const startPointX: number = 0;
const startPointY: number = 0.82;
const startPointZ: number = -0.15;
// endPoint is used to determine what axis is being calculated, should not need to change
const endPoint: number = 1;
// adjust the size of the tube, shouldn't need to change unless
const radius: number = 0.002;

export default function App() {
  // Database name and store name will be pass as prop to reader components,
  // this is to ensure the consistency of the database name and store name.
  const dbName = 'CsvDataBase';
  const storeName = 'CsvData';

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
      <VRButton />
      <PointSelectionProvider>
        <Canvas>
          <XR>
            <Sky sunPosition={[0, 1, 0]} />
            <Floor />
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <Controllers />
            <Button position={[0, 1.5, -1]} />
            <RotatingBox position={[0.8, 1.5, -1]} />
            <RotatingBox position={[-0.8, 1.5, -1]} />
            <Axis
              minValue={minNum}
              maxValue={maxNum}
              scaleFactor={scaleFactor}
              startX={startPointX}
              startY={startPointY}
              startZ={startPointZ}
              endPoint={endPoint}
              radius={radius}
              labelOffset={labelOffset}
            />

            {/* Temporary display/test of the data points.
              These will eventually be created by the plot itself */}
            <DataPoint id={0} marker="circle" color="gray" columnX="John Doe" columnY="cmpt 145" columnZ={97} meshProps={{ position: [0.25, 1.75, -0.75] }} />
            <DataPoint id={1} marker="circle" color="gray" columnX="Bob Johnson" columnY="math 110" columnZ={81} meshProps={{ position: [0, 1.75, -0.75] }} />
            <DataPoint id={2} marker="circle" color="gray" columnX="Alice Smith" columnY="stat 245" columnZ={75} meshProps={{ position: [-0.25, 1.75, -0.75] }} />
            <DataPointMenu position={[0, 2.2, -0.75]} />
          </XR>
        </Canvas>
      </PointSelectionProvider>
    </>
  );
}
