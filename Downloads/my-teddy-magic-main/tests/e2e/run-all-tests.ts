#!/usr/bin/env node
/**
 * E2E Test Runner Entry Point
 * Executes all test suites
 */

import { TestRunner } from './runner';

const runner = new TestRunner();
runner.runAllTests().catch((error) => {
  console.error('Test execution failed:', error);
  process.exit(1);
});

