import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { LocalCsvReader } from './LocalCsvReader';
import '@testing-library/jest-dom/extend-expect';


describe('LocalCsvReader Component', () => {
  // Helper function to render the LocalCsvReader component with default props
  const renderComponent = () => render(<LocalCsvReader dbName="testDB" storeName="testStore" />);

  // Test case: importing a CSV file with valid data
  it('should handle importing a CSV file with valid data', async () => {
    // Render the LocalCsvReader component
    const { getByLabelText } = renderComponent();
    
    // Mock Papa.parse to simulate successful parsing
    jest.spyOn(window, 'Papa').mockImplementationOnce((file: string, options: any) => {
      options.complete({ data: [{ column1: 'value1', column2: 'value2' }] });
    });

    // Trigger file change event
    const fileInput = getByLabelText('Choose a CSV file');
    fireEvent.change(fileInput, { target: { files: [new File([''], 'test.csv', { type: 'text/csv' })] } });

    // Wait for the operation to complete
    await waitFor(() => {
      // Assert that the success message is displayed
      expect(getByText('CSV imported successfully')).toBeInTheDocument();
    });
  });

  // Test case: importing a CSV file with invalid format
  it('should handle importing a CSV file with invalid format', async () => {
    // Render the LocalCsvReader component
    const { getByLabelText, getByText } = renderComponent();
    
    // Mock Papa.parse to simulate unsuccessful parsing
    jest.spyOn(window, 'Papa').mockImplementationOnce((file: string, options: any) => {
      options.error({ message: 'Invalid CSV format' });
    });

    // Trigger file change event
    const fileInput = getByLabelText('Choose a CSV file');
    fireEvent.change(fileInput, { target: { files: [new File([''], 'test.csv', { type: 'text/csv' })] } });

    // Wait for the error message to be displayed
    await waitFor(() => {
      // Assert that the error message is displayed
      expect(getByText('Invalid CSV format')).toBeInTheDocument();
    });
  });

  // Test case: importing a CSV file with empty data
  it('should handle importing a CSV file with empty data', async () => {
    // Render the LocalCsvReader component
    const { getByLabelText, getByText } = renderComponent();
    
    // Mock Papa.parse to simulate parsing with empty data
    jest.spyOn(window, 'Papa').mockImplementationOnce((file: string, options: any) => {
      options.complete({ data: [] });
    });

    // Trigger file change event
    const fileInput = getByLabelText('Choose a CSV file');
    fireEvent.change(fileInput, { target: { files: [new File([''], 'test.csv', { type: 'text/csv' })] } });

    // Wait for the error message to be displayed
    await waitFor(() => {
      // Assert that the error message is displayed
      expect(getByText('Error: File cannot be empty')).toBeInTheDocument();
    });
  });

  // Test case: importing a CSV file with missing columns
  it('should handle importing a CSV file with missing columns', async () => {
    // Render the LocalCsvReader component
    const { getByLabelText, getByText } = renderComponent();
    
    // Mock Papa.parse to simulate parsing with missing columns
    jest.spyOn(window, 'Papa').mockImplementationOnce((file: string, options: any) => {
      options.complete({ data: [{ column1: 'value1' }] }); // Missing column2
    });

    // Trigger file change event
    const fileInput = getByLabelText('Choose a CSV file');
    fireEvent.change(fileInput, { target: { files: [new File([''], 'test.csv', { type: 'text/csv' })] } });

    // Wait for the error message to be displayed
    await waitFor(() => {
      // Assert that the error message is displayed
      expect(getByText('Error: File must have all required columns')).toBeInTheDocument();
    });
  });

  // Test case: importing a large CSV file
  it('should handle importing a large CSV file', async () => {
    // Render the LocalCsvReader component
    const { getByLabelText } = renderComponent();
    
    // Mock Papa.parse to simulate parsing a large CSV file
    jest.spyOn(window, 'Papa').mockImplementationOnce((file: string, options: any) => {
      // Assume you have a function to generate large data
      const largeData = generateLargeData(); 
      options.complete({ data: largeData });
    });

    // Trigger file change event
    const fileInput = getByLabelText('Choose a CSV file');
    fireEvent.change(fileInput, { target: { files: [new File([''], 'large_data.csv', { type: 'text/csv' })] } });

    // Wait for the operation to complete
    await waitFor(() => {
      // Assert that the success message is displayed
      expect(getByText('Large CSV file imported successfully')).toBeInTheDocument();
    });
  });
});

// Placeholder function for generating large data
function generateLargeData() {
  // Generate and return large data
  return [];
}
