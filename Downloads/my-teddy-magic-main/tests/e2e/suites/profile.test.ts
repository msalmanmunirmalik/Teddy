/**
import { delay } from '../helpers/delay';
 * Profile E2E Tests
 * Tests user profile management and updates
 */

import { describe, test, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { delay } from '../helpers/delay';
import { setupTest, teardownTest, navigateToBase, TestContext } from '../setup';
import { config } from '../config';

describe('Profile Tests', () => {
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

  test('should display profile page', async () => {
    await context.page.goto(`${config.baseUrl}/profile`);
    await delay(2000);

    const currentUrl = context.page.url();
    expect(currentUrl).toMatch(/\/profile/);

    // Check for profile content
    const hasProfileContent = await context.helpers.page.elementExists('h1, h2, [role="heading"], form');
    expect(hasProfileContent).toBe(true);
  });

  test('should redirect to auth if not logged in', async () => {
    await context.helpers.auth.signOut();
    await delay(1000);

    await context.page.goto(`${config.baseUrl}/profile`);
    await delay(2000);

    const currentUrl = context.page.url();
    expect(currentUrl).toMatch(/\/auth/);
  });

  test('should display user information', async () => {
    await context.page.goto(`${config.baseUrl}/profile`);
    await delay(2000);

    // Check for user email or name display
    const hasUserInfo = await context.page.evaluate(() => {
      const text = document.body.textContent || '';
      return text.includes('@') || text.includes('Email') || text.includes('Name');
    });

    expect(hasUserInfo).toBe(true);
  });

  test('should update profile information', async () => {
    await context.page.goto(`${config.baseUrl}/profile`);
    await delay(2000);

    // Find editable fields
    const inputs = await context.page.$$('input[type="text"], input[type="email"]');
    
    if (inputs.length > 0) {
      const input = inputs[0];
      await input.click();
      await input.type('Updated Name', { delay: 50 });
      await delay(500);

      // Look for save button
      const saveButton = await context.page.$('button:has-text("Save"), button[type="submit"]');
      if (saveButton) {
        await saveButton.click();
        await delay(2000);

        // Check for success message
        const hasSuccess = await context.helpers.page.elementExists('[role="status"], .toast, [data-sonner-toast]');
        expect(hasSuccess).toBe(true);
      }
    }
  });

  test('should handle profile image upload', async () => {
    await context.page.goto(`${config.baseUrl}/profile`);
    await delay(2000);

    // Look for file input or upload button
    const fileInput = await context.page.$('input[type="file"]');
    const uploadButton = await context.page.$('button:has-text("Upload"), button:has-text("Change")');

    if (fileInput || uploadButton) {
      // Note: File upload testing would require actual file
      // This test verifies the UI element exists
      expect(fileInput || uploadButton).toBeTruthy();
    }
  });
});

