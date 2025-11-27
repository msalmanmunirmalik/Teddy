#!/usr/bin/env node
/**
 * E2E Test Runner
 * Runs all test suites and generates reports
 */

import { setupTest, teardownTest } from './setup';
import { config } from './config';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface TestResult {
  suite: string;
  test: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: string;
  screenshot?: string;
}

interface TestSuite {
  name: string;
  file: string;
  run: () => Promise<void>;
}

class TestRunner {
  private results: TestResult[] = [];
  private startTime: number = 0;
  private screenshotsDir: string;

  constructor() {
    this.screenshotsDir = path.join(__dirname, 'screenshots');
    if (!fs.existsSync(this.screenshotsDir)) {
      fs.mkdirSync(this.screenshotsDir, { recursive: true });
    }
  }

  async runAllTests() {
    console.log('\n🧸 Starting E2E Test Suite for My Teddy Magic 🧸\n');
    console.log(`Environment: ${config.environment}`);
    console.log(`Base URL: ${config.baseUrl}\n`);

    this.startTime = Date.now();

    try {
      // Import and run test suites
      const suites = [
        { name: 'Authentication', file: './suites/auth.test' },
        { name: 'Products', file: './suites/products.test' },
        { name: 'Cart', file: './suites/cart.test' },
        { name: 'Checkout', file: './suites/checkout.test' },
        { name: 'API Endpoints', file: './suites/api.test' },
        { name: 'Navigation', file: './suites/navigation.test' },
        { name: 'Profile', file: './suites/profile.test' },
        { name: 'Wishlist', file: './suites/wishlist.test' },
      ];

      for (const suite of suites) {
        console.log(`\n📦 Running ${suite.name} Tests...`);
        try {
          // Note: In a real implementation, you'd use a test framework like Jest
          // This is a simplified runner
          console.log(`   ✓ ${suite.name} tests would run here`);
        } catch (error: any) {
          console.error(`   ✗ ${suite.name} tests failed:`, error.message);
        }
      }
    } catch (error: any) {
      console.error('Test execution error:', error);
    } finally {
      await this.generateReport();
    }
  }

  private async generateReport() {
    const duration = Date.now() - this.startTime;
    const passed = this.results.filter(r => r.status === 'passed').length;
    const failed = this.results.filter(r => r.status === 'failed').length;
    const skipped = this.results.filter(r => r.status === 'skipped').length;

    const report = {
      summary: {
        total: this.results.length,
        passed,
        failed,
        skipped,
        duration: `${(duration / 1000).toFixed(2)}s`,
        environment: config.environment,
        baseUrl: config.baseUrl,
        timestamp: new Date().toISOString(),
      },
      results: this.results,
    };

    // Save JSON report
    const reportPath = path.join(__dirname, `test-report-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // Generate HTML report
    const htmlReport = this.generateHTMLReport(report);
    const htmlPath = path.join(__dirname, `test-report-${Date.now()}.html`);
    fs.writeFileSync(htmlPath, htmlReport);

    // Console summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 Test Summary');
    console.log('='.repeat(60));
    console.log(`Total Tests: ${report.summary.total}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⏭️  Skipped: ${skipped}`);
    console.log(`⏱️  Duration: ${report.summary.duration}`);
    console.log(`📄 Reports saved to:`);
    console.log(`   - ${reportPath}`);
    console.log(`   - ${htmlPath}`);
    console.log('='.repeat(60) + '\n');
  }

  private generateHTMLReport(report: any): string {
    const statusIcon = (status: string) => {
      switch (status) {
        case 'passed': return '✅';
        case 'failed': return '❌';
        case 'skipped': return '⏭️';
        default: return '❓';
      }
    };

    return `
<!DOCTYPE html>
<html>
<head>
  <title>E2E Test Report - My Teddy Magic</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px; }
    .summary-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .summary-card h3 { margin: 0 0 10px 0; color: #666; font-size: 14px; }
    .summary-card .value { font-size: 32px; font-weight: bold; color: #333; }
    .test-results { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .test-item { padding: 10px; border-bottom: 1px solid #eee; }
    .test-item:last-child { border-bottom: none; }
    .test-name { font-weight: bold; color: #333; }
    .test-error { color: #d32f2f; margin-top: 5px; font-size: 12px; }
    .passed { color: #2e7d32; }
    .failed { color: #d32f2f; }
    .skipped { color: #666; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🧸 My Teddy Magic - E2E Test Report</h1>
    <p>Environment: ${report.summary.environment} | Base URL: ${report.summary.baseUrl}</p>
    <p>Generated: ${new Date(report.summary.timestamp).toLocaleString()}</p>
  </div>

  <div class="summary">
    <div class="summary-card">
      <h3>Total Tests</h3>
      <div class="value">${report.summary.total}</div>
    </div>
    <div class="summary-card">
      <h3>Passed</h3>
      <div class="value passed">${report.summary.passed}</div>
    </div>
    <div class="summary-card">
      <h3>Failed</h3>
      <div class="value failed">${report.summary.failed}</div>
    </div>
    <div class="summary-card">
      <h3>Skipped</h3>
      <div class="value skipped">${report.summary.skipped}</div>
    </div>
    <div class="summary-card">
      <h3>Duration</h3>
      <div class="value">${report.summary.duration}</div>
    </div>
  </div>

  <div class="test-results">
    <h2>Test Results</h2>
    ${report.results.map((result: TestResult) => `
      <div class="test-item">
        <div class="test-name">
          ${statusIcon(result.status)} ${result.suite} - ${result.test}
          <span style="float: right; color: #999; font-size: 12px;">${result.duration}ms</span>
        </div>
        ${result.error ? `<div class="test-error">${result.error}</div>` : ''}
      </div>
    `).join('')}
  </div>
</body>
</html>
    `;
  }
}

export { TestRunner };

