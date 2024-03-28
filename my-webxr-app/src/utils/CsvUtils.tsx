import Papa from 'papaparse';
import React from 'react';
import DataAbstractor from '../data/DataAbstractor';
import DataLayer from '../data/DataLayer';

/**
 * Parses a CSV file from a URL and handles the parsed data in batches oif 1000 rows.
 *
 * @param {string} url - The URL of the CSV file to parse.
 * @param {string} dbName - The name of the database where the data should be stored.
 * @param {string} storeName - The name of the store within the database where the data should be
 * stored.
 * @param {React.Dispatch<React.SetStateAction<string | null>>} setMessage - The function to call to
 * set the message.
 * TODO modify this to parse and send each row
 */
export async function parseAndHandleUrlCsv(
  url: string,
  DataLayer: DataAbstractor,
  setMessage: React.Dispatch<React.SetStateAction<string | null>>,
) {
  const i = 0;
  const batch = Array<Array<string | number | null>>();
  const batch_size = 1000;
  Papa.parse(url, {
    download: true,
    dynamicTyping: true, // Convert data to number type if applicable
    step: async (results) => {
      batch.push(results.data as Array<string | number | null>);
      console.log('printing');
    },
    complete: async () => {
      console.log('done');
      setMessage('Url CSV loaded successfully');
    },
  });
  batch.map(async (batchItem) => {
    await DataLayer.storeCSV(batchItem);
  });
}
