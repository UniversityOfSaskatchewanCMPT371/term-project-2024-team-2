import React, { useState } from 'react';
import Papa from 'papaparse';
import { openDB } from 'idb';

interface UrlCsvReaderProps {
    dbName: string;
    storeName: string;
}

/**
 * UrlCsvReader is a React component that provides an input field and a button for the user to enter a URL to a CSV file.
 * When the button is clicked, it uses the Papa Parse library to download and parse the CSV file.
 * The parsed data is then stored in an IndexedDB database.
 *
 * Props:
 * - dbName: The name of the IndexedDB database where the parsed data will be stored.
 * - storeName: The name of the object store within the database where the parsed data will be stored.
 *
 * The component throws an error if:
 * - The URL does not point to a CSV file, this cover the empty case.
 * - The specified database does not exist.
 * - The specified store does not exist in the database.
 * - The parsed data is not an array.
 *
 * The component also provides a feedback popup that is displayed when the CSV data is successfully read and stored.
 */
export function UrlCsvReader({ dbName, storeName }: UrlCsvReaderProps) {
    // A feedback pop up to check if csv read in is sucesefully
    const [showPopup, setShowPopup] = useState(false);
    
    const [url, setUrl] = useState(''); 
    const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUrl(event.target.value); 
    };

    const handleButtonClick = async () => {
        // Check if the URL ends with '.csv'
        if (!url.endsWith('.csv')) {
            throw new Error('URL must point to a CSV file');
        }

        // Assert that the database is intialized
        const db = await openDB(dbName, 1);
        const dbExists = db !== undefined;
        if (!dbExists) {
            throw new Error(`Database "${dbName}" does not exist`);
        }

        // Assert that the store exists in the database
        const storeExists = db.objectStoreNames.contains(storeName);
        if (!storeExists) {
            throw new Error(`Store "${storeName}" does not exist in database "${dbName}"`);
        }

        // Parsing the csv data
        Papa.parse(url, {
            download: true,
            header: true,
            dynamicTyping: true, // Auto convert values to numbers if possible
            complete: async (results) => {

                // Assert that the parsed data is an array, parsing was successful
                if (!Array.isArray(results.data)) {
                    throw new Error('Parsed data must be an array');
                }

                // Put the parsed data into the database store, overwriting.
                const db = await openDB(dbName, 1);
                const tx = db.transaction(storeName, 'readwrite');
                const store = tx.objectStore(storeName);
                await store.clear(); // Empty the store before writing new data
                for (let i = 0; i < results.data.length; i++) {
                    const item = results.data[i];
                    await store.put(item, i);
                }
                await tx.done;

                // Show the feedback popup
                setShowPopup(true);
            },
        });
    };

    return (
        <div>
            <input type="text" placeholder="Enter CSV URL" onChange={handleUrlChange} />
            <button onClick={handleButtonClick}>Load CSV</button>
            {showPopup && <div>Read in successfully</div>}
        </div>
    );
}