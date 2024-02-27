import { openDB } from 'idb';
import Papa from 'papaparse';
import assert from './assert.tsx';
import React from "react";

/**
 * Validates the existence of a database and a store within that database.
 *
 * @param {string} dbName - The name of the database to validate.
 * @param {string} storeName - The name of the store to validate.
 * @throws {Error} Will throw an error if the database does not exist, or if the store does not exist within the
 * database.
 */
export const validateDbAndStore = async (dbName: string, storeName: string) => {
    const db = await openDB(dbName, 1);
    const dbExists = db !== undefined;
    assert(dbExists, `Database "${dbName}" does not exist`);
    const storeExists = db.objectStoreNames.contains(storeName);
    assert(storeExists, `Store "${storeName}" does not exist in database "${dbName}"`);
};

/**
 * Handles the parsed data from a CSV file and stores it in a database.
 *
 * @param {Papa.ParseResult<Array<string | number | null>>} results - The results object returned by Papa.parse.
 * The object data should be an array of objects, where each object represents a row in the CSV file.
 * The keys in the objects are the column names from the first row of the CSV file, and the values are the data in
 * those columns for a specific row. The values can be strings, numbers, or null.
 * @param {string} dbName - The name of the database where the data should be stored.
 * @param {string} storeName - The name of the store within the database where the data should be stored.
 * @throws {Error} Will throw an error if the 'data' property of the results object is not an array.
 */
export const handleParsedData = async (results: Papa.ParseResult<Array<string | number | null>>, dbName: string, storeName: string) => {
    assert(Array.isArray(results.data), 'Parsed data must be an array');

    const db = await openDB(dbName, 1);
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    await store.clear();
    // Concurrently process each Database push
    const promises = results.data.map((item: Array<string | number | null>, i:number) => store.put(item, i));
    await Promise.all(promises);
    await tx.done;
};
/**
 * Parses a local CSV file and handles the parsed data.
 *
 * @param {File} file - The local CSV file to parse.
 * @param {string} dbName - The name of the database where the data should be stored.
 * @param {string} storeName - The name of the store within the database where the data should be stored.
 * @param {React.Dispatch<React.SetStateAction<string | null>>} setMessage - The function to call to set the message.
 */
export async function parseAndHandleLocalCsv(file: File, dbName: string, storeName: string, setMessage: React.Dispatch<React.SetStateAction<string | null>>) {
    Papa.parse(file, {
        dynamicTyping: true, // Convert data to number type if applicable
        complete: async (results) => {
            await handleParsedData(results as Papa.ParseResult<Array<string | number | null>>, dbName, storeName);
            setMessage('Local CSV loaded successfully');
        },
    });
}

/**
 * Parses a CSV file from a URL and handles the parsed data.
 *
 * @param {string} url - The URL of the CSV file to parse.
 * @param {string} dbName - The name of the database where the data should be stored.
 * @param {string} storeName - The name of the store within the database where the data should be stored.
 * @param {React.Dispatch<React.SetStateAction<string | null>>} setMessage - The function to call to set the message.
 */
export async function parseAndHandleUrlCsv(url: string, dbName: string, storeName: string, setMessage: React.Dispatch<React.SetStateAction<string | null>>) {
    Papa.parse(url, {
        download: true,
        dynamicTyping: true, // Convert data to number type if applicable
        complete: async (results) => {
            await handleParsedData(results as Papa.ParseResult<Array<string | number | null>>, dbName, storeName);
            setMessage('Url CSV loaded successfully');
        },
    });
}