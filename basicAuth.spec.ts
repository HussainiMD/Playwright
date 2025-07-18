import {test, expect, Browser, BrowserContext, Response, Page, Locator, chromium, firefox, webkit} from "@playwright/test";

test("Basic Authentication of a website", async () => {
    const browser: Browser = await firefox.launch({headless: true});
    const page: Page = await browser.newPage();
    const encodedCredentials: string = btoa(`admin:admin`);
    await page.setExtraHTTPHeaders({Authorization: `Basic ${encodedCredentials}`});
    const response: Response | null = await page.goto('https://the-internet.herokuapp.com/basic_auth');
    // await page.pause();
    if(response === null || !response.ok()) console.warn(response);
    else {
        const contentElem: Locator = page.locator('#content p');
        const txt: string | null = await contentElem.textContent();
        //get the page content where it gives confirmation and validate it
        expect(txt?.trim().startsWith('Congratulations')).toBe(true);
    }
})
