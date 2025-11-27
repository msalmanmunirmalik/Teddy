/**
 * Authentication Helper Functions
 * Utilities for handling authentication in E2E tests
 */

import { Page } from 'puppeteer';
import { PageHelpers } from './page-helpers';
import { config } from '../config';

export class AuthHelpers {
  private pageHelpers: PageHelpers;

  constructor(private page: Page) {
    this.pageHelpers = new PageHelpers(page);
  }

  /**
   * Sign up a new user
   */
  async signUp(email: string, password: string): Promise<void> {
    await this.page.goto(`${config.baseUrl}/auth`);
    await this.pageHelpers.waitForSelector('button:has-text("Sign Up")');
    
    // Click Sign Up tab if not already active
    const signUpTab = await this.page.$('button:has-text("Sign Up")');
    if (signUpTab) {
      await signUpTab.click();
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Fill sign up form
    await this.pageHelpers.fillInput('#signup-email', email);
    await this.pageHelpers.fillInput('#signup-password', password);

    // Submit form
    await Promise.all([
      this.page.waitForNavigation({ waitUntil: 'networkidle0' }),
      this.page.click('button[type="submit"]'),
    ]);

    await this.pageHelpers.waitForToast();
  }

  /**
   * Sign in with existing credentials
   */
  async signIn(email: string, password: string): Promise<void> {
    await this.page.goto(`${config.baseUrl}/auth`);
    await this.pageHelpers.waitForSelector('#login-email');

    // Fill login form
    await this.pageHelpers.fillInput('#login-email', email);
    await this.pageHelpers.fillInput('#login-password', password);

    // Submit form
    await Promise.all([
      this.page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {}),
      this.page.click('button[type="submit"]'),
    ]);

    await this.pageHelpers.waitForToast();
    
    // Wait for redirect after login
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  /**
   * Sign out
   */
  async signOut(): Promise<void> {
    // Look for sign out button in navigation
    const signOutButton = await this.page.$('button:has-text("Sign Out"), a:has-text("Sign Out")');
    if (signOutButton) {
      await signOutButton.click();
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const authState = await this.page.evaluate(() => {
        return localStorage.getItem('sb-auth-token') !== null;
      });
      return authState;
    } catch {
      return false;
    }
  }

  /**
   * Get current user email from localStorage
   */
  async getCurrentUserEmail(): Promise<string | null> {
    try {
      return await this.page.evaluate(() => {
        const authData = localStorage.getItem('sb-auth-token');
        if (authData) {
          try {
            const parsed = JSON.parse(authData);
            return parsed?.user?.email || null;
          } catch {
            return null;
          }
        }
        return null;
      });
    } catch {
      return null;
    }
  }
}

