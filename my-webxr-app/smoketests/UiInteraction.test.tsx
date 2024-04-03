import ContainText from './TextInFileSearch';

describe('Interaction with DataPoints and DataPointMenu', () => {
  // Load box.csv to test these
  test('Selecting a single DataPoint', async () => {
    const response = await ContainText('Now showing info for DataPoint 10; previously null');
    expect(response).toBeTruthy();
  });

  test('Selecting a new DataPoint and replacing the old one', async () => {
    const response = await ContainText('Now showing info for DataPoint 11; previously 10');
    expect(response).toBeTruthy();
  });

  test('Deselecting a new DataPoint', async () => {
    const response = await ContainText('No more DataPoint info to display; previously 11');
    expect(response).toBeTruthy();
  });
});
