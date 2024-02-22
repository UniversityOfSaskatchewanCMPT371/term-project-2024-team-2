import { openDB } from 'idb';
import { validateDbAndStore, handleParsedData } from '../src/components/LocalCsvReader';

// Mocking the indexDB component
jest.mock('idb', () => ({
  openDB: jest.fn(),
}));

describe('LocalCsvReader functions', () => {
  // File is a web api and is not available in Node.js env. This test is run
  // with Node x20 but not x18 and x16. Commented out to find altenative sols.

  // test('validateFile throws an error when the File is not a CSV file or not empty', () => {
  //     const file = new File([''], 'test.txt', { type: 'text/plain' });
  //     expect(() => validateFile(file)).toThrow('File must be a CSV file or not empty');
  //     const csvFile = new File([''], 'test.csv', { type: 'text/csv' });
  //     expect(() => validateFile(csvFile)).not.toThrow();
  // });

  test('throws an error when the store does not exist', async () => {
    (openDB as jest.Mock).mockResolvedValueOnce({
      objectStoreNames: {
        contains: () => false,
      },
    });

    await expect(validateDbAndStore('testDb', 'testStore')).rejects.toThrow('Store "testStore" does not exist in database "testDb"');
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

    // @ts-expect-error We are purposely testing an invalid data type. This cannot be caught
    // during runtime by TypeScript
    await expect(handleParsedData(results, 'testDb', 'testStore')).rejects.toThrow('Parsed data must be an array');
  });

  test('handleParsedData does not throw an error when the parsed data is an array', async () => {
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

    // @ts-expect-error We are purposely testing an invalid data type. This cannot be caught
    // during runtime by TypeScript
    await expect(handleParsedData(results, 'testDb', 'testStore')).resolves.not.toThrow();
  });
});
