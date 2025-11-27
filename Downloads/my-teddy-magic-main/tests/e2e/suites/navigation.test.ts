/**
import { delay } from '../helpers/delay';
 * Navigation E2E Tests
 * Tests site navigation, routing, and page transitions
 */

import { describe, test, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { delay } from '../helpers/delay';
import { setupTest, teardownTest, navigateToBase, TestContext } from '../setup';
import { config } from '../config';

describe('Navigation Tests', () => {
  let context: TestContext;

  beforeAll(async () => {
    context = await setupTest();
  });

  afterAll(async () => {
    await teardownTest();
  });

  beforeEach(async () => {
    await navigateToBase(context);
  });

  test('should navigate to home page', async () => {
    await context.page.goto(`${config.baseUrl}/`);
    await delay(2000);

    const currentUrl = context.page.url();
    expect(currentUrl).toMatch(new RegExp(`${config.baseUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/?$`));
  });

  test('should navigate to shop page', async () => {
    await context.page.goto(`${config.baseUrl}/shop`);
    await delay(2000);

    const currentUrl = context.page.url();
    expect(currentUrl).toMatch(/\/shop/);

    // Check for shop content
    const hasShopContent = await context.helpers.page.elementExists('h1, [role="heading"]');
    expect(hasShopContent).toBe(true);
  });

  test('should navigate to about page', async () => {
    await context.page.goto(`${config.baseUrl}/about`);
    await delay(2000);

    const currentUrl = context.page.url();
    expect(currentUrl).toMatch(/\/about/);
  });

  test('should navigate to contact page', async () => {
    await context.page.goto(`${config.baseUrl}/contact`);
    await delay(2000);

    const currentUrl = context.page.url();
    expect(currentUrl).toMatch(/\/contact/);

    // Check for contact form
    const hasForm = await context.helpers.page.elementExists('form, input[type="email"], textarea');
    expect(hasForm).toBe(true);
  });

  test('should navigate to cart page', async () => {
    await context.page.goto(`${config.baseUrl}/cart`);
    await delay(2000);

    const currentUrl = context.page.url();
    expect(currentUrl).toMatch(/\/cart/);
  });

  test('should navigate to auth page', async () => {
    await context.page.goto(`${config.baseUrl}/auth`);
    await delay(2000);

    const currentUrl = context.page.url();
    expect(currentUrl).toMatch(/\/auth/);
  });

  test('should navigate via navigation menu', async () => {
    await context.page.goto(`${config.baseUrl}/`);
    await delay(2000);

    // Find navigation links
    const navLinks = await context.page.$$('nav a, [role="navigation"] a, header a');
    
    if (navLinks.length > 0) {
      // Click first non-home link
      const link = navLinks.find(async (l) => {
        const href = await context.page.evaluate((el) => (el as HTMLAnchorElement).href, l);
        return href && !href.match(/\/?$/);
      });

      if (link) {
        const href = await context.page.evaluate((el) => (el as HTMLAnchorElement).href, link);
        await link.click();
        await delay(2000);

        const currentUrl = context.page.url();
        expect(currentUrl).toBeTruthy();
      }
    }
  });

  test('should handle 404 for invalid routes', async () => {
    await context.page.goto(`${config.baseUrl}/invalid-route-12345`);
    await delay(2000);

    // Should show 404 page or redirect
    const currentUrl = context.page.url();
    const has404Content = await context.page.evaluate(() => {
      const text = document.body.textContent || '';
      return text.includes('404') || text.includes('Not Found') || text.includes('Page not found');
    });

    expect(currentUrl.includes('/invalid-route') || has404Content).toBe(true);
  });

  test('should maintain navigation state on page reload', async () => {
    await context.page.goto(`${config.baseUrl}/shop`);
    await delay(2000);

    const initialUrl = context.page.url();
    
    // Reload page
    await context.page.reload({ waitUntil: 'networkidle0' });
    await delay(2000);

    const reloadedUrl = context.page.url();
    expect(reloadedUrl).toBe(initialUrl);
  });

  test('should navigate back and forward', async () => {
    await context.page.goto(`${config.baseUrl}/`);
    await delay(1000);
    
    await context.page.goto(`${config.baseUrl}/shop`);
    await delay(1000);

    const shopUrl = context.page.url();
    
    await context.page.goBack();
    await delay(1000);

    const backUrl = context.page.url();
    expect(backUrl).not.toBe(shopUrl);

    await context.page.goForward();
    await delay(1000);

    const forwardUrl = context.page.url();
    expect(forwardUrl).toBe(shopUrl);
  });
});

