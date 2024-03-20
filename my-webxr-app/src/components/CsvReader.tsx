import React, { useState } from 'react';
import WriteHook from '../testing/TestHookWrite';
import { parseAndHandleLocalCsv, parseAndHandleUrlCsv, validateDbAndStore } from '../utils/CsvUtils';

interface CsvReaderProps {
  dbName: string;
  storeName: string;
}

/**
 * A React component that reads data from a local CSV file and stores it in a specified database and
 * store.
 *
 * @param {object} props - The properties passed to the component.
 * @param {string} props.dbName - The name of the database where the data should be stored.
 * @param {string} props.storeName - The name of the store within the database where the data should
 * be stored.
 *
 * @returns {JSX.Element} A form with an input field for the local CSV and a button to load the CSV
 * data. After successful loading, a success message is displayed. If an error occurs, an error
 * message is displayed and let user retry.
 */
export function LocalCsvReader({ dbName, storeName }: CsvReaderProps): JSX.Element {
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
    WriteHook('Triggered CSV button');

    if (file === null) {
      setMessage('No file selected');
      WriteHook('Triggered no file selected');
      return;
    }
    if (file?.type !== 'text/csv') {
      setMessage('File must be a CSV file');
      WriteHook('Triggered must be a CSV file');

      return;
    }
    try {
      await validateDbAndStore(dbName, storeName);
      await parseAndHandleLocalCsv(file, dbName, storeName, setMessage);
    } catch (e) {
      setMessage(`An error occurred: ${e}`);
    }
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button type="button" onClick={handleButtonClick}>Load Local CSV</button>
      {message && <div>{message}</div>}
    </div>
  );
}

/**
 * A React component that reads data from a CSV file at a given URL and stores it in a specified
 * database and store.
 *
 * @param {object} props - The properties passed to the component.
 * @param {string} props.dbName - The name of the database where the data should be stored.
 * @param {string} props.storeName - The name of the store within the database where the data should
 * be stored.
 *
 * @returns {JSX.Element} A form with an input field for the CSV URL and a button to load the CSV
 * data. After successful loading, a success message is displayed. If an error occurs, an error
 * message is displayed and let user retry.
 */
export function UrlCsvReader({ dbName, storeName }: CsvReaderProps): JSX.Element {
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
    try {
      await validateDbAndStore(dbName, storeName);
      await parseAndHandleUrlCsv(url, dbName, storeName, setMessage);
    } catch (e) {
      setMessage(`An error occurred: ${e}`);
    }
  };

  return (
    <div>
      <input type="text" placeholder="Enter CSV URL" onChange={handleUrlChange} />
      <button type="button" onClick={handleButtonClick}>Load Url CSV</button>
      {message && <div>{message}</div>}
    </div>
  );
}
