import { openDB } from 'idb';
import assert from '../utils/assert';

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
 * @param {any} results - The results object returned by Papa.parse. The object data should be an array.
 * @param {string} dbName - The name of the database where the data should be stored.
 * @param {string} storeName - The name of the store within the database where the data should be stored.
 * @throws {Error} Will throw an error if the 'data' property of the results object is not an array.
 */
export const handleParsedData = async (results: any, dbName: string, storeName: string) => {
    assert(Array.isArray(results.data), 'Parsed data must be an array');

    const db = await openDB(dbName, 1);
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    await store.clear();
    // Concurrently process each Database push
    const promises = results.data.map((item: number|string|null, i:number) => store.put(item, i));
    await Promise.all(promises);
    await tx.done;
};

