import * as Papa from 'papaparse';
import { expect } from 'vitest';
import parseAndHandleUrlCsv from '../../src/utils/CsvUtils';
import DataAbstractor, { getDatabase } from '../../src/data/DataAbstractor';

vi.mock('idb', () => ({
  openDB: vi.fn(),
}));

vi.mock('papaparse', () => ({
  default: {
    parse: vi.fn().mockImplementation((url, options) => {
      options.complete();
    }),
  },
}));

describe('parseAndHandleUrlCsv function', () => {
  it('should call Papa.parse with correctly passed arguments', async () => {
    const url = 'testURL';
    const DAL = getDatabase() as DataAbstractor;
    const setMessage = () => {};

    await parseAndHandleUrlCsv(url, DAL, setMessage);

    // @ts-expect-error The default property is external and TypeScript won't recognise it.
    expect((Papa as object).default.parse).toHaveBeenCalledWith(url, expect.objectContaining({
      download: true,
      dynamicTyping: true,
      step: expect.any(Function),
      complete: expect.any(Function),
      error: expect.any(Function),
    }));
  });
});
