import React from 'react';
import Papa from 'papaparse';

function LocalReader({ setData }: { setData: (data: any[]) => void }) {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            complete: (results) => {
                setData(results.data);
                //console.table(results.data);
            },
        });
    };

    return (
        <div>
            <input type="file" accept=".csv" onChange={handleFileChange} />
        </div>
    );
}

export default LocalReader;