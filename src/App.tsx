import { useState } from 'react';
import LocalReader from './components/LocalReader.tsx';
import UrlReader from './components/UrlReader.tsx';

function App() {
    const [data, setData] = useState<any[]>([]);

    return (
        <div>
            <LocalReader setData={setData} />
            <UrlReader setData={setData} />
            <button onClick={() => console.table(data)}>Print Data</button>
        </div>
    );
}

export default App;