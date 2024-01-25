import React from 'react';
import Papa from 'papaparse';

function LocalReader({ setData }: { setData: (data: any[]) => void }) {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Assert that the file is a CSV file
        if (file.type !== 'text/csv') {
            throw new Error('File must be a CSV file');
        }

        Papa.parse(file, {
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
            <input type="file" accept=".csv" onChange={handleFileChange} />
        </div>
    );
}

export default LocalReader;