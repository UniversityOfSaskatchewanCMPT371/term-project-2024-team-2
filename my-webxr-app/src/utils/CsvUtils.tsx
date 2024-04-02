import Papa from 'papaparse';
import React from 'react';
import * as assert from 'assert';
import DataAbstractor from '../data/DataAbstractor';
import WriteHook from '../../smoketests/TestHookWrite';

/**
 * Asynchronously parses a CSV file from a URL and handles the parsed data.
 * Rows with null values are ignored. The parsed data is stored in the `sanitizedBatch` array.
 * Once the parsing is complete, the data is sent to `DAL.storeCSV` in batches of 1000 rows.
 *
 * @pre-condition a database of the given name must exist
 * @post-condition the provided data is stored in the database via a transaction
 * @param {string} url - The URL of the CSV file to parse.
 * @param {DataAbstractor} DAL - The Data Abstractor instance where the parsed
 *      CSV data will be stored.
 * @param {React.Dispatch<React.SetStateAction<string | null>>} setMessage - The function
 *      to call to set the message state in the parent component.
 * @returns {Promise<void>} - A promise that resolves when the parsing and handling
 *      of the CSV file is complete.
 */
async function parseAndHandleUrlCsv(
  url: string,
  DAL: DataAbstractor,
  setMessage: React.Dispatch<React.SetStateAction<string | null>>,
) {
  const completeData = Array<Array<string | number>>();
  assert.ok(url !== null || url !== undefined, 'No URL provided');
  assert.ok(DAL !== null || DAL !== undefined, 'No Data Abstractor provided');
  assert.ok(setMessage !== null || setMessage !== undefined, 'No setMessage function provided');
  // Normalize headers by appending a number to duplicate headers, takes in an array of string
  // headers
  await DAL.resetFlag();
  const normalizeHeaders = (headers: string[]) => {
    const count: Record<string, number> = {};
    return headers.map((header) => {
      count[header] = (count[header] || 0) + 1;
      return count[header] > 1 ? `${header}${count[header]}` : header;
    });
  };

  return new Promise((resolve, reject) => {
    Papa.parse(url, {
      download: true,
      dynamicTyping: true, // Convert data to number type if applicable
      step: async (results) => {
        const row = results.data as Array<string | number | null>;
        if (row.every((item) => item !== null && item !== undefined)) {
          completeData.push(row as (string | number)[]);
        }
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
          WriteHook(`Loaded CSV with ${sanitizedBatch.length} rows : `);
        }
        setMessage('Url CSV loaded successfully');
        await DAL.calculateStatistics();
        await DAL.storeStandardizedData();
        await DAL.storePCA(await DAL.getAvailableFields());
        resolve('success');
      },
      error: (error) => {
        setMessage(`Error loading URL CSV: ${error}`);
        reject(error);
      },
    });
  });
}

export default parseAndHandleUrlCsv;
