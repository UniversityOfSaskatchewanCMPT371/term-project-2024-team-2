import React, { useState } from 'react';
import DataAbstractor from '../data/DataAbstractor';
import parseAndHandleUrlCsv from '../utils/CsvUtils';

interface UrlCsvReaderProps {
  dataBase: DataAbstractor;
}

/**
 * `UrlCsvReader` is a React component that provides a user interface for loading CSV data from a
 * URL.
 * It takes a `DataAbstractor` instance as a prop, which is used to store the parsed CSV data.
 * The component maintains two pieces of state: `message` and `url`.
 * `message` is used to display status messages to the user.
 * `url` is used to store the URL entered by the user.
 * The component renders an input field for the URL, a button to initiate the CSV loading, and a
 * message display.
 *
 * @param {UrlCsvReaderProps} props - The props for the component.
 * @returns {JSX.Element} The rendered component.
 */
function UrlCsvReader({ dataBase }: UrlCsvReaderProps): JSX.Element {
  const [message, setMessage] = useState<string | null>(null);
  const [url, setUrl] = useState('');

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  const handleButtonClick = async () => {
    if (!url.endsWith('.csv')) {
      setMessage('URL must point to a CSV file or not empty : ');
      return;
    }
    try {
      await parseAndHandleUrlCsv(url, dataBase, setMessage);
    } catch (e) {
      setMessage(`An error occurred: ${e}`);
    }
  };

  return (
    <div>
      <input type="text" placeholder="Enter CSV URL" onChange={handleUrlChange} />
      <button type="button" onClick={handleButtonClick}>Load Url CSV</button>
      {message && <div>{message}</div>}
    </div>
  );
}
export default UrlCsvReader;
