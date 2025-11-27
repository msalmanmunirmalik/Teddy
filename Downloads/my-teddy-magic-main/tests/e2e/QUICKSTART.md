# Quick Start Guide - E2E Testing

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.test` file in the project root (optional):
```bash
TEST_ENV=local
LOCAL_URL=http://localhost:8080
PRODUCTION_URL=https://your-production-url.com
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=testpassword123
```

### 3. Start Your Application

**For Local Testing:**
```bash
npm run dev
```

The app should be running on `http://localhost:8080`

### 4. Run Tests

**Local Environment:**
```bash
npm run test:e2e:local
```

**Production Environment:**
```bash
npm run test:e2e:prod
```

**Debug Mode (visible browser):**
```bash
npm run test:e2e:debug
```

## 📋 Test Suites

All test suites are located in `tests/e2e/suites/`:

- ✅ **auth.test.ts** - Authentication (sign up, sign in, sign out)
- ✅ **products.test.ts** - Product listing, filtering, search
- ✅ **cart.test.ts** - Shopping cart CRUD operations
- ✅ **checkout.test.ts** - Checkout flow and order creation
- ✅ **api.test.ts** - API endpoint testing
- ✅ **navigation.test.ts** - Site navigation and routing
- ✅ **profile.test.ts** - User profile management
- ✅ **wishlist.test.ts** - Wishlist CRUD operations

## 🎯 What Gets Tested

### Features Tested:
- ✅ User authentication (sign up, sign in, sign out)
- ✅ Product browsing and filtering
- ✅ Shopping cart operations
- ✅ Checkout process
- ✅ Order creation
- ✅ Wishlist management
- ✅ User profile
- ✅ Site navigation

### APIs Tested:
- ✅ Products API (GET)
- ✅ Cart API (CREATE, UPDATE, DELETE)
- ✅ Orders API (CREATE, GET)
- ✅ Wishlist API (CRUD)
- ✅ Authentication API

### Dataflows Tested:
- ✅ User registration → Authentication → Shopping
- ✅ Add to cart → Update quantity → Checkout → Order creation
- ✅ Add to wishlist → View wishlist → Navigate to product
- ✅ Profile updates → Data persistence

## 📊 Test Reports

After running tests, check:
- `tests/e2e/test-report-*.json` - JSON report
- `tests/e2e/test-report-*.html` - HTML report
- `tests/e2e/screenshots/` - Screenshots from test runs

## 🔧 Troubleshooting

### Tests timeout
- Ensure your app is running (`npm run dev`)
- Check the URL in `config.ts` matches your app URL
- Increase timeout: `TEST_TIMEOUT=60000 npm run test:e2e`

### Browser not launching
- Puppeteer should install Chromium automatically
- Check system dependencies if issues persist

### Authentication fails
- Verify test user credentials exist in your database
- Check Supabase configuration

## 📝 Next Steps

1. **Customize Tests**: Edit test files in `tests/e2e/suites/`
2. **Add More Tests**: Follow the pattern in existing test files
3. **CI/CD Integration**: Add tests to your CI/CD pipeline
4. **Monitor Results**: Review test reports regularly

## 🎉 You're All Set!

Run `npm run test:e2e:local` to start testing!

