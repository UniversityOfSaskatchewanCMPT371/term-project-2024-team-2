// eslint-disable-next-line check-file/filename-naming-convention
import ContainText from './TextInFileSearch';

describe('Importing to the web app from a CSV, to then use the data. This can come from an exterior url or a file import.', () => {
  it('CSV buttons become visible to the user', async () => {
    let response = await ContainText('Load CSV from URL visible');
    expect(response).toBeTruthy();
    response = await ContainText('Load CSV from file system visible');
    expect(response).toBeTruthy();
  });
  it('URL CSV is loaded successfully', async () => {
    const response = await ContainText('URL CSV has been successfully loaded');
    expect(response).toBeTruthy();
  });
  it('File System CSV is loaded successfully', async () => {
    const response = await ContainText('File system CSV has been successfully loaded');
    expect(response).toBeTruthy();
  });
  it('No file selected', async () => {
    const response = await ContainText('No file selected');
    expect(response).toBeTruthy();
  });
  it('No URL CSV entered or URL is not a csv', async () => {
    const response = await ContainText('Url is empty or not a csv file');
    expect(response).toBeTruthy();
  });
});
