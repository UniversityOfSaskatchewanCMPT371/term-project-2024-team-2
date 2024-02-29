import React, { useState } from 'react';
import Papa from 'papaparse';
import { openDB } from 'idb';

/**
 * Validates a File object to ensure it is a CSV file.
 *
 * @param {File} file - The File object to validate.
 * @throws {Error} Will throw an error if the File object is not a CSV file or is undefined.
 */
export const validateFile = (file: File) => {
  if (!file || file.type !== 'text/csv') {
    throw new Error('File must be a CSV file or not empty');
  }
};

/**
 * Validates the existence of a database and a store within that database.
 *
 * @param {string} dbName - The name of the database to validate.
 * @param {string} storeName - The name of the store to validate.
 * @throws {Error} Will throw an error if the database does not exist, or if the store does not
 * exist within the database.
 */
export const validateDbAndStore = async (dbName: string, storeName: string) => {
  const db = await openDB(dbName, 1);
  const dbExists = db !== undefined;
  if (!dbExists) {
    throw new Error(`Database "${dbName}" does not exist`);
  }

  const storeExists = db.objectStoreNames.contains(storeName);
  if (!storeExists) {
    throw new Error(`Store "${storeName}" does not exist in database "${dbName}"`);
  }
};

/**
 * Handles the parsed data from a CSV file and stores it in a database.
 *
 * @param {any} results - The results object returned by Papa.parse. The object data should be an
 * array.
 * @param {string} dbName - The name of the database where the data should be stored.
 * @param {string} storeName - The name of the store within the database where the data should be
 * stored.
 * @throws {Error} Will throw an error if the 'data' property of the results object is not an array.
 */
export const handleParsedData = async (
  results: Papa.ParseResult<unknown>,
  dbName: string,
  storeName: string,
) => {
  if (!Array.isArray(results.data)) {
    throw new Error('Parsed data must be an array');
  }

  const db = await openDB(dbName, 1);
  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);
  await store.clear();

  // Concurrently process each Database push
  const operations = [];
  for (let i = 0; i < results.data.length; i += 1) {
    const item = results.data[i];
    operations.push(store.put(item, i));
  }
  await Promise.all(operations);
  await tx.done;
};

interface LocalCsvReaderProps {
  dbName: string;
  storeName: string;
}
/**
 * A React component that reads data from a local CSV file and stores it in a specified database
 * and store.
 *
 * @param {object} props - The properties passed to the component.
 * @param {string} props.dbName - The name of the database where the data should be stored.
 * @param {string} props.storeName - The name of the store within the database where the data
 * should be stored.
 *
 * @returns {JSX.Element} A form with a file input field for the CSV file and a success message
 * displayed after successful loading.
 */
export function LocalCsvReader({ dbName, storeName }: LocalCsvReaderProps) {
  const [showPopup, setShowPopup] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    // Check if a file has been selected
    if (!file) {
      // TODO: Replace this console.log with a functional log/output/display to user.
      // eslint-disable-next-line no-console
      console.log('No file selected');
      return;
    }

    validateFile(file);
    await validateDbAndStore(dbName, storeName);

    Papa.parse(file, {
      header: true,
      dynamicTyping: true, // Convert data to number type if applicable
      complete: async (results) => {
        await handleParsedData(results, dbName, storeName);
        setShowPopup(true);
      },
    });
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      {showPopup && <div>Data loaded successfully</div>}
    </div>
  );
}
