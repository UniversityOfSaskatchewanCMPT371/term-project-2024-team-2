import React, { useState } from 'react';
import Papa from 'papaparse';
import { handleParsedData, validateDbAndStore } from './DependentCSVReader.tsx';
import assert from "../utils/assert.tsx";

interface UrlCsvReaderProps {
    dbName: string;
    storeName: string;
}

/**
 * A React component that reads data from a CSV file at a given URL and stores it in a specified database and store.
 *
 * @param {object} props - The properties passed to the component.
 * @param {string} props.dbName - The name of the database where the data should be stored.
 * @param {string} props.storeName - The name of the store within the database where the data should be stored.
 *
 * @returns {JSX.Element} A form with an input field for the CSV URL and a button to load the CSV data. After successful
 * loading, a success message is displayed.
 */
export function UrlCsvReader({ dbName, storeName }: UrlCsvReaderProps) {
    const [showPopup, setShowPopup] = useState(false);
    const [url, setUrl] = useState(''); 

    const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUrl(event.target.value); 
    };

    const handleButtonClick = async () => {
        try{
            assert(url.endsWith('.csv'), 'URL must point to a CSV file or not empty');
            await validateDbAndStore(dbName, storeName);

            Papa.parse(url, {
                download: true,
                header: true,
                dynamicTyping: true, // Convert data to number type if applicable
                complete: async (results) => {
                    await handleParsedData(results, dbName, storeName);
                    setShowPopup(true);
                },
            });
        } catch (e) {
            console.log(`An error occurred in UrlCsvReader: ${e}`);
        }
    };

    return (
        <div>
            <input type="text" placeholder="Enter CSV URL" onChange={handleUrlChange} />
            <button onClick={handleButtonClick}>Load CSV</button>
            {showPopup && <div>Read in successfully</div>}
        </div>
    );
}