# E2E Testing Suite for My Teddy Magic

Comprehensive end-to-end testing suite covering all features, APIs, endpoints, dataflows, and CRUD operations.

## Overview

This test suite uses Puppeteer to test the entire application across both local development and production environments.

## Test Coverage

### ✅ Authentication Tests (`suites/auth.test.ts`)
- User sign up
- User sign in
- Sign out
- Form validation
- Error handling

### ✅ Products Tests (`suites/products.test.ts`)
- Product listing
- Product filtering (category, price)
- Product search
- Product sorting
- Product detail pages
- Add to cart from shop
- Add to wishlist

### ✅ Cart Tests (`suites/cart.test.ts`)
- Display cart page
- Add items to cart
- Update item quantity
- Remove items from cart
- Calculate cart total
- Cart persistence
- Navigate to checkout

### ✅ Checkout Tests (`suites/checkout.test.ts`)
- Display checkout page
- Form validation
- Fill shipping information
- Fill payment information
- Order summary display
- Complete checkout process
- Authentication redirects
- Empty cart handling

### ✅ API Endpoint Tests (`suites/api.test.ts`)
- Products API (GET)
- Cart API (CREATE, UPDATE, DELETE)
- Orders API (CREATE, GET)
- Wishlist API (CRUD)
- Authentication API

### ✅ Navigation Tests (`suites/navigation.test.ts`)
- Page navigation
- Route handling
- 404 error handling
- Browser history (back/forward)
- Page reload persistence

### ✅ Profile Tests (`suites/profile.test.ts`)
- Profile page display
- User information display
- Profile updates
- Image upload
- Authentication redirects

### ✅ Wishlist Tests (`suites/wishlist.test.ts`)
- Wishlist page display
- Add to wishlist
- Remove from wishlist
- Display wishlist items
- Navigate to product from wishlist
- Authentication redirects

## Setup

### Prerequisites
- Node.js 18+ (20+ recommended)
- npm or yarn
- Puppeteer (installed automatically)

### Installation

```bash
npm install
```

## Configuration

### Environment Variables

Create a `.env.test` file or set environment variables:

```bash
# Test Environment (local or production)
TEST_ENV=local

# URLs
LOCAL_URL=http://localhost:8080
PRODUCTION_URL=https://your-production-url.com

# Test User Credentials
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=testpassword123

# Browser Settings
HEADLESS=true          # Run in headless mode
SLOW_MO=0              # Slow down operations (ms)
TEST_TIMEOUT=30000     # Test timeout (ms)

# Viewport
VIEWPORT_WIDTH=1280
VIEWPORT_HEIGHT=720
```

## Running Tests

### Local Development

```bash
# Run all tests against local environment
npm run test:e2e

# Run specific test suite
npm run test:e2e -- --grep "Authentication"

# Run with visible browser (not headless)
HEADLESS=false npm run test:e2e
```

### Production Environment

```bash
# Run all tests against production
npm run test:e2e:prod

# Run specific suite against production
TEST_ENV=production npm run test:e2e -- --grep "Products"
```

### Debug Mode

```bash
# Run with slow motion for debugging
SLOW_MO=250 npm run test:e2e

# Run with visible browser
HEADLESS=false SLOW_MO=100 npm run test:e2e
```

## Test Reports

After running tests, reports are generated in `tests/e2e/`:

- `test-report-{timestamp}.json` - JSON report with all test results
- `test-report-{timestamp}.html` - HTML report with visual summary
- `screenshots/` - Screenshots captured during test failures

## Test Structure

```
tests/e2e/
├── config.ts              # Test configuration
├── setup.ts                # Test setup and teardown
├── index.test.ts           # Main test entry point
├── runner.ts               # Test runner with reporting
├── helpers/
│   ├── page-helpers.ts     # Page interaction utilities
│   ├── auth-helpers.ts     # Authentication utilities
│   └── api-helpers.ts      # API testing utilities
├── suites/
│   ├── auth.test.ts        # Authentication tests
│   ├── products.test.ts    # Product tests
│   ├── cart.test.ts        # Cart tests
│   ├── checkout.test.ts    # Checkout tests
│   ├── api.test.ts         # API endpoint tests
│   ├── navigation.test.ts  # Navigation tests
│   ├── profile.test.ts     # Profile tests
│   └── wishlist.test.ts    # Wishlist tests
├── screenshots/            # Test screenshots
└── README.md               # This file
```

## Writing New Tests

### Example Test

```typescript
import { setupTest, teardownTest, navigateToBase, TestContext } from '../setup';
import { config } from '../config';

describe('My Feature Tests', () => {
  let context: TestContext;

  beforeAll(async () => {
    context = await setupTest();
  });

  afterAll(async () => {
    await teardownTest();
  });

  beforeEach(async () => {
    await navigateToBase(context);
  });

  test('should do something', async () => {
    await context.page.goto(`${config.baseUrl}/my-page`);
    await context.helpers.page.waitForSelector('h1');
    
    const title = await context.page.title();
    expect(title).toBeTruthy();
  });
});
```

## Best Practices

1. **Always clean up**: Use `beforeEach` to reset state
2. **Wait for elements**: Use `waitForSelector` before interactions
3. **Use helpers**: Leverage helper functions for common operations
4. **Take screenshots**: Capture screenshots on failures
5. **Test both environments**: Run tests against local and production
6. **Handle async**: Always await async operations
7. **Isolate tests**: Each test should be independent

## Troubleshooting

### Tests failing with timeout
- Increase `TEST_TIMEOUT` environment variable
- Check if the application is running
- Verify network connectivity

### Browser not launching
- Ensure Puppeteer is installed: `npm install puppeteer`
- Check system dependencies for Chromium

### Authentication issues
- Verify test user credentials in environment variables
- Check Supabase configuration

### API tests failing
- Verify API endpoints are accessible
- Check network requests in browser DevTools
- Ensure authentication tokens are valid

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '20'
      - run: npm install
      - run: npm run build
      - run: npm run test:e2e
        env:
          TEST_ENV: local
          LOCAL_URL: http://localhost:8080
```

## Support

For issues or questions:
1. Check test logs and screenshots
2. Review browser console errors
3. Verify environment configuration
4. Check application logs

---

**Happy Testing! 🧸✨**

