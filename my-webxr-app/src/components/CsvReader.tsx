import React, { useState } from 'react';
import Papa from 'papaparse';
import DataAbstractor from '../data/DataAbstractor';
import parseAndHandleUrlCsv from '../utils/CsvUtils';

interface CsvReaderProps {
  DAL: DataAbstractor;
}

export function LocalCsvReader({ DAL }: CsvReaderProps): JSX.Element {
  const [message, setMessage] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] as File;

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
 * `UrlCsvReader` is a React component that provides a user interface for loading CSV data from a
 * URL.
 * It takes a `DataAbstractor` instance as a prop, which is used to store the parsed CSV data.
 * The component maintains two pieces of state: `message` and `url`.
 * `message` is used to display status messages to the user.
 * `url` is used to store the URL entered by the user.
 * The component renders an input field for the URL, a button to initiate the CSV loading, and a
 * message display.
 *
 * @param {UrlCsvReaderProps} props - The props for the component.
 * @returns {JSX.Element} The rendered component.
 */
function UrlCsvReader({ DAL }: CsvReaderProps): JSX.Element {
  const [message, setMessage] = useState<string | null>(null);
  const [url, setUrl] = useState('');

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  const handleButtonClick = async () => {
    // if (!url.endsWith('.csv')) {
    //   setMessage('URL must point to a CSV file or not empty : ');
    //   return;
    // }
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
