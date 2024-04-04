import ContainText from './TextInFileSearch';

describe('Scaling bar can change the size of the axis', () => {
  it('Scaling value is 1', async () => {
    const response = await ContainText('1');
    expect(response).toBeTruthy();
  });
  it('Scaling value is 5.5', async () => {
    const response = await ContainText('5.5');
    expect(response).toBeTruthy();
  });
  it('Scaling value is 10', async () => {
    const response = await ContainText('10');
    expect(response).toBeTruthy();
  });
  it('Length of axis changes with scaling value 1', async () => {
    const response = await ContainText('1');
    expect(response).toBeTruthy();
  });
  it('Length of axis changes with scaling value 5.5', async () => {
    const response = await ContainText('5.5');
    expect(response).toBeTruthy();
  });
  it('Length of axis changes with scaling value 10', async () => {
    const response = await ContainText('10');
    expect(response).toBeTruthy();
  });
});
