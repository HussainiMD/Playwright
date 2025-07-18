import {test, expect, Browser, Page, Locator, Response} from "@playwright/test";
import { webkit, chromium, firefox } from "@playwright/test";

enum InputType {
    Box,
    Button
}

interface InputDataEntry {
    type: InputType,
    cssSelector: string,
    entryValue?: string
}

const inputDataMap: InputDataEntry[] = [
    {type: InputType.Box, cssSelector: "#input-firstname", entryValue: "Mr"},
    {type: InputType.Box, cssSelector: "#input-lastname", entryValue: "Deedful"},
    {type: InputType.Box, cssSelector: "#input-email", entryValue: "thesht@gmail.com"},
    {type: InputType.Box, cssSelector: "#input-telephone", entryValue: "+91-8880040011"},
    {type: InputType.Box, cssSelector: "#input-password", entryValue: "tesht"},
    {type: InputType.Box, cssSelector: "#input-confirm", entryValue: "tesht"},
    {type: InputType.Button, cssSelector: "[name='newsletter'][value='0']"},
    {type: InputType.Button, cssSelector: "[name='agree'][value='1']"},
    {type: InputType.Button, cssSelector: "[type='submit'][value='Continue']"}
];


test("register a new user on registration page", async () => {
   const chromeBrowser: Browser = await chromium.launch({headless: true});
   const browserPage: Page =  await chromeBrowser.newPage();
   const navigationResponse: Response | null = await browserPage.goto(`https://naveenautomationlabs.com/opencart/index.php?route=account/register`);

   if(navigationResponse !== null && navigationResponse.ok()) {
     for(let idx=0;idx < inputDataMap.length; idx++) {
        const entry = inputDataMap[idx];
        const pageElement: Locator = browserPage.locator(entry.cssSelector);
        if(entry.type == InputType.Box) 
           await pageElement.fill(entry.entryValue || '');
        else if (entry.type === InputType.Button) 
            await pageElement.click();
        else console.warn(`Unknown input type ${entry.type}`);
     }
     await browserPage.screenshot({path: './test-results/register-page.jpg'});
     chromeBrowser.close();
   }
})
