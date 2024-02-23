import React, { useState } from 'react';
import Papa from 'papaparse';
import { handleParsedData, validateDbAndStore } from './DependentCSVReader.tsx';
import assert from "../utils/assert.tsx";

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
 * @returns {JSX.Element} A form with a file input field for the CSV file and a success message displayed after successful
 * loading.
 */
export function LocalCsvReader({ dbName, storeName }: LocalCsvReaderProps) {
    const [showPopup, setShowPopup] = useState(false);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try{
            const file = event.target.files?.[0];
            assert(file !== undefined, 'No file selected');
            if (file){
                assert(!file || file.type == 'text/csv', 'File must be a CSV file or not empty');
                await validateDbAndStore(dbName, storeName);

                Papa.parse(file, {
                    header: true,
                    dynamicTyping: true, // Convert data to number type if applicable
                    complete: async (results) => {
                        await handleParsedData(results, dbName, storeName);
                        setShowPopup(true);
                    },
                });
            }
        } catch (e) {
            console.log(`An error occurred in LocalCsvReader: ${e}`);
        }
    };

    return (
        <div>
            <input type="file" accept=".csv" onChange={handleFileChange} />
            {showPopup && <div>Data loaded successfully</div>}
        </div>
    );
}