import { XR, Controllers, VRButton } from '@react-three/xr'
import { Sky } from '@react-three/drei'
import '@react-three/fiber'
import './styles.css'
import { Canvas } from '@react-three/fiber'
import Floor from './components/Floor'
import RotatingBox from './components/RotatingBox'
import Button from './components/Button'
import { useEffect } from 'react';
import { openDB } from 'idb';
import { UrlCsvReader } from './components/UrlCsvReader.tsx';



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
            <button onClick={async () => {
                const db = await openDB(dbName, 1);
                const data = await db.getAll(storeName);
                console.table(data);
            }}>Print Data to Console</button>
        </div>
      <VRButton />
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

        </XR>
      </Canvas>
    </>
  )
}
