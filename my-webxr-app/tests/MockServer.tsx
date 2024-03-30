import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import util from 'util';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('node:fs');

const readFile = util.promisify(fs.readFile);

// 1. Load the font file
const data = await readFile('./src/assets/sans-serif.normal.100.woff');
const fontFile = Uint8Array.from(data).buffer;

// 2. Describe network behavior with request handlers.
// Drei Text component doesn't contain the font file,
// it is fetched either through a FetchAPI or a XMLHttpRequest (uint8 arraybuffer response).
// (if we specify the 'font' attribute (font URL) in the Text component,
// the font will be fetched through a XMLHttpRequest,
// otherwise all fallback fonts will be fetched through FetchAPI)
// Thus, to test the Text component, we have to mock the font file request.
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

export default worker;
