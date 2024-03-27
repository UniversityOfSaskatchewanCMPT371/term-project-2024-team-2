import { openDB } from 'idb';
import Papa from 'papaparse';
import React from 'react';
import assert from './Assert';
import { DataRow } from '../repository/Column';

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
 * @param {BatchedDataStream} items - The parsed CSV data to be stored.
 * @param {string} dbName - The name of the database where the data should be stored.
 * @param {string} storeName - The name of the store within the database where the data should be
 * stored.
 * @param {number} start - The starting index for the data to be stored.
 */
export const handleParsedData = async (
  items: BatchedDataStream,
  dbName: string,
  storeName: string,
  start: number,
) => {
  const db = await openDB(dbName, 1);
  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);

  await store.clear(); // Clean the store before adding new data

  const promises = items.map((item, i) => store.put(item, start + i));
  await Promise.all(promises);

  await tx.done;
};

/**
 * The BatchedDataStream type is used for streaming in batches of data from CSV parsing.
 */
export type BatchedDataStream = Array<DataRow>;

/**
 * Parses a local CSV file and handles the parsed data in batches of 1000 rows.
 *
 * @param {File} file - The local CSV file to parse.
 * @param {string} dbName - The name of the database where the data should be stored.
 * @param {string} storeName - The name of the store within the database where the data should be
 * stored.
 * @param {React.Dispatch<React.SetStateAction<string | null>>} setMessage - The function to call to
 * set the message.
 */
export async function parseAndHandleLocalCsv(
  file: File,
  dbName: string,
  storeName: string,
  setMessage: React.Dispatch<React.SetStateAction<string | null>>,
) {
  let i = 0;
  let batch: BatchedDataStream = [] as BatchedDataStream;
  const batchSize = 1000; // # of rows per batch
  Papa.parse(file, {
    dynamicTyping: true, // Convert data to number type if applicable
    step: async (results) => {
      batch.push(results.data as DataRow);
      if (batch.length >= batchSize) {
        await handleParsedData(batch, dbName, storeName, i);
        i += batch.length;
        batch = [] as BatchedDataStream;
      }
    },
    complete: async () => {
      if (batch.length > 0) {
        await handleParsedData(batch, dbName, storeName, i);
      }
      setMessage('Local CSV loaded successfully');
    },
  });
}

/**
 * Parses a CSV file from a URL and handles the parsed data in batches oif 1000 rows.
 *
 * @param {string} url - The URL of the CSV file to parse.
 * @param {string} dbName - The name of the database where the data should be stored.
 * @param {string} storeName - The name of the store within the database where the data should be
 * stored.
 * @param {React.Dispatch<React.SetStateAction<string | null>>} setMessage - The function to call to
 * set the message.
 */
export async function parseAndHandleUrlCsv(
  url: string,
  dbName: string,
  storeName: string,
  setMessage: React.Dispatch<React.SetStateAction<string | null>>,
) {
  let i = 0;
  let batch : BatchedDataStream = [];
  const batchSize = 1000; // # of rows per batch
  Papa.parse(url, {
    download: true,
    dynamicTyping: true, // Convert data to number type if applicable
    step: async (results) => {
      batch.push(results.data as DataRow);
      if (batch.length >= batchSize) {
        await handleParsedData(batch, dbName, storeName, i);
        i += batch.length;
        batch = [] as BatchedDataStream;
      }
    },
    complete: async () => {
      if (batch.length > 0) {
        await handleParsedData(batch, dbName, storeName, i);
      }
      setMessage('Url CSV loaded successfully');
    },
  });
}
