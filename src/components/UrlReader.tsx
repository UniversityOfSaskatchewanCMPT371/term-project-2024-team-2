import React from 'react';
import Papa from 'papaparse';

function UrlReader({ setData }: { setData: (data: any[]) => void }) {
    const handleUrlChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const url = event.target.value;
        if (!url) throw new Error('URL cannot be empty');

        Papa.parse(url, {
            download: true,
            header: true,
            complete: (results) => {
                // Assert that the data is an array
                if (!Array.isArray(results.data)) {
                    throw new Error('Parsed data must be an array');
                }

                setData(results.data);
                //console.table(results.data);
            },
        });
    };

    return (
        <div>
            <input type="text" placeholder="Enter CSV URL" onChange={handleUrlChange} />
        </div>
    );
}

export default UrlReader;