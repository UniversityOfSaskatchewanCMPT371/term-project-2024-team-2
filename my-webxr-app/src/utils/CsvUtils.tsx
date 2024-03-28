import { IDBPDatabase, openDB } from 'idb';
import Papa from 'papaparse';
import React from 'react';
import assert from './Assert';

/**
 * Validates the existence of a database and a store within that database.
 *
 * @param {string} dbName - The name of the database to validate.
 * @param {string} storeName - The name of the store to validate.
 * @throws {Error} Will throw an error if the database does not exist, or if the store does not
 * exist within the
 * database.
 */
export const validateDbAndStore = async (dbName: string, storeName: string) => {
  const db = await openDB(dbName, 1);
  assert(db !== undefined, `Database "${dbName}" does not exist`);
  const storeExists = db.objectStoreNames.contains(storeName);
  assert(storeExists, `Store "${storeName}" does not exist in database "${dbName}"`);
};

/**
 * Handles the parsed CSV data by storing it in the specified IndexedDB database and store.
 * This clears the store before adding new data, i.e, overwriting existing data.
 *
 * @param {Array<Array<string | number | null>>} items - The parsed CSV data to be stored.
 * @param db
 * @param {string} storeName - The name of the store within the database where the data should be
 * stored.
 * @param {number} start - The starting index for the data to be stored.
 * TODO modify this
 * TODO may be add each row parsed to an array and send them to DAL
 */
export const handleParsedData = async (
  items: Array<Array<string | number | null>>,
  db: IDBPDatabase,
  storeName: string,
  start: number,
) => {
  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);

  // await store.clear(); // Clean the store before adding new data

  const promises = items.map((item, i) => store.put(item, start + i));
  await Promise.all(promises);
  await tx.done;
};

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
  dbName: string,
  storeName: string,
  setMessage: React.Dispatch<React.SetStateAction<string | null>>,
) {
  const db = await openDB(dbName, 1);
  let i = 0;
  let batch :Array<Array<string | number | null>> = [];
  const batchSize = 999; // # of rows per batch
  Papa.parse(url, {
    download: true,
    dynamicTyping: true, // Convert data to number type if applicable
    step: async (results) => {
      console.log(i);
      batch.push(results.data as Array<string | number | null>);
      if (batch.length >= batchSize) {
        await handleParsedData(batch, db, storeName, i);
        i += batch.length;
        batch = [];
      }
    },
    complete: async () => {
      if (batch.length > 0) {
        await handleParsedData(batch, db, storeName, i);
      }
      setMessage('Url CSV loaded successfully');
    },
  });
}
