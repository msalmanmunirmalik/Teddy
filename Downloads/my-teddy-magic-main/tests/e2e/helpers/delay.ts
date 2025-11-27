/**
 * Delay helper function
 * Replaces page.waitForTimeout which doesn't exist in Puppeteer
 */

export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

