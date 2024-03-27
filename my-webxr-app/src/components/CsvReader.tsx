import React, { useState } from 'react';
import {
  validateDbAndStore, handleParsedData, parseAndHandleUrlCsv,
} from '../utils/CsvUtils';
import assert from '../utils/Assert';
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
 * @Precondition: dbName and storeName are valid
 * @PostCondition: there will be a new table inside IndexedDB after this function is finished.
 *
 * @returns {JSX.Element} A form with an input field for the local CSV and a button to load the CSV
 * data. After successful loading, a success message is displayed. If an error occurs, an error
 * message is displayed and let user retry.
 */
export function LocalCsvReader({ dbName, storeName }: CsvReaderProps): JSX.Element {
  const [message, setMessage] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    assert(selectedFile!==undefined || selectedFile!==null, 'Error in LocalCsvReader.tsx: selectedFile is undefined')
    assert(dbName!==undefined || dbName!==null, 'Error in LocalCsvReader.tsx: dbName is undefined')
    assert(storeName!==undefined || storeName!==null, 'Error in LocalCsvReader.tsx: storeName is undefined')


    let batch: Array<Array<string | number | null>> = [];
    const reader = selectedFile?.stream().getReader();
    const decoder = new TextDecoder('utf-8');
    const BATCHSIZE = 500;
    let counter = 0;

    const readStream = async () => {
      await validateDbAndStore(dbName, storeName);

      try {
        let chunk = await reader?.read();
        while (!chunk?.done) {
          const textChunk = decoder.decode(chunk?.value, { stream: true });
          const lines = textChunk.split('\n');
          lines.forEach((line) => {
            batch.push(line.split(','));
            counter += 1;
          });
          chunk = await reader?.read();
        }
          if (batch.length >= BATCHSIZE) {
            handleParsedData(batch, dbName, storeName, counter);
            batch = [];
          }
        // Handles the final batch or whatever information is left in the file
        decoder.decode();
        if (batch.length > 0) {
          // console.log('Final BATCH\n:');
          // console.log(storeName);
          handleParsedData(batch, dbName, storeName, counter);
        }
      } catch (e) {
        console.error(`An error occurred: ${e}`);
      }
    };
    (async () => {
      await readStream();
    })();
    setMessage('File loaded successfully');
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      {/* <button type="button" onClick={handleButtonClick}>Load Local CSV</button> */}
      {message && <div>{message}</div>}
    </div>
  );
  }

export function addBatch(columnNames: string[], dataRows: Array<Array<string | number | null>>) {
  const dataMap = new Map<string, Array<string | number | null>>();

  // transpose the data column wise
  columnNames.forEach((name, i) => {
    dataMap.set(name, []);

    dataRows.forEach((row) => {
      dataMap.get(name)?.push(row[i]);
    });
  });
  console.log(dataMap);
  // dataMap.forEach((value: Array<string | number | null>, key: string) => {
  //   this.columns.get(key).then((old_col) => {
  //     old_col?.values.
  //   });

  // });
  return true;
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
