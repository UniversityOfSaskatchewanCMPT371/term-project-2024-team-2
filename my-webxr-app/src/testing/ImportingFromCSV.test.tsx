// eslint-disable-next-line check-file/filename-naming-convention
import ContainText from './TextInFileSearch';

describe('  Importing to the web app from a CSV, to then use the data. This can come from an exterior url or a file import.', () => {
  it('CSV buttons become visible to the user', async () => {
    let response = await ContainText('LoadCSVFromURLVisible');
    expect(response).toBeTruthy();
    response = await ContainText('LoadCSVFromFileSystemVisible');
    expect(response).toBeTruthy();
  });
});
