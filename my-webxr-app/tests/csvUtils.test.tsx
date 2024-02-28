import { openDB } from 'idb';
import { handleParsedData, validateDbAndStore, parseAndHandleUrlCsv } from "../src/utils/csvUtils";
import * as Papa from "papaparse";

jest.mock('idb', () => ({
    openDB: jest.fn(),
}));
jest.mock('papaparse', () => ({
    parse: jest.fn(),
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
        const results: Array<Array<string | number | null>> = [['value1', 'value2']];
        const dbName = 'testDb';
        const storeName = 'testStore';

        const mockClear = jest.fn().mockResolvedValue(undefined);
        const mockPut = jest.fn().mockResolvedValue(undefined);

        (openDB as jest.Mock).mockResolvedValueOnce({
            transaction: () => ({
                objectStore: () => ({
                    clear: mockClear,
                    put: mockPut,
                }),
                done: Promise.resolve(),
            }),
        });

        await handleParsedData(results, dbName, storeName, 0);

        expect(mockClear).toHaveBeenCalled();
        results.forEach((item, index) => {
            expect(mockPut).toHaveBeenCalledWith(item, index);
        });
    });
});

// This test only work on Node version 20 or higher

// describe('parseAndHandleLocalCsv function', () => {
//     it('should call Papa.parse with correct arguments', async () => {
//         const file = new File([""], "filename.csv", { type: "text/csv" });
//         const dbName = 'testDb';
//         const storeName = 'testStore';
//         const setMessage = jest.fn();
//
//         await parseAndHandleLocalCsv(file, dbName, storeName, setMessage);
//
//         expect(Papa.parse).toHaveBeenCalledWith(file, expect.objectContaining({
//             dynamicTyping: true,
//             complete: expect.any(Function),
//         }));
//     });
// });

describe('parseAndHandleUrlCsv function', () => {
    it('should call Papa.parse with correct arguments', async () => {
        const url = 'https://support.staffbase.com/hc/en-us/article_attachments/360009197031/username.csv';
        const dbName = 'testDb';
        const storeName = 'testStore';
        const setMessage = jest.fn();

        await parseAndHandleUrlCsv(url, dbName, storeName, setMessage);

        expect(Papa.parse).toHaveBeenCalledWith(url, expect.objectContaining({
            download: true,
            dynamicTyping: true,
            complete: expect.any(Function),
        }));
    });
});