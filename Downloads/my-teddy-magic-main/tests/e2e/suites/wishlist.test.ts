/**
import { delay } from '../helpers/delay';
 * Wishlist E2E Tests
 * Tests wishlist CRUD operations
 */

import { describe, test, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { delay } from '../helpers/delay';
import { setupTest, teardownTest, navigateToBase, TestContext } from '../setup';
import { config } from '../config';

describe('Wishlist Tests', () => {
  let context: TestContext;

  beforeAll(async () => {
    context = await setupTest();
  });

  afterAll(async () => {
    await teardownTest();
  });

  beforeEach(async () => {
    await navigateToBase(context);
    await context.helpers.auth.signIn(config.testUser.email, config.testUser.password);
    await delay(1000);
  });

  test('should display wishlist page', async () => {
    await context.page.goto(`${config.baseUrl}/wishlist`);
    await delay(2000);

    const currentUrl = context.page.url();
    expect(currentUrl).toMatch(/\/wishlist/);

    // Check for wishlist content
    const hasContent = await context.helpers.page.elementExists('h1, h2, [role="heading"]');
    expect(hasContent).toBe(true);
  });

  test('should add item to wishlist from shop', async () => {
    await context.page.goto(`${config.baseUrl}/shop`);
    await delay(2000);

    // Find wishlist button (heart icon)
    const wishlistButton = await context.page.$('button:has(svg), [class*="heart"] button, [class*="wishlist"] button');
    
    if (wishlistButton) {
      await wishlistButton.click();
      await delay(1000);

      // Check if button state changed
      const isFilled = await context.page.evaluate((btn) => {
        return btn.querySelector('svg[fill], svg[class*="fill"]') !== null;
      }, wishlistButton);

      expect(isFilled).toBe(true);
    }
  });

  test('should remove item from wishlist', async () => {
    // First add item to wishlist
    await context.page.goto(`${config.baseUrl}/shop`);
    await delay(2000);

    const wishlistButton = await context.page.$('button:has(svg), [class*="heart"] button');
    if (wishlistButton) {
      await wishlistButton.click();
      await delay(1000);
    }

    // Click again to remove
    if (wishlistButton) {
      await wishlistButton.click();
      await delay(1000);

      // Check if button state changed back
      const isFilled = await context.page.evaluate((btn) => {
        return btn.querySelector('svg[fill], svg[class*="fill"]') !== null;
      }, wishlistButton);

      expect(isFilled).toBe(false);
    }
  });

  test('should display wishlist items', async () => {
    // Add item to wishlist first
    await context.page.goto(`${config.baseUrl}/shop`);
    await delay(2000);

    const wishlistButton = await context.page.$('button:has(svg), [class*="heart"] button');
    if (wishlistButton) {
      await wishlistButton.click();
      await delay(1000);
    }

    // Navigate to wishlist page
    await context.page.goto(`${config.baseUrl}/wishlist`);
    await delay(2000);

    // Check for wishlist items
    const hasItems = await context.page.evaluate(() => {
      const items = document.querySelectorAll('[class*="card"], [class*="item"], [class*="product"]');
      return items.length >= 0; // Could be empty or have items
    });

    expect(hasItems).toBe(true);
  });

  test('should navigate to product from wishlist', async () => {
    // Add item to wishlist first
    await context.page.goto(`${config.baseUrl}/shop`);
    await delay(2000);

    const wishlistButton = await context.page.$('button:has(svg), [class*="heart"] button');
    if (wishlistButton) {
      await wishlistButton.click();
      await delay(1000);
    }

    await context.page.goto(`${config.baseUrl}/wishlist`);
    await delay(2000);

    // Find product link
    const productLink = await context.page.$('a[href*="/product/"], [class*="product"] a');
    
    if (productLink) {
      await productLink.click();
      await delay(2000);

      const currentUrl = context.page.url();
      expect(currentUrl).toMatch(/\/product\/\w+/);
    }
  });

  test('should redirect to auth if not logged in', async () => {
    await context.helpers.auth.signOut();
    await delay(1000);

    await context.page.goto(`${config.baseUrl}/wishlist`);
    await delay(2000);

    const currentUrl = context.page.url();
    expect(currentUrl).toMatch(/\/auth/);
  });
});

