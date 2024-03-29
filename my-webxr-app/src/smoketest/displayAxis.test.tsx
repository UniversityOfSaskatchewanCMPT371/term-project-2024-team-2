// eslint-disable-next-line check-file/filename-naming-convention
import ContainText from './TextInFileSearch';

describe('  This feature verifies the creation and manipulation of 3D axes in WebXr application.', () => {
  it('Displaying 3D axes upon application load', async () => {
    let response = await ContainText('Load CSV from URL visible');
    expect(response).toBeTruthy();
    response = await ContainText('Generated X-Axis');
    expect(response).toBeTruthy();
    response = await ContainText('Generated Y-Axis');
    expect(response).toBeTruthy();
    response = await ContainText('Generated Z-Axis');
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
