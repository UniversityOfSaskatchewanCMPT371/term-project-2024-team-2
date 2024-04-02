import { expect } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import SelectAxesColumns from '../../src/components/SelectAxesMenu';
import { AxesSelectionProvider } from '../../src/contexts/AxesSelectionContext';
import DataLayer from '../../src/data/DataLayer';
import '@testing-library/jest-dom';

const mockGetUser = vi.fn(() => Promise.resolve(['field1', 'field2', 'field3']));

vi.mock('../../src/data/DataLayer', () => {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  class DataLayer {
    getAvailableFields = mockGetUser;
  }
  return { default: DataLayer };
});

vi.mock('@rollbar/react', () => ({
  useRollbar: () => ({
    debug: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  }),
}));
describe('SelectAxesColumns Component Tests', () => {
  const mockDatabase = new DataLayer();

  it('Renders dropdowns correctly with available fields', async () => {
    const element = (
      <AxesSelectionProvider>
        <SelectAxesColumns reload={false} database={mockDatabase} />
      </AxesSelectionProvider>
    );
    const {
      queryAllByRole, queryAllByText,
    } = render(
      element,
    );

    // wait for the useEffect to complete getting the available fields
    await waitFor(async () => expect(mockDatabase.getAvailableFields).toHaveBeenCalledOnce());

    // check that the dropdowns and options are rendered
    const dropdowns = await queryAllByRole('combobox');
    expect(dropdowns).toHaveLength(3);

    const options = await queryAllByRole('option');
    expect(options).toHaveLength(12);

    const selectOptions = await queryAllByText('Select an option');
    expect(selectOptions).toHaveLength(3);

    ['field1', 'field2', 'field3'].forEach((field) => {
      const fieldOptions = queryAllByText(field);
      expect(fieldOptions).toHaveLength(3);
    });
  });
});
