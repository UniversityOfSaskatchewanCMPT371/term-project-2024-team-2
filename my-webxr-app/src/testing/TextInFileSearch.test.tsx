// eslint-disable-next-line check-file/filename-naming-convention
import ContainText from './TextInFileSearch';

describe('testing SmokeTestSpike', () => {
  it('the text search should find the value SMOKE', async () => {
    const response = await ContainText('Thing1');
    expect(response).toBeTruthy();
  });

  it('the text search should not find this SMOKE', async () => {
    const response = await ContainText('Thing111');
    expect(response).toBeFalsy();
  });

  it('findind text with miss match capitals', async () => {
    const response = await ContainText('Find');
    expect(response).toBeTruthy();
  });
});
