//Both these imports are most common across tests
import {test, expect, Browser, Page, Response, Locator} from "@playwright/test";
import {webkit, chromium, firefox} from "playwright";


test("Sucessful login of the user with valid credentials", async ({}) => {
    //headed mode because we want to see visible actions
    //return instance of firefox browser instance (object)
    // always use types (don't forget). so we will be specifying type of return object.
    const ffBrowser: Browser = await firefox.launch({headless: true});
    //returns a page instance (object)
    const browserPage: Page = await ffBrowser.newPage();
    const gotoResponse: Response | null = await browserPage.goto(`https://naveenautomationlabs.com/opencart/index.php?route=account/login`);

    //RESPONSE can be null if there are issues in navigating to URL, hence the check
    if(gotoResponse !== null && gotoResponse.ok()) {
        const emailInput:Locator =  browserPage.locator('#input-email');
        //we use page locator to get UI elements from page. Here we are using CSS selectors
        const passwordInput:Locator = browserPage.locator('#input-password');
        const loginBtn =  browserPage.locator('[value="Login"]');
        //now, we will do actions of filling the input and clicking the buttons
        //all these are asynchronous operations hence await 
        await emailInput.fill('thesht@gmail.com');
        await passwordInput.fill('tesht');
        await loginBtn.click();
        //we can even get screeshot simply like this. Path is important without which it will NOT work
        await browserPage.screenshot({path: './test-results/login-page.jpg'});
        const pageTitle = await browserPage.title();
        //need to write better assertions :-)
        expect(pageTitle).toEqual('My Account');
        //this is also asynchronous operation but we will not wait as there is NO point, we can as well complete this code execution
        browserPage.close();
    }
});
