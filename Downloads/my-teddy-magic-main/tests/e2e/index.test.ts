/**
 * Main E2E Test Entry Point
 * This file imports and runs all test suites
 * 
 * Usage:
 *   npm run test:e2e          - Run tests in local environment
 *   npm run test:e2e:prod     - Run tests in production environment
 */

import { setupTest, teardownTest, navigateToBase } from './setup';
import { config } from './config';

// Import all test suites
import './suites/auth.test';
import './suites/products.test';
import './suites/cart.test';
import './suites/checkout.test';
import './suites/api.test';
import './suites/navigation.test';
import './suites/profile.test';
import './suites/wishlist.test';

// Global setup and teardown
beforeAll(async () => {
  await setupTest();
  console.log(`\n🧸 Starting E2E Tests for My Teddy Magic 🧸`);
  console.log(`Environment: ${config.environment}`);
  console.log(`Base URL: ${config.baseUrl}\n`);
});

afterAll(async () => {
  await teardownTest();
  console.log('\n✅ All tests completed!\n');
});

// Note: This file serves as an entry point
// Actual test execution would be handled by a test framework like Jest
// For now, individual test files can be run directly

export {};

