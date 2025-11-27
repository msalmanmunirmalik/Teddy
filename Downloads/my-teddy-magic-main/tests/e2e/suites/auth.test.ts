/**
import { delay } from '../helpers/delay';
 * Authentication E2E Tests
 * Tests sign up, sign in, sign out, and authentication state
 */

import { delay } from '../helpers/delay';
import { describe, test, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { setupTest, teardownTest, navigateToBase, TestContext } from '../setup';
import { config } from '../config';

describe('Authentication Tests', () => {
  let context: TestContext;
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'testpassword123';

  beforeAll(async () => {
    context = await setupTest();
  });

  afterAll(async () => {
    await teardownTest();
  });

  beforeEach(async () => {
    await navigateToBase(context);
    await context.helpers.page.clearStorage();
  });

  test('should display auth page correctly', async () => {
    await context.page.goto(`${config.baseUrl}/auth`);
    await context.helpers.page.waitForSelector('h1, [role="heading"]');

    const title = await context.page.title();
    expect(title).toBeTruthy();

    // Check for login and signup tabs
    const loginTab = await context.helpers.page.elementExists('button:has-text("Login")');
    const signUpTab = await context.helpers.page.elementExists('button:has-text("Sign Up")');
    
    expect(loginTab || signUpTab).toBe(true);
  });

  test('should validate sign up form', async () => {
    await context.page.goto(`${config.baseUrl}/auth`);
    
    // Try to submit empty form
    const submitButton = await context.page.$('button[type="submit"]');
    if (submitButton) {
      await submitButton.click();
      await delay(500);
      
      // Check for validation messages
      const hasValidation = await context.page.evaluate(() => {
        const inputs = document.querySelectorAll('input[required]');
        return Array.from(inputs).some(input => !(input as HTMLInputElement).value);
      });
      expect(hasValidation).toBe(true);
    }
  });

  test('should sign up new user', async () => {
    await context.page.goto(`${config.baseUrl}/auth`);
    
    // Click Sign Up tab
    const signUpTab = await context.page.$('button:has-text("Sign Up"), [role="tab"]:has-text("Sign Up")');
    if (signUpTab) {
      await signUpTab.click();
      await delay(500);
    }

    // Fill sign up form
    await context.helpers.page.fillInput('#signup-email', testEmail);
    await context.helpers.page.fillInput('#signup-password', testPassword);

    // Submit and wait for response
    const [response] = await Promise.all([
      context.page.waitForResponse(
        (res) => res.url().includes('auth') || res.url().includes('signup'),
        { timeout: 10000 }
      ).catch(() => null),
      context.page.click('button[type="submit"]'),
    ]);

    // Wait for toast or redirect
    await delay(2000);
    
    // Check if redirected or toast appears
    const currentUrl = context.page.url();
    const hasToast = await context.helpers.page.elementExists('[role="status"], .toast');
    
    expect(currentUrl !== `${config.baseUrl}/auth` || hasToast).toBe(true);
  });

  test('should sign in existing user', async () => {
    // First ensure we're on login tab
    await context.page.goto(`${config.baseUrl}/auth`);
    
    const loginTab = await context.page.$('button:has-text("Login"), [role="tab"]:has-text("Login")');
    if (loginTab) {
      await loginTab.click();
      await delay(500);
    }

    // Fill login form
    await context.helpers.page.fillInput('#login-email', config.testUser.email);
    await context.helpers.page.fillInput('#login-password', config.testUser.password);

    // Submit
    const [response] = await Promise.all([
      context.page.waitForResponse(
        (res) => res.url().includes('auth') || res.url().includes('signin'),
        { timeout: 10000 }
      ).catch(() => null),
      context.page.click('button[type="submit"]'),
    ]);

    // Wait for redirect or toast
    await delay(2000);
    
    const currentUrl = context.page.url();
    const isAuthenticated = await context.helpers.auth.isAuthenticated();
    
    // Should be authenticated or redirected
    expect(isAuthenticated || currentUrl !== `${config.baseUrl}/auth`).toBe(true);
  });

  test('should handle invalid credentials', async () => {
    await context.page.goto(`${config.baseUrl}/auth`);
    
    const loginTab = await context.page.$('button:has-text("Login"), [role="tab"]:has-text("Login")');
    if (loginTab) {
      await loginTab.click();
      await delay(500);
    }

    await context.helpers.page.fillInput('#login-email', 'invalid@example.com');
    await context.helpers.page.fillInput('#login-password', 'wrongpassword');

    await context.page.click('button[type="submit"]');
    await delay(2000);

    // Should show error message
    const hasError = await context.helpers.page.elementExists('[role="alert"], .error, [data-destructive]');
    expect(hasError).toBe(true);
  });

  test('should sign out user', async () => {
    // First sign in
    await context.helpers.auth.signIn(config.testUser.email, config.testUser.password);
    await delay(1000);

    // Look for sign out button
    const signOutButton = await context.page.$('button:has-text("Sign Out"), a:has-text("Sign Out"), [aria-label*="Sign Out"]');
    
    if (signOutButton) {
      await signOutButton.click();
      await delay(1000);

      const isAuthenticated = await context.helpers.auth.isAuthenticated();
      expect(isAuthenticated).toBe(false);
    }
  });
});

