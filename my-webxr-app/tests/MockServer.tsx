import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('node:fs');

const readFile = util.promisify(fs.readFile);

// 1. Load the font file
const data = await readFile('./src/assets/sans-serif.normal.100.woff');
const fontFile = Uint8Array.from(data).buffer;

// 2. Describe network behavior with request handlers.
const worker = setupServer(
  http.get(
    'https://cdn.jsdelivr.net/gh/lojjic/unicode-font-resolver@v1.0.1/packages/data/*',
    async () => HttpResponse.arrayBuffer(fontFile, {
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
