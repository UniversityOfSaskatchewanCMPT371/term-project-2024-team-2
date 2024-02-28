import {XR, Controllers, VRButton} from '@react-three/xr'
import {Sky} from '@react-three/drei'
import '@react-three/fiber'
import './styles.css'
import Axis from "./components/axis.tsx";
import { Canvas } from '@react-three/fiber'
import Floor from './components/Floor'

import { useEffect } from 'react';
import { openDB } from 'idb';
import { LocalCsvReader } from './components/LocalCsvReader.tsx';
import { UrlCsvReader } from './components/UrlCsvReader.tsx';
import DataPoint from "./components/DataPoint.tsx";
import { PointSelectionProvider } from "./contexts/PointSelectionContext.tsx";
import DataPointMenu from "./components/DataPointMenu.tsx";
import {createPosition} from "./components/Positions.tsx";


// minNum and maxNum will be from the csv file, just hardcoded for now
const minNum: number = -10;
const maxNum: number = 10;
// scaleFactor adjusts the size of the 3D axis
const scaleFactor: number = 2;
// labelOffset is the offset the axis ticks and labels will have
const labelOffset: number = 0.1;
//starting point of the axis
const startPointX: number = -.2;
const startPointY: number = 1.6;
const startPointZ: number = -.5;
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

    const exampleData= [[-1,-1,-1],[2,3,0],[4,3,0],[1,1,1],[3,2,2]]
    const datapoint1 = createPosition(exampleData[0],[startPointX,startPointY,startPointZ],Length,scaleFactor,maxNum)
    const datapoint2 = createPosition(exampleData[1],[startPointX,startPointY,startPointZ],Length,scaleFactor,maxNum)
    const datapoint3 = createPosition(exampleData[2],[startPointX,startPointY,startPointZ],Length,scaleFactor,maxNum)
    const datapoint4 = createPosition(exampleData[3],[startPointX,startPointY,startPointZ],Length,scaleFactor,maxNum)
    const datapoint5 = createPosition(exampleData[4],[startPointX,startPointY,startPointZ],Length,scaleFactor,maxNum)

    console.log(datapoint1)
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
            <button onClick={async () => {
                const db = await openDB(dbName, 1);
                const data = await db.getAll(storeName);
                console.table(data);
            }}>Print Data to Console</button>
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

            <Axis minValue={minNum} maxValue={maxNum} scaleFactor={scaleFactor} startX={startPointX}
            startY={startPointY} startZ={startPointZ} endPoint={Length} radius={radius}
            labelOffset={labelOffset}/>

            {/* Temporary display/test of the data points.
              These will eventually be created by the plot itself */}
            <DataPoint id={0} meshProps={{ position: datapoint1 } } />
            <DataPoint id={1} meshProps={{ position: datapoint2 } } />
            <DataPoint id={2} meshProps={{ position: datapoint3 } } />
            <DataPoint id={3} meshProps={{ position: datapoint4 } } />
            <DataPoint id={4} meshProps={{ position: datapoint5 } } />

              <DataPointMenu position={[0, 2.2, -0.75]} />
          </XR>
        </Canvas>
      </PointSelectionProvider>
    </>
  );
}
