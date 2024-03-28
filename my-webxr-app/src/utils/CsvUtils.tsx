import Papa from 'papaparse';
import React from 'react';
import DataAbstractor from '../data/DataAbstractor';

/**
 * Asynchronously parses a CSV file from a URL and handles the parsed data in batches of 1000 rows.
 * Rows with null values are ignored. The parsed data is stored in the `dataWithoutNull` array.
 * Once the parsing is complete, the data is sent to `DAL.storeCSV` in batches of 1000 rows.
 *
 * @param {string} url - The URL of the CSV file to parse.
 * @param {DataAbstractor} DAL - The Data Abstractor instance where the parsed CSV data will be
 * stored.
 * @param {React.Dispatch<React.SetStateAction<string | null>>} setMessage - The function to call to
 * set the message state in the parent component.
 */

async function parseAndHandleUrlCsv(
  url: string,
  DAL: DataAbstractor,
  setMessage: React.Dispatch<React.SetStateAction<string | null>>,
) {
  const dataWithoutNull = Array<Array<string | number>>();

  // Normalize headers by appending a number to duplicate headers, takes in an array of string
  // headers
  const normalizeHeaders = (headers: string[]) => {
    const count: Record<string, number> = {};
    return headers.map((header) => {
      count[header] = (count[header] || 0) + 1;
      return count[header] > 1 ? `${header}${count[header]}` : header;
    });
  };

  Papa.parse(url, {
    download: true,
    dynamicTyping: true, // Convert data to number type if applicable
    step: async (results) => {
      const row = results.data as Array<string | number | null>;
      if (row.every((item) => item !== null && item !== undefined)) {
        dataWithoutNull.push(row as (string | number)[]);
      }
    },
    complete: async () => {
      for (let i = 0; i < dataWithoutNull.length; i += 1000) {
        const batch = dataWithoutNull.slice(i, i + 1000);
        if (i === 0) {
          // Normalize (fix duplicate) headers in the first batch
          const headers = batch[0] as string[];
          batch[0] = normalizeHeaders(headers);
        }
        // eslint-disable-next-line no-await-in-loop
        await DAL.storeCSV(batch);
      }
      setMessage('Url CSV loaded successfully');
    },
  });
}

export default parseAndHandleUrlCsv;
