import { Sky } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Controllers, VRButton, XR } from '@react-three/xr';
import { openDB } from 'idb';
import { useEffect } from 'react';
import { LocalCsvReader, UrlCsvReader } from './components/CsvReader';
import GraphingDataPointMenu from './components/GraphingDataPointMenu';
import Floor from './components/Floor';
import GenerateXYZ from './components/GenerateXYZ';
import SelectAxesColumns from './components/SelectAxesMenu';
import { PointSelectionProvider } from './contexts/PointSelectionContext';
import './styles.css';
import TestingOptions from './testing/TestingOptions';
import {
  createGraphingDataPoints,
} from './components/CreateGraphingDataPoints';
import DataPoint from './repository/DataPoint';
import { getDatabase } from './data/DataAbstractor';

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

  const database = getDatabase();

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
        {import.meta.env.VITE_IS_TESTING && <TestingOptions />}
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
        <SelectAxesColumns database={database} />
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

            <GraphingDataPointMenu position={[0, 2.2, -0.75]} />
          </XR>
        </Canvas>
      </PointSelectionProvider>
    </>
  );
}
