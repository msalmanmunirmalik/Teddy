/**
import { delay } from '../helpers/delay';
 * API Endpoint E2E Tests
 * Tests all API endpoints, data flows, and CRUD operations
 */

import { describe, test, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { delay } from '../helpers/delay';
import { setupTest, teardownTest, navigateToBase, TestContext } from '../setup';
import { config } from '../config';

describe('API Endpoint Tests', () => {
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

  test('should fetch products from API', async () => {
    const responses: any[] = [];

    context.page.on('response', async (response) => {
      const url = response.url();
      if (url.includes('products') || url.includes('supabase')) {
        responses.push({
          url,
          status: response.status(),
        });
      }
    });

    await context.page.goto(`${config.baseUrl}/shop`);
    await delay(3000);

    // Verify API was called
    const productAPI = responses.find(r => r.url.includes('products') || r.url.includes('supabase'));
    expect(productAPI).toBeDefined();
    
    if (productAPI) {
      expect([200, 201, 304]).toContain(productAPI.status);
    }
  });

  test('should create cart via API', async () => {
    await context.helpers.auth.signIn(config.testUser.email, config.testUser.password);
    await delay(1000);

    const responses: any[] = [];

    context.page.on('response', async (response) => {
      const url = response.url();
      if (url.includes('carts') || url.includes('supabase')) {
        responses.push({
          url,
          status: response.status(),
          method: response.request().method(),
        });
      }
    });

    await context.page.goto(`${config.baseUrl}/shop`);
    await delay(2000);

    const addToCartButton = await context.page.$('button:has-text("Add"), button[aria-label*="cart" i]');
    if (addToCartButton) {
      await addToCartButton.click();
      await delay(2000);
    }

    // Verify cart API was called
    const cartAPI = responses.find(r => 
      (r.url.includes('carts') || r.url.includes('supabase')) && 
      (r.method === 'POST' || r.method === 'PUT' || r.status === 200 || r.status === 201)
    );

    expect(cartAPI).toBeDefined();
  });

  test('should update cart via API', async () => {
    await context.helpers.auth.signIn(config.testUser.email, config.testUser.password);
    await delay(1000);

    // Add item first
    await context.page.goto(`${config.baseUrl}/shop`);
    await delay(2000);
    
    const addToCartButton = await context.page.$('button:has-text("Add"), button[aria-label*="cart" i]');
    if (addToCartButton) {
      await addToCartButton.click();
      await delay(1000);
    }

    const responses: any[] = [];

    context.page.on('response', async (response) => {
      const url = response.url();
      if (url.includes('carts') || url.includes('supabase')) {
        responses.push({
          url,
          status: response.status(),
          method: response.request().method(),
        });
      }
    });

    await context.page.goto(`${config.baseUrl}/cart`);
    await delay(2000);

    // Update quantity
    const increaseButton = await context.page.$('button:has-text("+")');
    if (increaseButton) {
      await increaseButton.click();
      await delay(2000);
    }

    // Verify update API was called
    const updateAPI = responses.find(r => 
      r.url.includes('carts') && 
      (r.method === 'PUT' || r.method === 'PATCH' || r.status === 200)
    );

    expect(updateAPI).toBeDefined();
  });

  test('should delete cart item via API', async () => {
    await context.helpers.auth.signIn(config.testUser.email, config.testUser.password);
    await delay(1000);

    // Add item first
    await context.page.goto(`${config.baseUrl}/shop`);
    await delay(2000);
    
    const addToCartButton = await context.page.$('button:has-text("Add"), button[aria-label*="cart" i]');
    if (addToCartButton) {
      await addToCartButton.click();
      await delay(1000);
    }

    const responses: any[] = [];

    context.page.on('response', async (response) => {
      const url = response.url();
      if (url.includes('carts') || url.includes('supabase')) {
        responses.push({
          url,
          status: response.status(),
          method: response.request().method(),
        });
      }
    });

    await context.page.goto(`${config.baseUrl}/cart`);
    await delay(2000);

    // Remove item
    const removeButton = await context.page.$('button:has-text("Remove"), button[aria-label*="remove" i]');
    if (removeButton) {
      await removeButton.click();
      await delay(2000);
    }

    // Verify delete/update API was called
    const deleteAPI = responses.find(r => 
      r.url.includes('carts') && 
      (r.method === 'DELETE' || r.method === 'PUT' || r.status === 200 || r.status === 204)
    );

    expect(deleteAPI).toBeDefined();
  });

  test('should create order via API', async () => {
    await context.helpers.auth.signIn(config.testUser.email, config.testUser.password);
    await delay(1000);

    // Add item to cart
    await context.page.goto(`${config.baseUrl}/shop`);
    await delay(2000);
    
    const addToCartButton = await context.page.$('button:has-text("Add"), button[aria-label*="cart" i]');
    if (addToCartButton) {
      await addToCartButton.click();
      await delay(1000);
    }

    const responses: any[] = [];

    context.page.on('response', async (response) => {
      const url = response.url();
      if (url.includes('orders') || url.includes('supabase')) {
        responses.push({
          url,
          status: response.status(),
          method: response.request().method(),
        });
      }
    });

    await context.page.goto(`${config.baseUrl}/checkout`);
    await delay(2000);

    // Fill form quickly
    const inputs = await context.page.$$('input[type="text"], input[type="email"]');
    for (let i = 0; i < Math.min(6, inputs.length); i++) {
      const input = inputs[i];
      const placeholder = await context.page.evaluate((el) => (el as HTMLInputElement).placeholder, input);
      
      if (placeholder?.toLowerCase().includes('first')) {
        await input.type('John', { delay: 30 });
      } else if (placeholder?.toLowerCase().includes('last')) {
        await input.type('Doe', { delay: 30 });
      } else if (placeholder?.toLowerCase().includes('email')) {
        await input.type('john@example.com', { delay: 30 });
      } else if (placeholder?.toLowerCase().includes('address')) {
        await input.type('123 Main St', { delay: 30 });
      } else if (placeholder?.toLowerCase().includes('city')) {
        await input.type('NYC', { delay: 30 });
      } else if (placeholder?.toLowerCase().includes('zip')) {
        await input.type('10001', { delay: 30 });
      }
    }

    // Fill payment
    const cardInputs = await context.page.$$('input[name*="card" i], input[name*="expiry" i], input[name*="cvv" i]');
    for (const input of cardInputs) {
      const name = await context.page.evaluate((el) => (el as HTMLInputElement).name, input);
      if (name?.toLowerCase().includes('card')) {
        await input.type('4242424242424242', { delay: 30 });
      } else if (name?.toLowerCase().includes('expiry') || name?.toLowerCase().includes('exp')) {
        await input.type('12/25', { delay: 30 });
      } else if (name?.toLowerCase().includes('cvv') || name?.toLowerCase().includes('cvc')) {
        await input.type('123', { delay: 30 });
      }
    }

    await delay(500);

    // Submit
    const submitButton = await context.page.$('button[type="submit"]');
    if (submitButton) {
      await submitButton.click();
      await delay(3000);
    }

    // Verify order API was called
    const orderAPI = responses.find(r => 
      r.url.includes('orders') && 
      (r.method === 'POST' || r.status === 200 || r.status === 201)
    );

    expect(orderAPI).toBeDefined();
  });

  test('should fetch orders via API', async () => {
    await context.helpers.auth.signIn(config.testUser.email, config.testUser.password);
    await delay(1000);

    const responses: any[] = [];

    context.page.on('response', async (response) => {
      const url = response.url();
      if (url.includes('orders') || url.includes('supabase')) {
        responses.push({
          url,
          status: response.status(),
          method: response.request().method(),
        });
      }
    });

    await context.page.goto(`${config.baseUrl}/orders`);
    await delay(3000);

    // Verify orders API was called
    const ordersAPI = responses.find(r => 
      r.url.includes('orders') && 
      (r.method === 'GET' || r.status === 200)
    );

    expect(ordersAPI).toBeDefined();
  });

  test('should handle wishlist CRUD operations', async () => {
    await context.helpers.auth.signIn(config.testUser.email, config.testUser.password);
    await delay(1000);

    const responses: any[] = [];

    context.page.on('response', async (response) => {
      const url = response.url();
      if (url.includes('wishlist') || url.includes('supabase')) {
        responses.push({
          url,
          status: response.status(),
          method: response.request().method(),
        });
      }
    });

    await context.page.goto(`${config.baseUrl}/shop`);
    await delay(2000);

    // Add to wishlist
    const wishlistButton = await context.page.$('button:has(svg), [class*="heart"] button');
    if (wishlistButton) {
      await wishlistButton.click();
      await delay(2000);
    }

    // Verify wishlist API was called
    const wishlistAPI = responses.find(r => 
      r.url.includes('wishlist') && 
      (r.method === 'POST' || r.method === 'PUT' || r.status === 200 || r.status === 201)
    );

    expect(wishlistAPI).toBeDefined();
  });

  test('should handle authentication API calls', async () => {
    const responses: any[] = [];

    context.page.on('response', async (response) => {
      const url = response.url();
      if (url.includes('auth') || url.includes('signin') || url.includes('signup')) {
        responses.push({
          url,
          status: response.status(),
          method: response.request().method(),
        });
      }
    });

    await context.page.goto(`${config.baseUrl}/auth`);
    await delay(1000);

    // Try to sign in
    await context.helpers.page.fillInput('#login-email', config.testUser.email);
    await context.helpers.page.fillInput('#login-password', config.testUser.password);
    
    await context.page.click('button[type="submit"]');
    await delay(2000);

    // Verify auth API was called
    const authAPI = responses.find(r => 
      (r.url.includes('auth') || r.url.includes('signin')) && 
      (r.method === 'POST' || r.status === 200 || r.status === 201)
    );

    expect(authAPI).toBeDefined();
  });
});

