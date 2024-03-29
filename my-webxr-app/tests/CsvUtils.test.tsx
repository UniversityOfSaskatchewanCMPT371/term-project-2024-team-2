import { openDB } from 'idb';
import * as Papa from 'papaparse';
import { handleParsedData, validateDbAndStore, parseAndHandleUrlCsv } from '../src/utils/CsvUtils';

jest.mock('idb', () => ({
  openDB: jest.fn(),
}));
jest.mock('papaparse', () => ({
  parse: jest.fn(),
}));

describe('validateDbAndStore functions', () => {
  it('should throw an error if the database does not exist', async () => {
    (openDB as jest.Mock).mockResolvedValueOnce(undefined);

    await expect(validateDbAndStore('testDb', 'testStore')).rejects.toThrow('Database "testDb" does not exist');
  });

  it('should throws an error when the store does not exist within database', async () => {
    (openDB as jest.Mock).mockResolvedValueOnce({
      objectStoreNames: {
        contains: () => false,
      },
    });

    await expect(validateDbAndStore('testDb', 'testStore')).rejects.toThrow('Store "testStore" does not exist in database "testDb"');
  });

  it('should not throw an error if the database and store exist', async () => {
    (openDB as jest.Mock).mockResolvedValueOnce({
      objectStoreNames: {
        contains: () => true,
      },
    });

    await expect(validateDbAndStore('testDb', 'testStore')).resolves.not.toThrow();
  });
});

describe('handleParsedData functions', () => {
  it('should handle parsed data correctly, clearing the store first and then putting data', async () => {
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

  it('should clear the store but no put is called due to empty array', async () => {
    const items: Array<Array<string | number | null>> = [];
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

    await handleParsedData(items, dbName, storeName, 0);

    expect(mockClear).toHaveBeenCalled();
    expect(mockPut).not.toHaveBeenCalled();
  });
});

describe('parseAndHandleUrlCsv function', () => {
  it('should call Papa.parse with correctly passed arguments', async () => {
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
