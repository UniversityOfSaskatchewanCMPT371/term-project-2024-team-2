import ContainText from './TextInFileSearch';

describe('Exclude incomplete data from CSV import', () => {
  test('Loading a complete CSV file (grades.csv)', async () => {
    const response = await ContainText('Loaded CSV with 31 rows');
    expect(response).toBeTruthy();
  });

  test('Loading an incomplete CSV file (exclusion.csv)', async () => {
    const response = await ContainText('Loaded CSV with 3 rows');
    expect(response).toBeTruthy();
  });
});
