import {test, expect, Response, Browser, BrowserContext, Page, Locator, chromium, firefox, webkit, ElementHandle, FrameLocator} from "@playwright/test";
import path from "path";

test('sampling all the locators in playwright', async () => {
    const chromeBrowser = await chromium.launch({headless: false, channel: 'chrome'});
    const page: Page = await chromeBrowser.newPage({acceptDownloads: false});
    const navResponse: Response | null = await page.goto('https://naveenautomationlabs.com/opencart/index.php?route=account/register',{waitUntil: "domcontentloaded"});

    if(navResponse !== null && navResponse.ok()) {
        //get the top level element, which is form. Under form we will look for input elements
        const registrationForm: Locator = page.locator('.form-horizontal');
        
        //default is CSS selector, so it works
        const firstName: Locator = registrationForm.locator('#input-firstname');        
        if(await firstName.count() > 0)  await firstName.fill('Mr.'); //by count we ensure that element is found but THIS CHECK IS WRONG
        
        //Using "id=" option
        const lastName: Locator = registrationForm.locator('id=input-lastname');
        if(await lastName.count() > 0)   await lastName.fill('Robot');
        
        //by default, it expect CSS selectors
        const searchInput : Locator = page.locator('.form-control.input-lg')
        if(await searchInput.count() > 0)   await searchInput.fill('laptop');
        
        //as default is css selector, it WORK WITHOUT "css=" before this locator search
        const emailInput: Locator = page.locator('css=[type=email].form-control');
        if(await emailInput.count() > 0)    await emailInput.fill('test@gmail.com');

        //using "XPATH=" option
        const phoneInput : Locator = page.locator('xpath=//input[@id="input-telephone"]');        
        if(await phoneInput.count() > 0)    await phoneInput.fill('8884450044');

        //Using "text=" option.  This is MOST USEFUL. This is not simple by using normal CSS selectors
        const continueBtn: Locator = page.locator('text=continue');
        if(await continueBtn.count() > 0) await continueBtn.click();

        await page.pause();
    } else console.log('Unable to navigate to the provided url :: details : ' + navResponse?.statusText);

})


test('custom test id as locator selector', async () => {
    const msEdge: Browser = await chromium.launch({headless: false, channel: 'msedge'});
    const page: Page = await msEdge.newPage();
    const navResponse: Response | null = await page.goto('http://localhost:1234/posts',{waitUntil: "domcontentloaded"});
    if(navResponse !== null && navResponse.ok()) {
        // const searchBox: Locator = page.locator('[type="text"][name="title"]');
        const searchBox: Locator = page.getByRole('textbox', {name: 'title'});
        await searchBox.fill('biryani');

        // const showTopBtn: Locator = page.getByTestId('classic');
        const showTopBtn: Locator = page.getByRole('checkbox', {name: 'classic'});
        expect(showTopBtn).toBeVisible({visible: true});
        await showTopBtn.click();
        await page.pause();

    } else console.log('unable to navigate to the given page, Errror:'+navResponse?.statusText);
})


test('select option testing in playwright', async () => {
    const chromeBrowser: BrowserContext = await chromium.launchPersistentContext('', {headless: false, channel:'chrome'});
    const page: Page = chromeBrowser.pages()[0];
    const navResponse: Response | null = await page.goto('https://naveenautomationlabs.com/opencart/index.php?route=product/category&path=18');
    if(navResponse !== null && navResponse.ok()) {
        //to access elements collection by using CSS selector
        // const options: ElementHandle<SVGElement | HTMLElement>[] = await page.$$('#input-sort > option');
        //we can access by "lable" (TEXT DISPLAYED TO USER ON PAGE) in input-sort select drop down
        await page.selectOption('#input-sort', {label: 'INDIA'});

        await page.pause();
    }
})


test('Mouse over in playwright', async () => {
    const webKitBrowser: Browser = await chromium.launch({headless: false});
    const page: Page = await webKitBrowser.newPage();
    const navResponse: Response | null = await page.goto('https://www.bigbasket.com/', {waitUntil: "domcontentloaded"});
    if(navResponse !== null && navResponse.ok()) {        

        const shopByBtn: Locator = page.getByText('Shop byCategory');
        await shopByBtn.nth(1).click();
        await page.waitForTimeout(2000);
        const navContainer:Locator = page.locator('id=headlessui-menu-items-:Rimkj6:');
        const foodCourtBtn: Locator = navContainer.locator('text=Food Court');
        await foodCourtBtn.hover();
        await page.waitForTimeout(2000);
        const coldBeveragesBtn: Locator = navContainer.locator('text=Cold Beverages');
        await coldBeveragesBtn.hover();
        await page.waitForTimeout(2000);
        const icedTeaBtn: Locator = navContainer.locator('text=Iced Tea');
        await icedTeaBtn.click();
        await page.waitForTimeout(10000);
    }
})


test('mouse events testing', async () => {
    const chromeBrowser: Browser = await chromium.launch({headless: false, channel: "chrome"});
    const page: Page = await chromeBrowser.newPage();
    const navResponse: Response | null = await page.goto('https://demo.guru99.com/test/simple_context_menu.html');
    if(navResponse !== null && navResponse.ok()) {
        const contextMenuBtn: Locator = page.locator('.context-menu-one');
        await contextMenuBtn.click({button: "right"});
        await page.waitForTimeout(2000);
        const editBtn: Locator = page.locator('.context-menu-icon-edit');
        await editBtn.click();
        const doubleClickBtn: Locator = page.locator('text=Double-Click Me To See Alert');
        console.log(await doubleClickBtn.textContent());
        await doubleClickBtn.focus();
        await page.waitForTimeout(2000);
        await doubleClickBtn.dblclick({button: "left"});
        await page.pause();        
    }
})

test('mouse hover and click', async () => {
    const firefoxBrowser: Browser = await firefox.launch({headless: false});
    const page:Page = await firefoxBrowser.newPage();
    const navResponse: Response | null = await page.goto("https://www.spicejet.com/");

    if(navResponse !== null && navResponse.ok()) {        
        const addOnsBtn:Locator = page.getByText('Add-ons').first();
        await addOnsBtn.hover();
        await page.waitForTimeout(2000);
        const visaServicesBtn:Locator = page.getByTestId('test-id-Visa Services');
        console.log(await visaServicesBtn.all());        
        await visaServicesBtn.click();
        await page.waitForTimeout(5000);
    }

})

test('drag drop testing', async () => {
    const firefoxBrowser: Browser = await chromium.launch({headless: false, channel: 'chrome'});
    const page:Page = await firefoxBrowser.newPage();
    const navResposne : Response | null = await page.goto('https://jqueryui.com/resources/demos/droppable/default.html');
    
    if(navResposne !== null && navResposne.ok()) {
        // await page.locator('#draggable').dragTo(page.locator('#droppable'));
        
        await page.locator('#draggable').hover();
        await page.mouse.down();
        await page.waitForTimeout(3000);
        await page.locator('#droppable').hover();
        await page.mouse.up();
        await page.waitForTimeout(3000);
    }
})

test('search box with delayed keys', async () => {
    const webkitBrowser: Browser = await webkit.launch();
    const page:Page = await webkitBrowser.newPage();
    const navResponse: Response | null = await page.goto('https://www.flipkart.com/', {waitUntil: "domcontentloaded"});
    if(navResponse !== null && navResponse.ok()) {
        const searchBox : Locator = page.getByPlaceholder('Search for Products, Brands and More');
        await page.waitForTimeout(3000);
        //"delay" is optional argument. By default it is ZERO
        await searchBox.pressSequentially('Android', {delay: 10});
        await page.waitForTimeout(3000);
    }
})


test('single and multi file uploads', async () => {
    const chromeBrowser: Browser = await chromium.launch({headless: false, channel: 'chrome'});
    const page:Page = await chromeBrowser.newPage();
    const nav: Response| null = await page.goto('https://davidwalsh.name/demo/multiple-file-upload.php');
    const baseDir: string = 'C:\\Projects_Work_Space\\PlayWright\\first_project\\';

    if(nav !== null && nav.ok()) {
        const fileUploadBtn: Locator = page.locator('id=filesToUpload');
        console.log(path.join(''));
        await fileUploadBtn.setInputFiles([
            path.join(baseDir,'tsconfig.json'),
            path.join(baseDir, 'package.json')
        ]);
        await page.waitForTimeout(5000);
    }
})


test('keyboard actions', async () => {
    const firefoxBrowser: Browser = await firefox.launch({headless: false});
    const page: Page = await firefoxBrowser.newPage();
    const navResponse: Response | null = await page.goto('https://www.google.com/');
    if(navResponse === null || !navResponse.ok()) {
        console.log('unable to load the page');
        return;
    }

    const searchBox: Locator = page.locator('textarea[title="Search"]');
    await searchBox.focus();
    await page.keyboard.type('Hello There!');    
    
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.down('Shift');
    for(let idx=0; idx < 5; idx++) {
        await page.keyboard.down('ArrowLeft');
    }
    await page.keyboard.up('Shift');
    await page.keyboard.press('Backspace');
    await page.waitForTimeout(5000);
})


test('Frame Locator sample', async () => {
    const chromeBrowser: Browser = await chromium.launch({headless: false});
    const page:Page = await chromeBrowser.newPage();
    const navResponse: Response | null = await page.goto('https://www.w3schools.com/js/tryit.asp?filename=tryjs_intro_lightbulb', {waitUntil: "domcontentloaded"});
    if(navResponse === null || !navResponse.ok()) throw new Error('Page not found');

    const resultFrame: FrameLocator = page.frameLocator('#iframeResult');
    const turnOnBtn: Locator = resultFrame.getByText('Turn on the light', {exact: true});
    await turnOnBtn.click();
    await page.waitForTimeout(2000);
    const turnOffBtn: Locator = resultFrame.getByText('Turn off the light', {exact: true});
    await turnOffBtn.click();
    await page.waitForTimeout(1000);
})


test('multi tab testing', async ({browser}) => {
    const newBrowserContext:BrowserContext = await browser.newContext({colorScheme: 'dark'});
    const page:Page = await newBrowserContext.newPage();
    try {
        const navResponse: Response | null = await page.goto('https://www.interviewai.io/', {timeout: 50000});
        if(navResponse !== null && navResponse.ok()) {
            const twitterBtn: Locator = page.locator('a[href *= "twitter"]');
            if(await twitterBtn.isVisible()) {                
                await twitterBtn.click();
                // await page.waitForTimeout(1000);
                /*const newPage: Page = await newBrowserContext.waitForEvent('page');
                await followBtn.click();*/
                const [newPage] = await Promise.all([
                    newBrowserContext.waitForEvent('page'), 
                    twitterBtn.click()]
                );
                const followBtn: Locator = newPage.getByText('Follow', {exact: true});
                await page.waitForTimeout(1000);
                await newPage.close()
            }
        }
    } catch(e) {
        console.log(e)
    }
    finally {
        console.log('finally block executed');
        page.close();
        browser.close();
    }
})

interface boundingBoxParamInterface {
    x: number,
    y: number,
    width: number,
    height: number
}

test('Complex Realtime Slider', async ({page}) => {
    page.setDefaultTimeout(60000);
    const navResponse: Response | null = await page.goto('https://www.flipkart.com/');
    if(navResponse !== null && navResponse.ok()) {        
        const mobileImg: Locator = page.locator('xpath=//div[@id="container"]/div/div[1]/div/div/div/div/div/div/div/div/div/div[2]/div[1]/div/div[3]/div/div/div/div/div/div/div[2]/div/div/div/div[1]/div/div/div/a/div/div/div[1]/picture/img');
        await mobileImg.click();
        await page.waitForLoadState('networkidle');
        const parentContainer:Locator = page.locator('xpath=//div[@id="container"]/div/div[3]/div/div[1]/div/div[1]/div/section[2]/div[3]/div[1]');
        const sliderRightBtn: Locator = parentContainer.locator('xpath=//div[2]/div');
        const sliderRightBtnPosition: null | boundingBoxParamInterface = await sliderRightBtn.boundingBox();
        
        if(sliderRightBtnPosition !== null) {
            let x: number = sliderRightBtnPosition.x + (sliderRightBtnPosition.width/2);
            let y: number = sliderRightBtnPosition.y + (sliderRightBtnPosition.height/2);
            await page.mouse.move(x,y);
            await page.mouse.down();
            x = x - 50;
            await page.mouse.move(x, y);
            await page.mouse.up();
        }
                
        await page.waitForTimeout(500);
                
        const sliderLeftBtn: Locator = parentContainer.locator('xpath=//div[1]/div');                
        const sliderLeftBtnPosition: null | boundingBoxParamInterface = await sliderLeftBtn.boundingBox();
        
        if(sliderLeftBtnPosition !== null) {
            let x: number = sliderLeftBtnPosition.x + (sliderLeftBtnPosition.width/2);
            let y: number = sliderLeftBtnPosition.y + (sliderLeftBtnPosition.height/2);
            await page.mouse.move(x, y);
            await page.mouse.down();
            x = x + 70;            
            await page.mouse.move(x , y);                        
            await page.mouse.up();
        }
        
    }
    await page.waitForTimeout(3000);
    page.close();
})


