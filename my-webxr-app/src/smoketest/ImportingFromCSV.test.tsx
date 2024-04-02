// eslint-disable-next-line check-file/filename-naming-convention
import ContainText from './TextInFileSearch';

describe('Importing to the web app from a CSV, to then use the data. This can come from an exterior url or a file import.', () => {
  it('CSV buttons become visible to the user', async () => {
    let response = await ContainText('Load CSV from URL button visible');
    expect(response).toBeTruthy();
    response = await ContainText('Load CSV from file button visible');
    expect(response).toBeTruthy();
  });
  it('URL CSV is loaded successfully', async () => {
    const response = await ContainText('URL CSV loaded successfully');
    expect(response).toBeTruthy();
  });
  it('File System CSV is loaded successfully', async () => {
    const response = await ContainText('Local CSV loaded successfully');
    expect(response).toBeTruthy();
  });
  it('URL is not a CSV', async () => {
    const response = await ContainText('URL not a CSV');
    expect(response).toBeTruthy();
  });
});
