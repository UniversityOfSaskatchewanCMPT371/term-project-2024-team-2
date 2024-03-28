import { Sky } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Controllers, VRButton, XR } from '@react-three/xr';
import { openDB } from 'idb';
import { useEffect } from 'react';
import {
  createGraphingDataPoints,
} from './components/CreateGraphingDataPoints';
import { LocalCsvReader, UrlCsvReader } from './components/CsvReader';
import Floor from './components/Floor';
import GenerateXYZ from './components/GenerateXYZ';
import GraphingDataPointMenu from './components/GraphingDataPointMenu';
import { PointSelectionProvider } from './contexts/PointSelectionContext';
import DataPoint from './repository/DataPoint';
import './styles.css';
import TestingOptions from './testing/TestingOptions';

// minNum and maxNum will be from the csv file, just hardcoded for now
const minNum: number = -10;
const maxNum: number = 10;
// scaleFactor adjusts the size of the 3D axis
const scaleFactor: number = 2;
// labelOffset is the offset the axis ticks and labels will have
const labelOffset: number = 0.1;
// starting point of the axis
const startPointX: number = 0;
const startPointY: number = 1.5;
const startPointZ: number = -1.5;
// const startPointY: number = 0;
// const startPointZ: number = 0;
// endPoint is used to determine what axis is being calculated, should not need to change
const Length: number = 1;
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

  // Demo createGraphingDataPoints
  const exampleDataPoints = [
    [5, 5, 5],
    [-5, 5, 5],
    [5, -5, 5],
    [-5, -5, 5],
    [5, 5, -5],
    [-5, 5, -5],
    [5, -5, -5],
    [-5, -5, -5],
    [0, 5, 5],
    [0, -5, 5],
    [0, 5, -5],
    [0, -5, -5],
    [5, 0, 5],
    [-5, 0, 5],
    [5, 0, -5],
    [-5, 0, -5],
    [5, 5, 0],
    [-5, 5, 0],
    [5, -5, 0],
    [-5, -5, 0],
  ];
  const dataPoints = exampleDataPoints.map((point) => new DataPoint(point[0], point[1], point[2]));
  const plottedDataPoints = dataPoints.length > 0 ? createGraphingDataPoints(
    dataPoints,
    'columnX',
    'columnY',
    'columnZ',
    [startPointX, startPointY, startPointZ],
    Length,
    scaleFactor,
    maxNum,
  ) : [];
  return (
    <>
      <div>
        {/* Sample URL box and button */}
        {import.meta.env.VITE_IS_TESTING === 'true' && <TestingOptions />}
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
            <Sky sunPosition={[0.5, 0, 0.5]} />
            <Floor />
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <Controllers />
            {/** return from createGraphingDataPoints */}
            {plottedDataPoints}
            <GenerateXYZ
              minValue={minNum}
              maxValue={maxNum}
              scaleFactor={scaleFactor}
              startX={startPointX}
              startY={startPointY}
              startZ={startPointZ}
              endPoint={Length}
              radius={radius}
              labelOffset={labelOffset}
            />

            <GraphingDataPointMenu position={[0, 2.2, -1.5]} />
          </XR>
        </Canvas>
      </PointSelectionProvider>
    </>
  );
}
