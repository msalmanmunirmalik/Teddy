/**
 * API Helper Functions
 * Utilities for testing API endpoints and data flows
 */

import { Page } from 'puppeteer';

export interface APIResponse {
  url: string;
  status: number;
  headers: Record<string, string>;
  body: any;
}

export class APIHelpers {
  constructor(private page: Page) {}

  /**
   * Intercept and capture API responses
   */
  async captureAPIResponses(urlPattern: string | RegExp): Promise<APIResponse[]> {
    const responses: APIResponse[] = [];

    this.page.on('response', async (response) => {
      const url = response.url();
      const matches = typeof urlPattern === 'string' 
        ? url.includes(urlPattern)
        : urlPattern.test(url);

      if (matches) {
        try {
          const status = response.status();
          const headers = response.headers();
          let body: any = null;

          try {
            body = await response.json();
          } catch {
            try {
              body = await response.text();
            } catch {
              body = null;
            }
          }

          responses.push({ url, status, headers, body });
        } catch (error) {
          console.error('Error capturing API response:', error);
        }
      }
    });

    return responses;
  }

  /**
   * Wait for specific API call and return response
   */
  async waitForAPIResponse(urlPattern: string | RegExp, timeout = 30000): Promise<APIResponse | null> {
    return new Promise((resolve) => {
      const timeoutId = setTimeout(() => {
        this.page.off('response', handler);
        resolve(null);
      }, timeout);

      const handler = async (response: any) => {
        const url = response.url();
        const matches = typeof urlPattern === 'string'
          ? url.includes(urlPattern)
          : urlPattern.test(url);

        if (matches) {
          clearTimeout(timeoutId);
          this.page.off('response', handler);

          try {
            const status = response.status();
            const headers = response.headers();
            let body: any = null;

            try {
              body = await response.json();
            } catch {
              try {
                body = await response.text();
              } catch {
                body = null;
              }
            }

            resolve({ url, status, headers, body });
          } catch (error) {
            resolve(null);
          }
        }
      };

      this.page.on('response', handler);
    });
  }

  /**
   * Check API response status
   */
  async verifyAPIStatus(urlPattern: string | RegExp, expectedStatus: number): Promise<boolean> {
    const response = await this.waitForAPIResponse(urlPattern);
    return response?.status === expectedStatus;
  }

  /**
   * Get all network requests
   */
  async getAllRequests(): Promise<string[]> {
    return await this.page.evaluate(() => {
      return (window as any).__networkRequests || [];
    });
  }
}

