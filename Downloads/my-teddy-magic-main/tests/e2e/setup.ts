/**
 * E2E Test Setup
 * Initializes browser and page for testing
 */

import puppeteer, { Browser, Page } from 'puppeteer';
import { config } from './config';
import { PageHelpers } from './helpers/page-helpers';
import { AuthHelpers } from './helpers/auth-helpers';
import { APIHelpers } from './helpers/api-helpers';

export interface TestContext {
  browser: Browser;
  page: Page;
  helpers: {
    page: PageHelpers;
    auth: AuthHelpers;
    api: APIHelpers;
  };
}

let browser: Browser | null = null;
let testContext: TestContext | null = null;

/**
 * Initialize browser and create test context
 */
export async function setupTest(): Promise<TestContext> {
  if (testContext) {
    return testContext;
  }

  browser = await puppeteer.launch({
    headless: config.headless,
    slowMo: config.slowMo,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
    ],
  });

  const page = await browser.newPage();
  await page.setViewport(config.viewport);
  await page.setDefaultTimeout(config.timeout);

  // Set up request interception for API monitoring
  await page.setRequestInterception(true);
  page.on('request', (request) => {
    request.continue();
  });

  testContext = {
    browser,
    page,
    helpers: {
      page: new PageHelpers(page),
      auth: new AuthHelpers(page),
      api: new APIHelpers(page),
    },
  };

  return testContext;
}

/**
 * Cleanup after tests
 */
export async function teardownTest(): Promise<void> {
  if (testContext?.page) {
    await testContext.page.close();
  }
  if (browser) {
    await browser.close();
    browser = null;
  }
  testContext = null;
}

/**
 * Navigate to base URL
 */
export async function navigateToBase(context: TestContext): Promise<void> {
  await context.page.goto(config.baseUrl, { waitUntil: 'networkidle0' });
}

/**
 * Create a new page for isolated tests
 */
export async function createNewPage(): Promise<Page> {
  if (!browser) {
    throw new Error('Browser not initialized. Call setupTest() first.');
  }
  return await browser.newPage();
}

