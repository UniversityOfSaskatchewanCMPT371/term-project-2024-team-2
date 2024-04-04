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
});
