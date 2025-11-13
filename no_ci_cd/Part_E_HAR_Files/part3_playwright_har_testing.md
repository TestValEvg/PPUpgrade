# Part 3: Playwright API Tests with HAR Mocking & Replay

## Overview

This part shows how to use HAR files in Playwright for:
1. **Replay**: Run tests offline using saved network interactions
2. **Mocking**: Intercept API calls and return custom responses
3. **Functional Testing**: API-level tests without UI

---

## What is HAR Replay?

**HAR Replay** means your tests run entirely offline by serving all responses from a saved HAR file instead of making real network calls.

### Benefits of Replay
- ✅ **Fast**: No network latency
- ✅ **Reliable**: Consistent responses
- ✅ **Deterministic**: Same response every time
- ✅ **Offline**: Works without internet
- ✅ **Safe**: Doesn't hit real APIs
- ✅ **Isolated**: No side effects

### When to Use Replay
- Unit testing UI components
- Testing error scenarios (return custom 500 error)
- Regression testing
- CI/CD pipelines
- Offline development

---

## Recording a HAR File

### Method 1: Automatic Recording

```typescript
import { test } from '@playwright/test';

test('record HAR file for pet creation', async ({ page }) => {
  // Start HAR recording
  await page.routeFromHAR('har-files/pet-creation.har', {
    url: '**/api/**',
    update: true,  // Create HAR if it doesn't exist
  });

  // Navigate and perform actions
  await page.goto('https://petstore.swagger.io/v2/swagger-ui.html');
  
  // Perform action that triggers API calls
  await page.click('button:has-text("Try it out")');
  await page.click('button:has-text("Execute")');
  
  // Wait for API response
  await page.waitForResponse('**/pet');
  
  // HAR file is automatically saved
});
```

### Method 2: Playwright Config

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  use: {
    // Record HAR files for all tests
    recordHar: {
      omitContent: false,
    },
  },
});
```

Run tests to record HAR:
```bash
npx playwright test
```

---

## Replaying from HAR Files

### Replay All Network Requests

```typescript
import { test, expect } from '@playwright/test';

test('replay from HAR - login flow', async ({ page }) => {
  // Replay all requests from HAR file (no real network calls)
  await page.routeFromHAR('har-files/login-flow.har', {
    url: '**/*',
  });

  // Navigate normally - all responses come from HAR
  await page.goto('https://yourapp.com/login');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  // Verify same results as recorded (because responses are identical)
  await expect(page).toHaveURL('**/dashboard');
});
```

### Replay Specific API Endpoints

```typescript
import { test, expect } from '@playwright/test';

test('replay HAR for API calls only', async ({ page }) => {
  // Replay ONLY API calls from HAR
  // Other requests go to real servers
  await page.routeFromHAR('har-files/api-calls.har', {
    url: '**/api/**',  // Only /api/* requests
    update: false,     // Don't record, only replay
  });

  await page.goto('https://yourapp.com');
  
  // API calls use HAR responses (fast)
  // Static assets come from real server (or CDN)
  // Hybrid approach: best of both worlds!
});
```

---

## Mocking API Responses

### Mock Individual Requests

```typescript
import { test, expect } from '@playwright/test';

test('mock login endpoint', async ({ request }) => {
  // Intercept POST /api/login
  await page.route('**/api/login', (route) => {
    // Return custom response
    route.abort('blockedbyclient');  // Option 1: Block request
    
    // Or return custom response
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        token: 'mock-token-12345',
        userId: 'mock-user-123',
        name: 'Test User',
      }),
    });
  });

  // Now test with mocked response
  await page.goto('https://yourapp.com/login');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  // Verify success (using mocked token)
  await expect(page).toHaveURL('**/dashboard');
});
```

### Conditional Mocking

```typescript
import { test, expect } from '@playwright/test';

test('mock endpoint with conditional logic', async ({ page }) => {
  await page.route('**/api/users/**', (route) => {
    const request = route.request();
    
    if (request.postData?.includes('admin')) {
      // For admin users, return success
      route.fulfill({
        status: 201,
        body: JSON.stringify({ userId: 'admin-001' }),
      });
    } else if (request.postData?.includes('invalid')) {
      // For invalid users, return error
      route.fulfill({
        status: 400,
        body: JSON.stringify({ error: 'Invalid email format' }),
      });
    } else {
      // For others, return different response
      route.fulfill({
        status: 201,
        body: JSON.stringify({ userId: 'user-' + Date.now() }),
      });
    }
  });

  // Test different scenarios
  // Scenario 1: Valid user
  const res1 = await page.evaluate(() => fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify({ name: 'John' })
  }).then(r => r.json()));
  
  expect(res1.userId).toContain('user-');
  
  // Scenario 2: Admin user
  const res2 = await page.evaluate(() => fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify({ name: 'admin' })
  }).then(r => r.json()));
  
  expect(res2.userId).toBe('admin-001');
});
```

### Mock Error Scenarios

```typescript
import { test, expect } from '@playwright/test';

test('handle API errors gracefully', async ({ page }) => {
  let callCount = 0;
  
  await page.route('**/api/data', (route) => {
    callCount++;
    
    if (callCount === 1) {
      // First request: return 500 error
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Internal Server Error' }),
      });
    } else if (callCount === 2) {
      // Second request: return 503 (service unavailable)
      route.fulfill({
        status: 503,
        body: JSON.stringify({ error: 'Service Temporarily Unavailable' }),
      });
    } else {
      // Third request: return success
      route.fulfill({
        status: 200,
        body: JSON.stringify({ data: 'Success!' }),
      });
    }
  });

  await page.goto('https://yourapp.com/data');
  
  // App should retry and eventually succeed
  await expect(page).toHaveText('Success!');
});
```

---

## API Testing with Playwright Request Context

### Basic API Test

```typescript
import { test, expect } from '@playwright/test';

test('API test - create pet', async ({ request }) => {
  const response = await request.post('https://petstore.swagger.io/v2/pet', {
    data: {
      id: 123456,
      name: 'Fluffy',
      photoUrls: ['https://example.com/photo.jpg'],
      status: 'available',
    },
  });

  expect(response.status()).toBe(200);
  
  const responseBody = await response.json();
  expect(responseBody).toHaveProperty('id', 123456);
  expect(responseBody).toHaveProperty('name', 'Fluffy');
});
```

### API Test with Authentication

```typescript
import { test, expect } from '@playwright/test';

test('API test - authenticated endpoint', async ({ request }) => {
  // Get auth token first
  const loginResponse = await request.post('/api/login', {
    data: {
      email: 'test@example.com',
      password: 'password123',
    },
  });
  
  const { token } = await loginResponse.json();
  
  // Use token in subsequent request
  const dataResponse = await request.get('/api/user/profile', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  expect(dataResponse.status()).toBe(200);
  const profile = await dataResponse.json();
  expect(profile).toHaveProperty('email', 'test@example.com');
});
```

### API Test with Data-Driven Testing

```typescript
import { test, expect } from '@playwright/test';

const petData = [
  { id: 1, name: 'Dog', status: 'available' },
  { id: 2, name: 'Cat', status: 'pending' },
  { id: 3, name: 'Bird', status: 'sold' },
];

for (const pet of petData) {
  test(`create pet: ${pet.name}`, async ({ request }) => {
    const response = await request.post('https://petstore.swagger.io/v2/pet', {
      data: pet,
    });
    
    expect(response.status()).toBe(200);
    const created = await response.json();
    expect(created.name).toBe(pet.name);
    expect(created.status).toBe(pet.status);
  });
}
```

---

## Combining HAR Replay with Functional Tests

```typescript
import { test, expect } from '@playwright/test';

test('use HAR for API, test UI functionality', async ({ page }) => {
  // Replay API calls from HAR (fast, deterministic)
  await page.routeFromHAR('har-files/petstore-api.har', {
    url: '**/api/**',
  });

  // But render real page (test UI)
  await page.goto('https://yourapp.com/products');
  
  // Test UI interactions
  await page.click('button[data-testid="add-to-cart"]');
  await expect(page.locator('.cart-badge')).toContainText('1');
  
  // API responses are fast and consistent
  await page.click('button[data-testid="checkout"]');
  await expect(page).toHaveURL('**/order-confirmation');
});
```

---

## Best Practices

### ✅ Do
- ✅ Use replay for UI tests (fast feedback)
- ✅ Use mocking for error scenarios
- ✅ Test both happy path and error paths
- ✅ Keep HAR files small (one flow per file)
- ✅ Sanitize HAR before committing
- ✅ Version control HAR files (update quarterly)

### ❌ Don't
- ❌ Include real passwords/tokens in HAR
- ❌ Use stale HAR files without updating
- ❌ Mock everything (test some real integration)
- ❌ Rely only on mocks (real API may differ)
- ❌ Commit unsanitized HAR files

---

## HAR Files for Petstore API

### Example HAR Entry Structure

```json
{
  "startedDateTime": "2025-11-13T10:30:00.000Z",
  "time": 245,
  "request": {
    "method": "GET",
    "url": "https://petstore.swagger.io/v2/pet/findByStatus?status=available",
    "headers": [
      {"name": "Accept", "value": "application/json"}
    ]
  },
  "response": {
    "status": 200,
    "statusText": "OK",
    "headers": [],
    "content": {
      "mimeType": "application/json",
      "text": "[{\"id\":1,\"name\":\"Dog\",\"status\":\"available\"}]"
    }
  }
}
```

---

## Summary

You now know how to:
1. **Record** HAR files from real user flows
2. **Replay** HAR files for fast, offline testing
3. **Mock** individual API endpoints
4. **Mock errors** for error scenario testing
5. **Test APIs** directly with Playwright
6. **Combine** HAR replay with UI testing

**Next Step**: Go to Part 4 for practical exercises!

