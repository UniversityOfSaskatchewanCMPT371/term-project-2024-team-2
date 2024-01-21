import { test, expect } from '@playwright/test';
import { chromium, ChromiumBrowser, Page } from 'playwright';

test('has title', async () => {
    // Launch a new browser with the extension
    const browser: ChromiumBrowser = await chromium.launch({
        ignoreDefaultArgs: false,
        args: ['--disable-extensions-except=/path/to/extension/', '--load-extension=/Users/mitchellwagner/Library/Application Support/Google/Chrome/Default/Local Extension Settings/mjddjgeghkdijejnciaefnkjmkafnnje']
    });

    // Create a new context and grant permissions
    const context = await browser.newContext();
    await context.grantPermissions(['notifications'], 'chrome-extension://mjddjgeghkdijejnciaefnkjmkafnnje/');

    // Use the new context to create a new page
    const page: Page = await context.newPage();

    // Now you can interact with the page as before
    await page.goto('https://plockle.com/play/');
    expect(await page.content()).toContain('ENTER VR');

    // Don't forget to close the browser when you're done
    await browser.close();
});
