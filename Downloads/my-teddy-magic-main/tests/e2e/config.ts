/**
 * E2E Test Configuration
 * Supports testing both local development and production environments
 */

export interface TestConfig {
  baseUrl: string;
  environment: 'local' | 'production';
  headless: boolean;
  slowMo: number;
  timeout: number;
  viewport: {
    width: number;
    height: number;
  };
  testUser: {
    email: string;
    password: string;
  };
}

const getConfig = (): TestConfig => {
  const environment = (process.env.TEST_ENV || 'local') as 'local' | 'production';
  const isProduction = environment === 'production';

  return {
    baseUrl: isProduction 
      ? (process.env.PRODUCTION_URL || 'https://your-production-url.com')
      : (process.env.LOCAL_URL || 'http://localhost:8080'),
    environment,
    headless: process.env.HEADLESS !== 'false',
    slowMo: parseInt(process.env.SLOW_MO || '0'),
    timeout: parseInt(process.env.TEST_TIMEOUT || '30000'),
    viewport: {
      width: parseInt(process.env.VIEWPORT_WIDTH || '1280'),
      height: parseInt(process.env.VIEWPORT_HEIGHT || '720'),
    },
    testUser: {
      email: process.env.TEST_USER_EMAIL || 'test@example.com',
      password: process.env.TEST_USER_PASSWORD || 'testpassword123',
    },
  };
};

export const config = getConfig();

