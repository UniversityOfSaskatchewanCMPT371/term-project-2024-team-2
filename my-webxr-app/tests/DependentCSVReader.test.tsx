import { openDB } from 'idb';
import {handleParsedData, validateDbAndStore} from "../src/components/DependentCSVReader";

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
    test('throws an error when the parsed data is not an array', async () => {
        const results = {
            data: 'not an array',
        };

        await expect(handleParsedData(results, 'testDb', 'testStore')).rejects.toThrow('Parsed data must be an array');
    });

    test('does not throw an error when the parsed data is an array', async () => {
        const results = {
            data: [],
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