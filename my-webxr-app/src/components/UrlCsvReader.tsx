import React, { useState } from 'react';
import Papa from 'papaparse';
import { handleParsedData, validateDbAndStore, RowData } from './DependentCsvReader.tsx';

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
 * loading, a success message is displayed. If an input error occurs, an error message is displayed and let
 * user retry.
 */
export function UrlCsvReader({ dbName, storeName }: UrlCsvReaderProps): JSX.Element {
    const [message, setMessage] = useState<string | null>(null);
    const [url, setUrl] = useState(''); 

    const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUrl(event.target.value); 
    };

    const handleButtonClick = async () => {
        if (!url.endsWith('.csv')) {
            setMessage('URL must point to a CSV file or not empty');
            return;
        }
        try{
            await validateDbAndStore(dbName, storeName);

            Papa.parse(url, {
                download: true,
                header: true,
                dynamicTyping: true, // Convert data to number type if applicable
                complete: async (results) => {
                    await handleParsedData(results as Papa.ParseResult<RowData>, dbName, storeName);
                    setMessage('Url CSV loaded successfully');
                },
            });
        } catch (e) {
            console.log(`An error occurred in UrlCsvReader: ${e}`);
            setMessage(`An error occurred: ${e}`);
            return;
        }
    };

    return (
        <div>
            <input type="text" placeholder="Enter CSV URL" onChange={handleUrlChange} />
            <button onClick={handleButtonClick}>Load Url CSV</button>
            {message && <div>{message}</div>}
        </div>
    );
}