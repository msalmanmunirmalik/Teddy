/**
 * Jest Setup File for E2E Tests
 * Global setup and teardown for all E2E tests
 */

import { setupTest, teardownTest } from './setup';
import { config } from './config';

// Global setup - runs once before all tests
beforeAll(async () => {
  console.log('\n🧸 Starting E2E Test Suite for My Teddy Magic 🧸\n');
  console.log(`Environment: ${config.environment}`);
  console.log(`Base URL: ${config.baseUrl}\n`);
});

// Global teardown - runs once after all tests
afterAll(async () => {
  await teardownTest();
  console.log('\n✅ All E2E tests completed!\n');
});

