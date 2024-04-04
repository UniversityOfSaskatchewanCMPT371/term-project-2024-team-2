/* eslint-disable @typescript-eslint/no-var-requires */

/* We need to 'require' these instead of 'import'ing them since this runs in a browser context,
 * not a Node.js context, but these are Node.js libraries. This trick allows us to still access the
 * filesystem like Node.js does, but in the browser environment of Vitest.
 */
const fs = require('fs');
const readline = require('readline');

/**
 * Evaluates whether the testing log contains the text
 * @pre-condition the file 'src/smoketest/testLog.txt' must exist
 * @post-condition returns a boolean of whether a piece of text is in the file
 * @param {string} text a piece of text
 * @return {Promise<boolean>} a boolean of whether a piece of text is in the file
 * @constructor
 */
export default async function ContainText(text: string): Promise<boolean> {
  const filePath = 'smoketests/testLog.txt';

  const reader = readline.createInterface({
    input: fs.createReadStream(filePath),
    output: process.stdout,
    terminal: false,
  });

  return new Promise<boolean>((resolve) => {
    reader.on('line', (line: string) => {
      if (line.toLowerCase().includes(text.toLowerCase())) {
        resolve(true);
      }
    });

    reader.on('close', () => {
      resolve(false);
    });
  });
}
