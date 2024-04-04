import ContainText from './TextInFileSearch';

describe('Selecting Axis to Represent the X, Y, and Z Axes', () => {
  it('X axis selection visible', async () => {
    // replace with title selected
    const response = await ContainText('Selected Axis: x');
    expect(response).toBeTruthy();
  });
  it('Y axis selection visible', async () => {
    // replace with title selected
    const response = await ContainText('Selected Axis: y');
    expect(response).toBeTruthy();
  });
  it('Z axis selection visible', async () => {
    // replace with title selected
    const response = await ContainText('Selected Axis: z');
    expect(response).toBeTruthy();
  });
  it('Complete Selection button visible', async () => {
    const response = await ContainText('Complete Selection button clicked');
    expect(response).toBeTruthy();
  });
  it('Available options fill out', async () => {
    // replace with titles
    const response = await ContainText('withnull, x, y, z');
    expect(response).toBeTruthy();
  });
});
