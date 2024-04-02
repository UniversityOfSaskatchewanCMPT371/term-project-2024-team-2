/* eslint-disable no-console, func-names */

import { openDB } from 'idb';

/**
 * Creates a DOM element to access smoke testing functionalities
 * @pre-condition None
 * @post-condition returns a DOM element to access smoke testing functionalities
 * @return {JSX.Element} a DOM element to access smoke testing functionalities
 * @constructor
 */
export default function TestingOptions() {
  const handleButtonClick = () => {
    // Reset the localStorage value to an empty string
    localStorage.setItem('myText', '');
  };

  const downloadText = () => {
    const textToDownload = localStorage.getItem('myText') || '';
    const blob = new Blob([textToDownload], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'testLog.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const viewDatabase = async () => {
    const db = await openDB('CsvDataBase');

    // Hacky "alert/modal" to show everything in the Database. It has to be created this way in
    // order to appear in front of everything (we can't just put it in the React component).
    const popup = document.getElementById('root')?.appendChild(document.createElement('div'));
    if (typeof popup === 'undefined') {
      db.close();
      return Promise.reject(new Error('Failed to show DB popup'));
    }
    popup.id = 'db_popup';
    popup.style.position = 'absolute';
    popup.style.top = '0px';
    popup.style.width = '100%';
    popup.style.height = '100%';
    popup.style.backgroundColor = '#202020';

    const close = popup.appendChild(document.createElement('button'));
    close.id = 'db_popup_close';
    close.style.position = 'absolute';
    close.style.top = '0px';
    close.style.right = '0px';
    close.style.width = '5vw';
    close.style.height = '5vw';
    close.style.fontWeight = '800';
    close.style.fontSize = 'x-large';
    close.innerText = 'X';
    close.onclick = function () {
      document.getElementById('db_popup')?.remove();
    };

    const content = popup.appendChild(document.createElement('pre'));
    content.id = 'db_popup_text';
    content.style.padding = '1vw';
    content.innerText = '### RAW DATA (rawColumns) ###\n';
    content.innerText += JSON.stringify(await db.getAll('rawColumns'), null, 4);
    content.innerText += '\n\n### STATS DATA (statsColumns) ###\n';
    content.innerText += JSON.stringify(await db.getAll('statsColumns'), null, 4);
    content.innerText += '\n\n### STANDARDIZED DATA (standardizedColumns) ###\n';
    content.innerText += JSON.stringify(await db.getAll('standardizedColumns'), null, 4);
    content.innerText += '\n\n### PCA DATA (pcaColumns) ###\n';
    content.innerText += JSON.stringify(await db.getAll('pcaColumns'), null, 4);
    content.innerText += '\n';

    return Promise.resolve('DB popup created');
  };

  return (
    <div>
      <button type="button" onClick={handleButtonClick}>Begin Test</button>
      <button type="button" onClick={downloadText}>Download</button>
      <button type="button" onClick={viewDatabase}>View Database</button>
    </div>
  );
}
