import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('node:fs');

async function readFile() {
  const blob = await fs.openAsBlob('./src/assets/sans-serif.normal.100.woff');
  return blob.arrayBuffer();
}

const data = await readFile();
// 2. Describe network behavior with request handlers.
const worker = setupServer(
  http.get(
    'https://cdn.jsdelivr.net/gh/lojjic/unicode-font-resolver@v1.0.1/packages/data/*',
    async () => HttpResponse.arrayBuffer(data, {
      headers: {
        'Content-Type': 'font/woff',
      },
    }),
  ),
);

// to check if it's actually intercepting the requests
//   worker.events.on('request:start', ({ request }) => {
//     console.log('MSW intercepted:', request.method, request.url);
//   });

export default worker;
