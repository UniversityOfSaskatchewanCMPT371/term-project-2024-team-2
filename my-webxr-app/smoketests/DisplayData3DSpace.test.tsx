// eslint-disable-next-line check-file/filename-naming-convention
import ContainText from './TextInFileSearch';

describe('Test an integration between data storage and displaying it in the 3D space.', () => {
  it('ID of the point selected', async () => {
    // the ID of the point should be outputted, replace with data
    const response = await ContainText('13');
    expect(response).toBeTruthy();
  });
  it('Marker of the point selected', async () => {
    // the marker of the point should be outputted, replace with data
    const response = await ContainText('circle');
    expect(response).toBeTruthy();
  });
  it('Color of the point selected', async () => {
    // the color of the point should be outputted, replace with data
    const response = await ContainText('yellow');
    expect(response).toBeTruthy();
  });
  it('Co-ordinates of the point selected', async () => {
    // the co-ordinates of the point should be outputted, replace with data
    const response = await ContainText('-5,0,5');
    expect(response).toBeTruthy();
  });
  it('Column X of the point selected', async () => {
    // the column x of the point should be outputted, replace with data
    const response = await ContainText('x');
    expect(response).toBeTruthy();
  });
  it('Column Y of the point selected', async () => {
    // the column y of the point should be outputted, replace with data
    const response = await ContainText('y');
    expect(response).toBeTruthy();
  });
  it('Column Z of the point selected', async () => {
    // the column z of the point should be outputted, replace with data
    const response = await ContainText('z');
    expect(response).toBeTruthy();
  });
  it('Everything should be undefined when point is unselected', async () => {
    const response = await ContainText('undefined');
    expect(response).toBeTruthy();
  });
});
