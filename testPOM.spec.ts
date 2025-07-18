import {test, expect, Browser, BrowserContext, Page, Locator, Response, Download, ElementHandle} from "@playwright/test";
import { loginPage } from "../pages/loginPage";
import homePage from "../pages/homePage";
import * as cartPage from "../pages/cartPage";

test('login page with pom', async ({page}) => {
    const navResponse: Response | null = await page.goto('https://freelance-learn-automation.vercel.app/login');
    if(navResponse === null || !navResponse.ok()) return;
    const testLoginPage = new loginPage(page);
    await testLoginPage.signInWithCredentials({userName: 'thesht@gmail.com', password: 'tesht@123'});
    await page.pause();
})

test('add to cart test', async ({page}) => {
    const navResponse: Response | null = await page.goto('https://freelance-learn-automation.vercel.app/login');
    if(navResponse === null || !navResponse.ok()) return;
    const testLoginPage:loginPage = new loginPage(page);
    await testLoginPage.signInWithCredentials({userName: 'thesht@gmail.com', password: 'tesht@123'});
    const testHomepage:homePage = new homePage(page);
    //now we will get item card which has name selenium. We will extract price from card and match it with what is shown in cart
    const itemName: string = 'selenium'
    const itemPrice: number = await testHomepage.getItemPrice(itemName);
    await testHomepage.addItemToCart(itemName);
    await testHomepage.clickCart();
    const testCartPage:cartPage.default = new cartPage.default(page);
    const cartTotal: number = await testCartPage.getCartTotalAmt();
    expect(cartTotal).toBe(itemPrice);
    page.close();
})

    

    test('calendar', async ({page}) => {
        test.setTimeout(0);
     try {
        const navResponse: Response | null = await page.goto('https://www.lambdatest.com/selenium-playground/bootstrap-date-picker-demo', {waitUntil: "domcontentloaded"});
        if(navResponse !== null && navResponse.ok()) {
            const dobInput:Locator = page.getByPlaceholder('Start date');
            const currentDate : Date = new Date();
            const givenDate: Date = new Date('2025-07-18');
            //travel count logic to figure out how many times button has to be clicked
            let travelCount: number = Math.abs(currentDate.getFullYear()-givenDate.getFullYear()) * 12;
            const diffOfMonths: number = currentDate.getMonth()-givenDate.getMonth();
            
            await dobInput.focus();
            const datePicker:Locator = page.locator('.datepicker-days');
            let actionBtn: Locator | null = null;
            const diffOfYears: number = givenDate.getFullYear() - currentDate.getFullYear();
            //logic to pick left arrow or right arrow button
            if(  diffOfYears < 0 || (diffOfYears == 0 && diffOfMonths < 0)) {
                actionBtn = datePicker.locator('.prev');
                travelCount += diffOfMonths;//add the difference (which could be +ve or -ve)
            }
            else if(diffOfYears > 0 || (diffOfYears == 0 && diffOfMonths > 0)) {
                actionBtn = datePicker.locator('.next');
                travelCount -= diffOfMonths;//substract the difference (which could be +ve or -ve)
            }

            if(actionBtn) {
                for(let idx=0;idx < travelCount; idx++)    
                    await actionBtn.click();
            }
            const calendarArea: Locator = datePicker.locator('tbody');
            
            const date = givenDate.getDate();
            //dynamic regex as we want to match exact text "2" only (but not "22", "20"..etc)
            const regEx: RegExp = new RegExp('^'+date+'$');
            //current month day which is clickable is being picked
            const dayBtn: Locator = calendarArea.locator('.day:not(.old):not(.new):not(.disabled-date)').filter({hasText: regEx});
            const count = await dayBtn.count();

            if(count == 0) throw Error('Invalid date selected');
            await dayBtn.click();
            await page.waitForTimeout(5000);
        }
    } catch(e: unknown) {
        if(e instanceof Error)
            console.log('errored out ', e.message);
    }

    page.close();
})


test('testing file download', async ({page}) => {
    const navResponse: Response | null = await page.goto('https://www.lambdatest.com/selenium-playground/generate-file-to-download-demo');
    if(navResponse !== null && navResponse.ok()) {
        const textBox: Locator = page.locator('#textbox');
        await textBox.pressSequentially('PlayWright generated sample file text'); //this is need for our aut as it is built around keydown event
        const createFileBtn: Locator = page.locator('#create');
        await createFileBtn.click();
        const links:Locator = page.locator('a');
        const downloadBtn:Locator = links.getByText('Download', {exact: true});

        //similar to multi window handling, we need both to START at once
        const [downloadFile] : [Download, void]= await Promise.all([page.waitForEvent('download'), downloadBtn.click()])
        await downloadFile.saveAs('./'+downloadFile.suggestedFilename());
    }
    page.close();
})

    test('dynamic drop down', async ({page}) => {
        const nav : Response | null = await page.goto('https://www.redbus.in/');
        if(nav === null || !nav.ok()) {
            page.close();
            return;
        }
        try {
            const widgetContainer: Locator = page.locator('div[data-autoid="searchWidget"]');
            const srcDestWrapper: Locator = page.getByRole('button',{name: 'From'});
            await srcDestWrapper.click();
            await page.waitForSelector('input[id="srcDest"]');
            //above waitForSelector returns HTMLElement object, which I cannot use as I need locator, so locating again with locator function
            const fromInput:Locator = page.locator('input[id="srcDest"]');
            await fromInput.focus();
            await fromInput.fill('Delhi');
            const suggestionsContainer:Locator = page.locator('div[class^="searchSuggestionWrapper"]');
            const suggestItem: Locator = suggestionsContainer.locator('div[class ^= "listItem"]').filter({hasText: 'Majnu'});
            await suggestItem.click();
            await page.waitForTimeout(3000);
        } catch(e) {console.log(e);}
    
        page.close();
    })
