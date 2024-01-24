import React from 'react';
import Papa from 'papaparse';

function UrlReader({ setData }: { setData: (data: any[]) => void }) {
    const handleUrlChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const url = event.target.value;
        if (!url) return;

        Papa.parse(url, {
            download: true,
            header: true,
            complete: (results) => {
                setData(results.data);
                console.table(results.data);
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