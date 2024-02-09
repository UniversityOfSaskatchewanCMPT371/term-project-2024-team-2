import { validateUrl, validateDbAndStore, handleParsedData } from '../src/components/UrlCsvReader';
import { openDB } from 'idb';

// Mocking the indexBD component
jest.mock('idb', () => ({
  openDB: jest.fn(),
}));

describe('UrlCsvReader functions', () => {
    test('validateUrl throws an error when the URL does not point to a CSV file', () => {
        expect(() => validateUrl('lmao@hehe.lol')).toThrow('URL must point to a CSV file');
        expect(() => validateUrl('WillyMineyMole.csv')).not.toThrow();
    });


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

    
    test('handleParsedData throws an error when the parsed data is not an array', async () => {
        const results = {
            data: 'not an array',
        };

        await expect(handleParsedData(results, 'testDb', 'testStore')).rejects.toThrow('Parsed data must be an array');
        });
});