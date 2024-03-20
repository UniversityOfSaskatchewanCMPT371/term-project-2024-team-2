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

  return (
    <div>
      <button type="button" onClick={handleButtonClick}>Begin Test</button>
      <button type="button" onClick={downloadText}>Download</button>
    </div>
  );
}
