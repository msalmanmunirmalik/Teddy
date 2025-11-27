/**
 * Page Helper Functions
 * Common utilities for interacting with pages during E2E tests
 */

import { Page } from 'puppeteer';

export class PageHelpers {
  constructor(private page: Page) {}

  /**
   * Wait for element to be visible
   */
  async waitForSelector(selector: string, timeout = 30000): Promise<void> {
    await this.page.waitForSelector(selector, { timeout, visible: true });
  }

  /**
   * Click element and wait for navigation
   */
  async clickAndWaitForNavigation(selector: string): Promise<void> {
    await Promise.all([
      this.page.waitForNavigation({ waitUntil: 'networkidle0' }),
      this.page.click(selector),
    ]);
  }

  /**
   * Fill input field
   */
  async fillInput(selector: string, value: string): Promise<void> {
    await this.waitForSelector(selector);
    await this.page.click(selector);
    await this.page.type(selector, value, { delay: 50 });
  }

  /**
   * Select option from dropdown
   */
  async selectOption(selector: string, value: string): Promise<void> {
    await this.waitForSelector(selector);
    await this.page.select(selector, value);
  }

  /**
   * Get text content of element
   */
  async getText(selector: string): Promise<string | null> {
    await this.waitForSelector(selector);
    return await this.page.$eval(selector, (el) => el.textContent);
  }

  /**
   * Check if element exists
   */
  async elementExists(selector: string): Promise<boolean> {
    try {
      await this.page.waitForSelector(selector, { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Wait for API call to complete
   */
  async waitForAPIResponse(urlPattern: string | RegExp): Promise<void> {
    await this.page.waitForResponse(
      (response) => {
        const url = response.url();
        if (typeof urlPattern === 'string') {
          return url.includes(urlPattern);
        }
        return urlPattern.test(url);
      },
      { timeout: 30000 }
    );
  }

  /**
   * Take screenshot
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ 
      path: `tests/e2e/screenshots/${name}-${Date.now()}.png`,
      fullPage: true 
    });
  }

  /**
   * Wait for toast notification
   */
  async waitForToast(timeout = 5000): Promise<void> {
    try {
      await this.page.waitForSelector('[role="status"], .toast, [data-sonner-toast]', { timeout });
    } catch {
      // Toast might not appear, continue
    }
  }

  /**
   * Clear localStorage and sessionStorage
   */
  async clearStorage(): Promise<void> {
    await this.page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  }
}

