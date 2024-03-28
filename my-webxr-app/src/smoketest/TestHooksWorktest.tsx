// eslint-disable-next-line check-file/filename-naming-convention
import ContainText from './TextInFileSearch';

describe('testing SmokeTestSpike live download', () => {
  it('the text search should find the value SMOKE', async () => {
    const response = await ContainText('Triggered CSV buttonTriggered no file selected');
    expect(response).toBeTruthy();
  });

  it('the text search should not find the value SMOKE', async () => {
    const response = await ContainText('Value not exist');
    expect(response).toBeFalsy();
  });
});
