// eslint-disable-next-line check-file/filename-naming-convention
import ContainText from './TextInFileSearch';

describe('Data Point Component in WebXR Application', () => {
  it('Data is rendered because you can hover and click a point', async () => {
    const response = await ContainText('Datapoint is selected');
    expect(response).toBeTruthy();
  });
  it('Hover a data point with the controller', async () => {
    const response = await ContainText('Datapoint is hovered');
    expect(response).toBeTruthy();
  });
  it('Click a data point with the controller', async () => {
    const response = await ContainText('Datapoint is selected');
    expect(response).toBeTruthy();
  });
  it('When a point is clicked data is displayed (the position is recorded. x,y,z)', async () => {
    // replace this with the position of the data point you will select
    const response = await ContainText('-5,0,5');
    expect(response).toBeTruthy();
  });
});
