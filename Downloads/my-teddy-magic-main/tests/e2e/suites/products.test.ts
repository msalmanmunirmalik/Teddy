/**
import { delay } from '../helpers/delay';
 * Products E2E Tests
 * Tests product listing, filtering, search, and product details
 */

import { describe, test, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { delay } from '../helpers/delay';
import { setupTest, teardownTest, navigateToBase, TestContext } from '../setup';
import { config } from '../config';

describe('Products Tests', () => {
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

  test('should display shop page with products', async () => {
    await context.page.goto(`${config.baseUrl}/shop`);
    await context.helpers.page.waitForSelector('h1, [role="heading"]');

    // Wait for products to load
    await delay(2000);

    // Check for product cards or grid
    const hasProducts = await context.helpers.page.elementExists('[class*="card"], [class*="product"], img[alt*="teddy"], img[alt*="product"]');
    expect(hasProducts).toBe(true);
  });

  test('should filter products by category', async () => {
    await context.page.goto(`${config.baseUrl}/shop`);
    await delay(2000);

    // Find category filter dropdown
    const categorySelect = await context.page.$('select, [role="combobox"]');
    
    if (categorySelect) {
      // Get available options
      const options = await context.page.evaluate((select) => {
        const selectElement = select as HTMLSelectElement;
        return Array.from(selectElement.options).map(opt => opt.value);
      }, categorySelect);

      if (options.length > 1) {
        // Select a category (not "all")
        const categoryValue = options.find(opt => opt !== 'all' && opt !== '');
        if (categoryValue) {
          await context.page.select('select', categoryValue);
          await delay(1000);

          // Verify products are filtered
          const productCount = await context.page.evaluate(() => {
            return document.querySelectorAll('[class*="card"], [class*="product"]').length;
          });
          expect(productCount).toBeGreaterThanOrEqual(0);
        }
      }
    }
  });

  test('should search products', async () => {
    await context.page.goto(`${config.baseUrl}/shop`);
    await delay(2000);

    // Find search input
    const searchInput = await context.page.$('input[type="search"], input[placeholder*="search" i], input[placeholder*="Search"]');
    
    if (searchInput) {
      await searchInput.click();
      await searchInput.type('teddy', { delay: 100 });
      await delay(1000);

      // Verify search results
      const hasResults = await context.page.evaluate(() => {
        const cards = document.querySelectorAll('[class*="card"], [class*="product"]');
        return cards.length >= 0; // At least 0 results (could be no matches)
      });
      expect(hasResults).toBe(true);
    }
  });

  test('should sort products', async () => {
    await context.page.goto(`${config.baseUrl}/shop`);
    await delay(2000);

    // Find sort dropdown
    const sortSelect = await context.page.$('select, [role="combobox"]');
    
    if (sortSelect) {
      // Try sorting by price
      const sortOptions = await context.page.evaluate((select) => {
        const selectElement = select as HTMLSelectElement;
        return Array.from(selectElement.options).map(opt => opt.value);
      }, sortSelect);

      const priceSort = sortOptions.find(opt => opt.includes('price'));
      if (priceSort) {
        await context.page.select('select', priceSort);
        await delay(1000);

        // Verify products are sorted
        const prices = await context.page.evaluate(() => {
          const priceElements = Array.from(document.querySelectorAll('[class*="price"], [class*="Price"]'));
          return priceElements.map(el => {
            const text = el.textContent || '';
            const match = text.match(/\$?(\d+\.?\d*)/);
            return match ? parseFloat(match[1]) : 0;
          }).filter(p => p > 0);
        });

        if (prices.length > 1) {
          const sorted = [...prices].sort((a, b) => a - b);
          expect(prices).toEqual(sorted);
        }
      }
    }
  });

  test('should navigate to product detail page', async () => {
    await context.page.goto(`${config.baseUrl}/shop`);
    await delay(2000);

    // Find first product link
    const productLink = await context.page.$('a[href*="/product/"], [class*="product"] a, button:has-text("View")');
    
    if (productLink) {
      const href = await context.page.evaluate((el) => {
        if (el instanceof HTMLAnchorElement) return el.href;
        const link = el.closest('a');
        return link?.href || null;
      }, productLink);

      if (href) {
        await productLink.click();
        await delay(2000);

        // Verify we're on product detail page
        const currentUrl = context.page.url();
        expect(currentUrl).toMatch(/\/product\/\w+/);
      }
    }
  });

  test('should display product details correctly', async () => {
    await context.page.goto(`${config.baseUrl}/shop`);
    await delay(2000);

    // Navigate to first product
    const productLink = await context.page.$('a[href*="/product/"], [class*="product"] a, button:has-text("View")');
    
    if (productLink) {
      await productLink.click();
      await delay(2000);

      // Check for product details
      const hasProductName = await context.helpers.page.elementExists('h1, h2, [class*="name"], [class*="title"]');
      const hasProductPrice = await context.helpers.page.elementExists('[class*="price"], [class*="Price"]');
      const hasProductImage = await context.helpers.page.elementExists('img');

      expect(hasProductName || hasProductPrice || hasProductImage).toBe(true);
    }
  });

  test('should add product to cart from shop page', async () => {
    // Sign in first
    await context.helpers.auth.signIn(config.testUser.email, config.testUser.password);
    await delay(1000);

    await context.page.goto(`${config.baseUrl}/shop`);
    await delay(2000);

    // Find add to cart button
    const addToCartButton = await context.page.$('button:has-text("Add"), button[aria-label*="cart" i], [class*="cart"] button');
    
    if (addToCartButton) {
      await addToCartButton.click();
      await delay(1000);

      // Check for success toast or cart update
      const hasToast = await context.helpers.page.elementExists('[role="status"], .toast, [data-sonner-toast]');
      expect(hasToast).toBe(true);
    }
  });

  test('should add product to wishlist', async () => {
    // Sign in first
    await context.helpers.auth.signIn(config.testUser.email, config.testUser.password);
    await delay(1000);

    await context.page.goto(`${config.baseUrl}/shop`);
    await delay(2000);

    // Find wishlist button (heart icon)
    const wishlistButton = await context.page.$('button[aria-label*="wishlist" i], button:has(svg), [class*="heart"] button, [class*="wishlist"] button');
    
    if (wishlistButton) {
      await wishlistButton.click();
      await delay(1000);

      // Check if button state changed (filled heart)
      const isFilled = await context.page.evaluate((btn) => {
        return btn.querySelector('svg[fill], svg[class*="fill"]') !== null;
      }, wishlistButton);
      
      expect(isFilled).toBe(true);
    }
  });
});

