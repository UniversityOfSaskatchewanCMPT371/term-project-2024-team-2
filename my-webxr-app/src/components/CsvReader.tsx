import React, { useState } from 'react';
import Papa from 'papaparse';
import DataAbstractor from '../data/DataAbstractor';
import parseAndHandleUrlCsv from '../utils/CsvUtils';
import assert from '../utils/Assert';

interface CsvReaderProps {
  DAL: DataAbstractor;
}

/**

 * A React component that reads data from a local CSV file and stores it in a specified database and
 * store.
 * @pre-condition None
 * @post-condition Returns an element to expose local csv uploading
 * @param {object} props - The properties passed to the component.
 * @param {string} props.dbName - The name of the database where the data should be stored.
 * @param {string} props.storeName - The name of the store within the database where the data should
 * be stored.
 *
 * @returns {JSX.Element} A form with an input field for the local CSV and a button to load the CSV
 * data. After successful loading, a success message is displayed. If an error occurs, an error
 * message is displayed and let user retry.
 */

export function LocalCsvReader({ DAL }: CsvReaderProps): JSX.Element {
  const [message, setMessage] = useState<string | null>(null);

  assert(DAL !== null || DAL !== undefined, 'Data Abstractor is not initialized');
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] as File;

    assert(selectedFile !== null || selectedFile !== undefined, 'No file selected');

    const completeData: Array<Array<string | number>> = [];
    const normalizeHeaders = (headers: string[]) => {
      const count: Record<string, number> = {};
      return headers.map((header) => {
        count[header] = (count[header] || 0) + 1;
        return count[header] > 1 ? `${header}${count[header]}` : header;
      });
    };
    const readStream = async () => {
      Papa.parse(selectedFile, {
        dynamicTyping: true, // Convert data to number type if applicable
        step: async (results) => {
          completeData.push(results.data as (string | number)[]);
        },
        complete: async () => {
          let knownLength = 0;
          for (let i = 0; i < completeData.length; i += 1000) {
            const batch = completeData.slice(i, i + 1000);
            if (i === 0) {
              // Normalize (fix duplicate) headers in the first batch
              const headers = batch[0] as string[];
              batch[0] = normalizeHeaders(headers);
              knownLength = headers.length;
            }
            const sanitizedBatch: Array<Array<string | number>> = [];

            // eslint-disable-next-line @typescript-eslint/no-loop-func
            batch.forEach((row) => {
              const testbatch = Array<string | number>();

              row.forEach((item) => {
                if (typeof item === 'string') {
                  testbatch.push(item);
                } else if (typeof item === 'number') {
                  testbatch.push(item);
                }
              });
              if (testbatch.length === knownLength) {
                sanitizedBatch.push(testbatch);
              }
            });
            // eslint-disable-next-line no-await-in-loop
            await DAL.storeCSV(sanitizedBatch);
          }
          setMessage('Local CSV loaded successfully');
        },
      });
    };
    (async () => {
      await readStream();
    })();
    setMessage('File loaded successfully');
  };

  return (
    <div>
      <input type="file" accept=".csv,.txt" onChange={handleFileChange} />
      {/* <button type="button" onClick={handleButtonClick}>Load Local CSV</button> */}
      {message && <div>{message}</div>}
    </div>
  );
}

/**

 * A React component that reads data from a CSV file at a given URL and stores it in a specified
 * database and store.
 * @pre-condition None
 * @post-condition Returns an element to expose url csv uploading
 * @param {object} props - The properties passed to the component.
 * @param {string} props.dbName - The name of the database where the data should be stored.
 * @param {string} props.storeName - The name of the store within the database where the data should
 * be stored.
 *
 * @returns {JSX.Element} A form with an input field for the CSV URL and a button to load the CSV
 * data. After successful loading, a success message is displayed. If an error occurs, an error
 * message is displayed and let user retry.
 */
function UrlCsvReader({ DAL }: CsvReaderProps): JSX.Element {
  const [message, setMessage] = useState<string | null>(null);
  const [url, setUrl] = useState('');

  assert(DAL !== null || DAL !== undefined, 'Data Abstractor is not initialized');
  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  const handleButtonClick = async () => {
    if (!url.endsWith('.csv' || !url.endsWith('.txt'))) {
      setMessage('URL must point to a CSV file or not empty : ');
      return;
    }
    try {
      await parseAndHandleUrlCsv(url, DAL, setMessage);
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
export default UrlCsvReader;
