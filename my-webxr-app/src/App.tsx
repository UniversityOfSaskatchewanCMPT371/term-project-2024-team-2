import { Sky } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Controllers, VRButton, XR } from '@react-three/xr';
import { openDB } from 'idb';
import { useEffect, useState } from 'react';
import { LocalCsvReader, UrlCsvReader } from './components/CsvReader';
import DataPoint from './components/DataPoint';
import DataPointMenu from './components/DataPointMenu';
import Floor from './components/Floor';
import GenerateXYZ from './components/GenerateXYZ';
import createPosition from './components/Positions';
import { PointSelectionProvider } from './contexts/PointSelectionContext';
import './styles.css';
import TestingOptions from './testing/TestingOptions';

// minNum and maxNum will be from the csv file, just hardcoded for now
const minNum: number = -10;
const maxNum: number = 20;
// scaleFactor adjusts the size of the 3D axis
const scaleFactor: number = 4;
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
  const [showData, setShowData] = useState(false);
  const [arrayData, setArrayData] = useState(Array<number>());
  const [dataNumber, setNumber] = useState(0);

  const LoadTestChange = async () => {
    const num = (document.getElementById('minNum') as HTMLInputElement).value;
    setNumber(parseInt(num, 10));
  };

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
        <br />
        <input type="number" id="minNum" name="minNum" placeholder="Min Number" onChange={LoadTestChange} />
        <button
          type="button"
          onClick={() => {
            setShowData(!showData);
            setArrayData(Array(dataNumber).fill(0).map((_, i) => i + 1));
          }}
        >
          {showData ? 'Hide Data' : 'Show Data'}
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
            {showData && arrayData.map((i) => (
              <DataPoint
                key={i}
                id={i}
                marker="circle"
                color="gray"
                columnX="John Doe"
                columnY="cmpt 145"
                columnZ={97}
                meshProps={{
                  position: createPosition({
                    data: [Math.random() * (maxNum * 2) - maxNum, Math.random() * (maxNum * 2)
                      - maxNum, Math.random() * (maxNum * 2) - maxNum],
                    AxisStartPoints: [startPointX, startPointY, startPointZ],
                    length: Length,
                    scale: scaleFactor,
                    max: maxNum,
                  }),
                }}
              />
            ))}

            <DataPointMenu position={[0, 2.2, -0.75]} />
          </XR>
        </Canvas>
      </PointSelectionProvider>
    </>
  );
}
