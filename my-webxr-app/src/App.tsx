import { Sky } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Controllers, VRButton, XR } from '@react-three/xr';
import { openDB } from 'idb';
import { useEffect } from 'react';
import { LocalCsvReader, UrlCsvReader } from './components/CsvReader';
import GraphingDataPoint from './components/GraphingDataPoint';
import GraphingDataPointMenu from './components/GraphingDataPointMenu';
import Floor from './components/Floor';
import GenerateXYZ from './components/GenerateXYZ';
import createPosition from './components/Positions';
import { PointSelectionProvider } from './contexts/PointSelectionContext';
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
const startPointX: number = -0.2;
const startPointY: number = 1.6;
const startPointZ: number = -0.5;
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

  // hard coded data. example data would be replaced with PCA results for coordinates
  // also would like to make a new type for GenerateXYZ info, allowing for easier use
  const exampleData = [[-1, -1, -1], [2, 3, 0], [4, 3, 0], [1, 1, 1], [3, 2, 2]];
  const datapoint1 = createPosition({
    data: exampleData[0],
    AxisStartPoints: [startPointX, startPointY, startPointZ],
    length: Length,
    scale: scaleFactor,
    max: maxNum,
  });
  const datapoint2 = createPosition({
    data: exampleData[1],
    AxisStartPoints: [startPointX, startPointY, startPointZ],
    length: Length,
    scale: scaleFactor,
    max: maxNum,
  });
  const datapoint3 = createPosition({
    data: exampleData[2],
    AxisStartPoints: [startPointX, startPointY, startPointZ],
    length: Length,
    scale: scaleFactor,
    max: maxNum,
  });
  const datapoint4 = createPosition({
    data: exampleData[3],
    AxisStartPoints: [startPointX, startPointY, startPointZ],
    length: Length,
    scale: scaleFactor,
    max: maxNum,
  });
  const datapoint5 = createPosition({
    data: exampleData[4],
    AxisStartPoints: [startPointX, startPointY, startPointZ],
    length: Length,
    scale: scaleFactor,
    max: maxNum,
  });

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

            {/* Temporary display/test of the data points.
              These will eventually be created by the plot itself */}
            <GraphingDataPoint
              id={0}
              marker="circle"
              color="gray"
              columnX="John Doe"
              columnY="cmpt 145"
              columnZ={97}
              meshProps={{ position: datapoint1 }}
            />
            <GraphingDataPoint
              id={1}
              marker="circle"
              color="gray"
              columnX="Bob Johnson"
              columnY="math 110"
              columnZ={81}
              meshProps={{ position: datapoint2 }}
            />
            <GraphingDataPoint
              id={2}
              marker="circle"
              color="gray"
              columnX="Bob John"
              columnY="math 116"
              columnZ={87}
              meshProps={{ position: datapoint3 }}
            />
            <GraphingDataPoint
              id={3}
              marker="circle"
              color="gray"
              columnX="Alice Smith"
              columnY="stat 245"
              columnZ={75}
              meshProps={{ position: datapoint4 }}
            />
            <GraphingDataPoint
              id={4}
              marker="circle"
              color="gray"
              columnX="Bob Smith"
              columnY="math 115"
              columnZ={85}
              meshProps={{ position: datapoint5 }}
            />

            <GraphingDataPointMenu position={[0, 2.2, -0.75]} />
          </XR>
        </Canvas>
      </PointSelectionProvider>
    </>
  );
}
