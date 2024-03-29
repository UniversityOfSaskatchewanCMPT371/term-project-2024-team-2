import * as Papa from 'papaparse';
import parseAndHandleUrlCsv from '../../src/utils/CsvUtils';
import DataAbstractor, { getDatabase } from '../../src/data/DataAbstractor';

vi.mock('idb', () => ({
  openDB: vi.fn(),
}));
vi.mock('papaparse');

describe('parseAndHandleUrlCsv function', () => {
  it('should call Papa.parse with correctly passed arguments', async () => {
    const url = 'https://support.staffbase.com/hc/en-us/article_attachments/360009197031/username.csv';
    const DAL = getDatabase() as DataAbstractor;
    const setMessage = () => {};

    await parseAndHandleUrlCsv(url, DAL, setMessage);

    // @ts-expect-error The default property is external and TypeScript won't recognise it.
    expect((Papa as object).default.parse).toHaveBeenCalledWith(url, expect.objectContaining({
      download: true,
      dynamicTyping: true,
      complete: expect.any(Function),
    }));
  });
});
