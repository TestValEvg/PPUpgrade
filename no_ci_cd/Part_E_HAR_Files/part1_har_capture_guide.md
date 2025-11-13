# Part 1: Capturing HAR Files - Complete Guide

## What is a HAR File?

A **HAR (HTTP Archive)** file is a standardized JSON format that records all network interactions between a browser and server. It captures:
- Every HTTP request and response
- Headers and payloads
- Response times and sizes
- Cookies and authentication tokens

### Real-World Scenario
When a user clicks "Login" on your web app, dozens of API calls happen behind the scenes:
- POST to `/api/login` (submit credentials)
- GET `/api/user/profile` (fetch user data)
- GET `/api/settings` (load preferences)
- POST `/api/analytics` (track user action)

A HAR file records ALL of these, making it invaluable for:
- **API Testing**: Extract and replay real API calls
- **Performance Testing**: Load test with real request patterns
- **Debugging**: See exactly what the browser sent and received
- **Documentation**: Prove what your API actually does

---

## Method 1: Manual Capture Using Browser DevTools

### Step-by-Step (Chrome/Firefox/Edge)

#### 1. Open Developer Tools
```
Windows/Linux: Press F12
Mac: Press Cmd + Option + I
```

#### 2. Go to the Network Tab
- Click the **Network** tab
- Check **"Preserve log"** checkbox (important!)
- Click the **Clear** button (⚫ icon) to start fresh

#### 3. Perform Your User Flow
- Navigate to your application
- Perform the actions you want to capture (e.g., login, add to cart, checkout)
- All network requests will be recorded in the Network tab

#### 4. Save as HAR
- Right-click anywhere in the network requests list
- Select **"Save all as HAR(with content)"** or **"Save as HAR(sanitized)"**
  - **with content**: Includes response bodies (larger file)
  - **sanitized**: Removes sensitive data (passwords, tokens)
- Choose **"Save as HAR (sanitized)"** for security!
- Save the file (e.g., `login-flow.har`)

### HAR File Structure

```json
{
  "log": {
    "version": "1.2.0",
    "creator": {
      "name": "WebInspector",
      "version": "537.36"
    },
    "entries": [
      {
        "startedDateTime": "2025-11-13T10:30:00.000Z",
        "time": 245,
        "request": {
          "method": "POST",
          "url": "https://api.example.com/api/v1/login",
          "headers": [
            {"name": "Content-Type", "value": "application/json"},
            {"name": "Authorization", "value": "Bearer token123"}
          ],
          "postData": {
            "mimeType": "application/json",
            "text": "{\"email\":\"test@example.com\",\"password\":\"secret\"}"
          }
        },
        "response": {
          "status": 200,
          "statusText": "OK",
          "headers": [],
          "content": {
            "mimeType": "application/json",
            "text": "{\"token\":\"abc123\",\"userId\":\"user-456\"}"
          },
          "redirectURL": "",
          "headersSize": -1,
          "bodySize": 50
        },
        "timings": {
          "blocked": 5,
          "dns": 10,
          "connect": 50,
          "send": 20,
          "wait": 100,
          "receive": 60,
          "ssl": 40
        }
      }
    ]
  }
}
```

---

## Method 2: Automated Capture Using Playwright

### Why Automate?
- Repeatable and consistent captures
- No manual browser steps needed
- Perfect for CI/CD pipelines
- Can capture complex multi-step flows

### Playwright HAR Capture Script

#### Basic Example: Login Flow

```typescript
import { test, expect } from '@playwright/test';

test('capture HAR file for login flow', async ({ page }) => {
  // Start recording a HAR file
  await page.routeFromHAR('har-files/login-flow.har', {
    url: '**/*',           // Capture all requests
    update: true           // Create HAR if it doesn't exist
  });

  // Navigate to login page
  await page.goto('https://yourapp.com/login');
  
  // Perform login action
  await page.fill('input[name="email"]', 'testuser@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  // Wait for navigation to complete
  await page.waitForNavigation();
  
  // Verify successful login
  await expect(page).toHaveURL('**/dashboard');
  
  // HAR file is automatically saved
});
```

#### Advanced Example: Multi-Step E-Commerce Flow

```typescript
import { test, expect } from '@playwright/test';

test('capture checkout HAR file', async ({ page }) => {
  // Start HAR recording with URL filters
  await page.routeFromHAR('har-files/checkout-flow.har', {
    url: '**/api/**',      // Only capture API calls
    update: true
  });

  // Step 1: Browse products
  await page.goto('https://shop.example.com/products');
  await page.waitForLoadState('networkidle');

  // Step 2: Add item to cart
  await page.click('button:has-text("Add to Cart")');
  await page.waitForResponse('**/api/cart');

  // Step 3: Go to checkout
  await page.click('a:has-text("Checkout")');
  await page.waitForResponse('**/api/order/create');

  // Step 4: Fill shipping info
  await page.fill('input[name="address"]', '123 Main St');
  await page.click('button:has-text("Continue")');

  // Step 5: Complete payment
  await page.fill('input[name="card"]', '4111111111111111');
  await page.click('button:has-text("Pay")');

  // Wait for order confirmation
  await page.waitForResponse('**/api/order/confirm');
  await expect(page).toHaveURL('**/order-confirmation');
  
  // HAR file now contains the entire checkout flow
});
```

#### HAR Capture with Custom Matchers

```typescript
import { test } from '@playwright/test';

test('capture specific API endpoints', async ({ page }) => {
  // Capture only POST/PUT requests to /api/users
  await page.routeFromHAR('har-files/user-api.har', {
    url: '**/api/users/**',
    method: /POST|PUT/,
    update: true
  });

  await page.goto('https://app.example.com/users/new');
  
  // Fill user form
  await page.fill('input[name="name"]', 'John Doe');
  await page.fill('input[name="email"]', 'john@example.com');
  await page.fill('input[name="role"]', 'admin');
  
  // Submit creates user via POST
  await page.click('button:has-text("Create")');
  
  // Wait for API response
  await page.waitForResponse('**/api/users');
  
  // Now HAR contains the user creation request
});
```

---

## Method 3: Recording with Custom Configuration

### Playwright Config for HAR Recording

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  
  fullyParallel: true,
  
  // Enable HAR recording for all tests
  use: {
    // Record HAR files
    recordHar: {
      // Directory where HAR files will be stored
      omitContent: false,  // Include response bodies
    },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
```

### Run Tests with HAR Recording

```bash
# Record HAR files during test execution
npx playwright test --headed

# HAR files are automatically saved in:
# test-results/
```

---

## Capturing from Petstore API (Real Example)

### Example 1: Get Available Pets

#### Using Browser DevTools
1. Open `https://petstore.swagger.io/v2/swagger-ui.html`
2. Open DevTools → Network tab
3. Click "Try it out" → "Execute"
4. Right-click → "Save all as HAR"

#### Expected HAR Entry
```json
{
  "startedDateTime": "2025-11-13T10:30:00.000Z",
  "time": 245,
  "request": {
    "method": "GET",
    "url": "https://petstore.swagger.io/v2/pet/findByStatus?status=available",
    "headers": [
      {"name": "Accept", "value": "application/json"},
      {"name": "User-Agent", "value": "Mozilla/5.0..."}
    ]
  },
  "response": {
    "status": 200,
    "statusText": "OK",
    "content": {
      "mimeType": "application/json",
      "text": "[{\"id\":1,\"name\":\"Dog\",\"photoUrls\":[],\"status\":\"available\"}]"
    }
  }
}
```

### Example 2: Create a New Pet

#### Using Playwright Script
```typescript
import { test } from '@playwright/test';

test('capture pet creation HAR', async ({ page }) => {
  await page.routeFromHAR('har-files/petstore-create.har', {
    url: '**/api/**',
    update: true
  });

  await page.goto('https://petstore.swagger.io/v2/swagger-ui.html');
  
  // Expand /pet POST operation
  await page.click('text=/pet');
  await page.click('button:has-text("Try it out")');
  
  // Fill request body
  const petData = {
    id: 12345,
    name: 'Golden Retriever',
    photoUrls: ['https://example.com/dog.jpg'],
    status: 'available'
  };
  
  await page.fill('.body-param textarea', JSON.stringify(petData));
  await page.click('button:has-text("Execute")');
  
  // Wait for response
  await page.waitForResponse('**/pet');
});
```

---

## Sanitizing HAR Files (Security Best Practice)

### Why Sanitize?
- Remove passwords and sensitive credentials
- Remove authentication tokens
- Remove personal information (emails, phone numbers)
- Safe to commit to version control

### Sanitization Script

```javascript
// sanitize-har.js
const fs = require('fs');

function sanitizeHAR(harFilePath) {
  const har = JSON.parse(fs.readFileSync(harFilePath, 'utf8'));
  
  const sensitivePatterns = [
    /password["\s:]*["\w]*/gi,
    /token["\s:]*["\w]*/gi,
    /authorization["\s:]*["\w]*/gi,
    /bearer\s+\w+/gi,
    /email["\s:]*["\w@.]*"/gi,
  ];
  
  // Sanitize request/response bodies
  har.log.entries.forEach(entry => {
    if (entry.request.postData?.text) {
      sensitivePatterns.forEach(pattern => {
        entry.request.postData.text = entry.request.postData.text.replace(
          pattern,
          '[REDACTED]'
        );
      });
    }
    
    if (entry.response.content?.text) {
      sensitivePatterns.forEach(pattern => {
        entry.response.content.text = entry.response.content.text.replace(
          pattern,
          '[REDACTED]'
        );
      });
    }
  });
  
  fs.writeFileSync(
    harFilePath.replace('.har', '-sanitized.har'),
    JSON.stringify(har, null, 2)
  );
  
  console.log('✅ HAR file sanitized');
}

sanitizeHAR(process.argv[2]);
```

### Usage
```bash
node sanitize-har.js login-flow.har
# Creates: login-flow-sanitized.har
```

---

## HAR Capture Best Practices

### ✅ Do
- ✅ Capture realistic user flows (multiple steps)
- ✅ Use "Sanitized" option to protect sensitive data
- ✅ Clear browser cache before capturing (fresh state)
- ✅ Verify all important requests are captured
- ✅ Give HAR files descriptive names
- ✅ Document what the HAR contains
- ✅ Store in version control (sanitized only)

### ❌ Don't
- ❌ Capture with "Preserve log" unchecked (data lost)
- ❌ Include real passwords/tokens (security risk)
- ❌ Use unsanitized HAR files in shared repos
- ❌ Capture browser extensions requests (clutter)
- ❌ Leave browser in offline mode (incomplete)

---

## Common Issues & Solutions

### Issue 1: HAR file is too large
**Solution**: Filter by URL pattern
```typescript
await page.routeFromHAR('file.har', {
  url: '**/api/**'  // Only API calls
});
```

### Issue 2: Sensitive data in HAR
**Solution**: Sanitize before committing
```bash
node sanitize-har.js file.har
git add file-sanitized.har
```

### Issue 3: HAR doesn't contain expected requests
**Solution**: Wait for network idle
```typescript
await page.goto(url);
await page.waitForLoadState('networkidle');
```

### Issue 4: Recorded HAR is stale
**Solution**: Force update
```typescript
await page.routeFromHAR('file.har', {
  update: true  // Always re-record
});
```

---

## Summary

You now know how to capture HAR files:
1. **Browser DevTools** (quick manual capture)
2. **Playwright** (automated, repeatable)
3. **Custom Configuration** (integrated with tests)
4. **Sanitization** (secure sharing)

**Next Step**: Go to Part 2 to learn how to convert HAR files into k6 load testing scripts!

---

## Quick Reference

| Task | Method |
|------|--------|
| Quick capture | Browser DevTools |
| Repeatable capture | Playwright script |
| CI/CD integration | Playwright config |
| Load testing | Extract from HAR → k6 script |
| Functional testing | Replay HAR in tests |
| API documentation | Export HAR endpoints |

