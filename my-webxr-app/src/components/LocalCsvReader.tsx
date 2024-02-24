import React, { useState } from 'react';
import Papa from 'papaparse';
import { handleParsedData, validateDbAndStore, RowData } from './DependentCsvReader.tsx';

interface LocalCsvReaderProps {
    dbName: string;
    storeName: string;
}
/**
 * A React component that reads data from a local CSV file and stores it in a specified database and store.
 *
 * @param {object} props - The properties passed to the component.
 * @param {string} props.dbName - The name of the database where the data should be stored.
 * @param {string} props.storeName - The name of the store within the database where the data should be stored.
 *
 * @returns {JSX.Element} A form with an input field for the local CSV and a button to load the CSV data.
 * After successful loading, a success message is displayed. If an input error occurs, an error message is displayed and let
 * user retry.
 */
export function LocalCsvReader({ dbName, storeName }: LocalCsvReaderProps): JSX.Element {
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setMessage(null); // Clear the message when a new file is selected
        }
    };

    const handleButtonClick = async () => {
        if (file === null) {
            setMessage('No file selected');
            return;
        }
        if (file?.type !== 'text/csv') {
            setMessage('File must be a CSV file');
            return;
        }
        try {
            await validateDbAndStore(dbName, storeName);
            Papa.parse(file as File, {
                header: true,
                dynamicTyping: true, // Convert data to number type if applicable
                complete: async (results) => {
                    await handleParsedData(results as Papa.ParseResult<RowData>, dbName, storeName);
                    setMessage('Local CSV loaded successfully');
                },
            });
        } catch (e) {
            console.log(`An error occurred in LocalCsvReader: ${e}`);
            setMessage(`An error occurred: ${e}`);
            return;
        }
    };

    return (
        <div>
            <input type="file" accept=".csv" onChange={handleFileChange} />
            <button onClick={handleButtonClick}>Load Local CSV</button>
            {message && <div>{message}</div>}
        </div>
    );
}