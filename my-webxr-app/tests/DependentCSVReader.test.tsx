import { openDB } from 'idb';
import {handleParsedData, validateDbAndStore, RowData} from "../src/components/DependentCsvReader";

jest.mock('idb', () => ({
    openDB: jest.fn(),
}));

describe('validateDbAndStore functions', () => {
    test('throws an error when the store does not exist', async () => {
        (openDB as jest.Mock).mockResolvedValueOnce({
            objectStoreNames: {
                contains: () => false,
            },
        });

        await expect(validateDbAndStore('testDb', 'testStore')).rejects.toThrow(`Store "testStore" does not exist in database "testDb"`);
    });
    
    test('does not throw an error when the store exists', async () => {
        (openDB as jest.Mock).mockResolvedValueOnce({
            objectStoreNames: {
                contains: () => true,
            },
        });

        await expect(validateDbAndStore('testDb', 'testStore')).resolves.not.toThrow();
    });
});

describe('handleParsedData functions', () => {
    it('should handle parsed data correctly', async () => {
       const results: Papa.ParseResult<RowData> = {
            data: [{key1: 'value1', key2: 'value2'}],
            errors: [],
            meta: {
                delimiter: ",",
                linebreak: "\n",
                aborted: false,
                truncated: false,
                cursor: 0
            },
        };
        (openDB as jest.Mock).mockResolvedValueOnce({
            transaction: () => ({
                objectStore: () => ({
                    clear: jest.fn().mockResolvedValue(undefined),
                    put: jest.fn().mockResolvedValue(undefined),
                }),
                done: Promise.resolve(),
            }),
        });

        await expect(handleParsedData(results, 'testDb', 'testStore')).resolves.not.toThrow();
    });
});