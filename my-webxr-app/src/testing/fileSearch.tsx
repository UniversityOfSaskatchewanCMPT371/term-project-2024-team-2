import * as fs from 'fs';
import * as readline from 'readline';

export async function containsText(text: string): Promise<boolean> {
    const filePath = 'src/testing/testLog.txt';

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
