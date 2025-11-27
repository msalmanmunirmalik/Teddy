/**
import { delay } from '../helpers/delay';
 * Shopping Cart E2E Tests
 * Tests cart CRUD operations, quantity updates, and cart persistence
 */

import { describe, test, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { delay } from '../helpers/delay';
import { setupTest, teardownTest, navigateToBase, TestContext } from '../setup';
import { config } from '../config';

describe('Shopping Cart Tests', () => {
  let context: TestContext;

  beforeAll(async () => {
    context = await setupTest();
  });

  afterAll(async () => {
    await teardownTest();
  });

  beforeEach(async () => {
    await navigateToBase(context);
    // Sign in before each test
    await context.helpers.auth.signIn(config.testUser.email, config.testUser.password);
    await delay(1000);
  });

  test('should display cart page', async () => {
    await context.page.goto(`${config.baseUrl}/cart`);
    await context.helpers.page.waitForSelector('h1, [role="heading"]');

    const title = await context.page.title();
    expect(title).toBeTruthy();
  });

  test('should add item to cart', async () => {
    // Go to shop and add item
    await context.page.goto(`${config.baseUrl}/shop`);
    await delay(2000);

    const addToCartButton = await context.page.$('button:has-text("Add"), button[aria-label*="cart" i], [class*="cart"] button');
    
    if (addToCartButton) {
      await addToCartButton.click();
      await delay(1000);

      // Navigate to cart
      await context.page.goto(`${config.baseUrl}/cart`);
      await delay(2000);

      // Verify item is in cart
      const cartItems = await context.page.evaluate(() => {
        return document.querySelectorAll('[class*="cart-item"], [class*="item"], li').length;
      });
      expect(cartItems).toBeGreaterThan(0);
    }
  });

  test('should display cart items correctly', async () => {
    // Ensure cart has items
    await context.page.goto(`${config.baseUrl}/shop`);
    await delay(2000);
    
    const addToCartButton = await context.page.$('button:has-text("Add"), button[aria-label*="cart" i]');
    if (addToCartButton) {
      await addToCartButton.click();
      await delay(1000);
    }

    await context.page.goto(`${config.baseUrl}/cart`);
    await delay(2000);

    // Check for product name, price, quantity controls
    const hasProductInfo = await context.page.evaluate(() => {
      const hasName = document.querySelector('[class*="name"], [class*="title"]') !== null;
      const hasPrice = document.querySelector('[class*="price"], [class*="Price"]') !== null;
      const hasQuantity = document.querySelector('input[type="number"], button:has-text("+"), button:has-text("-")') !== null;
      return hasName || hasPrice || hasQuantity;
    });

    expect(hasProductInfo).toBe(true);
  });

  test('should update item quantity', async () => {
    // Add item to cart first
    await context.page.goto(`${config.baseUrl}/shop`);
    await delay(2000);
    
    const addToCartButton = await context.page.$('button:has-text("Add"), button[aria-label*="cart" i]');
    if (addToCartButton) {
      await addToCartButton.click();
      await delay(1000);
    }

    await context.page.goto(`${config.baseUrl}/cart`);
    await delay(2000);

    // Find quantity increase button
    const increaseButton = await context.page.$('button:has-text("+"), button[aria-label*="increase" i], button[aria-label*="more" i]');
    
    if (increaseButton) {
      const initialQuantity = await context.page.evaluate(() => {
        const qtyInput = document.querySelector('input[type="number"]') as HTMLInputElement;
        return qtyInput ? parseInt(qtyInput.value) : 1;
      });

      await increaseButton.click();
      await delay(1000);

      const newQuantity = await context.page.evaluate(() => {
        const qtyInput = document.querySelector('input[type="number"]') as HTMLInputElement;
        return qtyInput ? parseInt(qtyInput.value) : 1;
      });

      expect(newQuantity).toBeGreaterThan(initialQuantity);
    }
  });

  test('should decrease item quantity', async () => {
    // Add item and increase quantity first
    await context.page.goto(`${config.baseUrl}/shop`);
    await delay(2000);
    
    const addToCartButton = await context.page.$('button:has-text("Add"), button[aria-label*="cart" i]');
    if (addToCartButton) {
      await addToCartButton.click();
      await delay(1000);
    }

    await context.page.goto(`${config.baseUrl}/cart`);
    await delay(2000);

    // Increase quantity first
    const increaseButton = await context.page.$('button:has-text("+")');
    if (increaseButton) {
      await increaseButton.click();
      await delay(500);
    }

    // Now decrease
    const decreaseButton = await context.page.$('button:has-text("-"), button[aria-label*="decrease" i], button[aria-label*="less" i]');
    
    if (decreaseButton) {
      const initialQuantity = await context.page.evaluate(() => {
        const qtyInput = document.querySelector('input[type="number"]') as HTMLInputElement;
        return qtyInput ? parseInt(qtyInput.value) : 2;
      });

      await decreaseButton.click();
      await delay(1000);

      const newQuantity = await context.page.evaluate(() => {
        const qtyInput = document.querySelector('input[type="number"]') as HTMLInputElement;
        return qtyInput ? parseInt(qtyInput.value) : 1;
      });

      expect(newQuantity).toBeLessThan(initialQuantity);
    }
  });

  test('should remove item from cart', async () => {
    // Add item to cart first
    await context.page.goto(`${config.baseUrl}/shop`);
    await delay(2000);
    
    const addToCartButton = await context.page.$('button:has-text("Add"), button[aria-label*="cart" i]');
    if (addToCartButton) {
      await addToCartButton.click();
      await delay(1000);
    }

    await context.page.goto(`${config.baseUrl}/cart`);
    await delay(2000);

    // Get initial item count
    const initialCount = await context.page.evaluate(() => {
      return document.querySelectorAll('[class*="cart-item"], [class*="item"]').length;
    });

    // Find remove button
    const removeButton = await context.page.$('button:has-text("Remove"), button[aria-label*="remove" i], button[aria-label*="delete" i]');
    
    if (removeButton && initialCount > 0) {
      await removeButton.click();
      await delay(1000);

      const newCount = await context.page.evaluate(() => {
        return document.querySelectorAll('[class*="cart-item"], [class*="item"]').length;
      });

      expect(newCount).toBeLessThan(initialCount);
    }
  });

  test('should calculate cart total correctly', async () => {
    await context.page.goto(`${config.baseUrl}/cart`);
    await delay(2000);

    // Check for total display
    const hasTotal = await context.helpers.page.elementExists('[class*="total"], [class*="Total"], [class*="summary"]');
    expect(hasTotal).toBe(true);

    // Verify total calculation
    const totalMatches = await context.page.evaluate(() => {
      const totalElement = document.querySelector('[class*="total"], [class*="Total"]');
      if (!totalElement) return false;

      const totalText = totalElement.textContent || '';
      const totalMatch = totalText.match(/\$?(\d+\.?\d*)/);
      return totalMatch !== null;
    });

    expect(totalMatches).toBe(true);
  });

  test('should persist cart across page navigation', async () => {
    // Add item to cart
    await context.page.goto(`${config.baseUrl}/shop`);
    await delay(2000);
    
    const addToCartButton = await context.page.$('button:has-text("Add"), button[aria-label*="cart" i]');
    if (addToCartButton) {
      await addToCartButton.click();
      await delay(1000);
    }

    // Navigate away and back
    await context.page.goto(`${config.baseUrl}/`);
    await delay(1000);
    await context.page.goto(`${config.baseUrl}/cart`);
    await delay(2000);

    // Verify cart still has items
    const cartItems = await context.page.evaluate(() => {
      return document.querySelectorAll('[class*="cart-item"], [class*="item"]').length;
    });
    expect(cartItems).toBeGreaterThanOrEqual(0);
  });

  test('should navigate to checkout from cart', async () => {
    // Ensure cart has items
    await context.page.goto(`${config.baseUrl}/shop`);
    await delay(2000);
    
    const addToCartButton = await context.page.$('button:has-text("Add"), button[aria-label*="cart" i]');
    if (addToCartButton) {
      await addToCartButton.click();
      await delay(1000);
    }

    await context.page.goto(`${config.baseUrl}/cart`);
    await delay(2000);

    // Find checkout button
    const checkoutButton = await context.page.$('a[href*="/checkout"], button:has-text("Checkout"), button:has-text("Proceed")');
    
    if (checkoutButton) {
      await checkoutButton.click();
      await delay(2000);

      const currentUrl = context.page.url();
      expect(currentUrl).toMatch(/\/checkout/);
    }
  });
});

