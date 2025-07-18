import {test, expect, Browser, Page, Locator, BrowserContext, Response} from "@playwright/test";
import {chromium, webkit, firefox} from "@playwright/test";

interface User_Credentials {
    name: string,
    emailId: string,
    password: string
}

interface User {
    credentials: User_Credentials
}


const USERS : User[] = [ 
                        {
                            credentials: {
                                name: 'first user',
                                emailId: 'thesht@gmail.com',
                                password: ''
                            }
                        }, {
                            credentials: {
                                name: 'second user',
                                emailId: 'tesht@gmail.com',
                                password: ''
                            }
                        }
                     ];

test("simulating a chat app by login two users simultanously", async () => {
    const chromeBrowser: Browser = await chromium.launch({headless: true});

    for(let idx=0; idx < USERS.length; idx++) {
        const currentUser = USERS[idx];
            //open the light weight instance with incongnito mode
            //newContext() function accepts optional parameter, BrowserContextOptions - network mocking, auth & session storage, device (mobile) emulation
            const currentUserContext: BrowserContext = await chromeBrowser.newContext();
            const currentUserContextPage: Page = await currentUserContext.newPage();
        const currentUserPageNavResponse: Response | null = await currentUserContextPage.goto(`https://naveenautomationlabs.com/opencart/index.php?route=account/login`,{waitUntil: "domcontentloaded"});

        if(currentUserPageNavResponse !== null && currentUserPageNavResponse.ok()) {
            const emailInputElement:Locator = currentUserContextPage.locator('#input-email');
            await emailInputElement.fill(currentUser.credentials.emailId);
            const passwordInputElement:Locator = currentUserContextPage.locator('#input-password');
            await passwordInputElement.fill(currentUser.credentials.password);

            const loginBtn: Locator = currentUserContextPage.locator('input[value="Login"]');
            await loginBtn.click();
            // await currentUserContextPage.pause();
            const currentPagetitle = await currentUserContextPage.title();
            expect(currentPagetitle).toBe('My Account');
            await currentUserContextPage.close();
            await currentUserContext.close()
        }

    }
    chromeBrowser.close()
})
