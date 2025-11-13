# Part 4: Practical Exercises & Challenges

## Exercise 1: Capture and Create API Test

### Objective
Capture a HAR file from a real user flow and convert it into a functional API test.

### Steps

#### 1. Capture the HAR File
```typescript
// tests/exercise1-capture.spec.ts
import { test } from '@playwright/test';

test('EXERCISE 1: Capture HAR - get available pets flow', async ({ page }) => {
  // Start HAR recording
  await page.routeFromHAR('har-files/exercise1-get-pets.har', {
    url: '**/api/**',
    update: true,
  });

  // Navigate to Petstore Swagger UI
  await page.goto('https://petstore.swagger.io/v2/swagger-ui.html');
  
  // Find and click the GET /pet/findByStatus endpoint
  await page.click('text=/pet/findByStatus');
  
  // Click "Try it out"
  await page.click('button:has-text("Try it out")');
  
  // The "status" parameter should default to "available"
  // Click "Execute"
  await page.click('button:has-text("Execute")');
  
  // Wait for response
  await page.waitForResponse('**/findByStatus');
  
  // Verify response is visible
  await page.waitForSelector('.response-content', { state: 'visible' });
  
  // HAR file now contains the API request and response
});
```

Run to capture:
```bash
npx playwright test exercise1-capture.spec.ts
```

#### 2. Create API Test from HAR
```typescript
// tests/exercise1-api-test.spec.ts
import { test, expect } from '@playwright/test';

test('EXERCISE 1: API test - get available pets', async ({ request }) => {
  // This mirrors the request captured in the HAR file
  const response = await request.get(
    'https://petstore.swagger.io/v2/pet/findByStatus?status=available'
  );

  // Assertions
  expect(response.status()).toBe(200);
  
  const pets = await response.json();
  expect(Array.isArray(pets)).toBe(true);
  
  // All pets should have status "available"
  for (const pet of pets) {
    expect(pet).toHaveProperty('status', 'available');
    expect(pet).toHaveProperty('id');
  }
});
```

Run the test:
```bash
npx playwright test exercise1-api-test.spec.ts
```

### Expected Results
- ✅ HAR file created with GET /pet/findByStatus request
- ✅ API test passes with array of available pets
- ✅ All pets have correct status

### Challenge Questions
1. What would happen if you captured the same flow twice? Would the HAR file be identical?
2. Can you modify the test to filter by different status values (pending, sold)?
3. How would you know if the HAR file needs to be updated?

---

## Exercise 2: Mock and Validate

### Objective
Mock an API endpoint and validate UI behavior with different response scenarios.

### Steps

#### 1. Mock Success Response
```typescript
// tests/exercise2-mock-success.spec.ts
import { test, expect } from '@playwright/test';

test('EXERCISE 2: Mock API - successful pet creation', async ({ page }) => {
  // Mock POST /api/pet endpoint
  await page.route('**/pet', (route) => {
    if (route.request().method() === 'POST') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 999,
          name: 'MockedDog',
          photoUrls: [],
          status: 'available',
          tags: []
        }),
      });
    } else {
      route.continue();
    }
  });

  // Simulate creating a pet
  const createResponse = await page.evaluate(() => {
    return fetch('https://petstore.swagger.io/v2/pet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'MockedDog',
        photoUrls: [],
        status: 'available'
      })
    }).then(r => r.json());
  });

  // Verify response
  expect(createResponse.name).toBe('MockedDog');
  expect(createResponse.status).toBe('available');
});
```

#### 2. Mock Error Response
```typescript
// tests/exercise2-mock-error.spec.ts
import { test, expect } from '@playwright/test';

test('EXERCISE 2: Mock API - pet creation error', async ({ page }) => {
  // Mock POST /api/pet to return error
  await page.route('**/pet', (route) => {
    if (route.request().method() === 'POST') {
      route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          code: 400,
          message: 'Invalid input'
        }),
      });
    } else {
      route.continue();
    }
  });

  // Attempt to create pet
  let errorOccurred = false;
  try {
    await page.evaluate(() => {
      return fetch('https://petstore.swagger.io/v2/pet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Invalid' })
      }).then(r => {
        if (!r.ok) throw new Error('Failed');
        return r.json();
      });
    });
  } catch (e) {
    errorOccurred = true;
  }

  expect(errorOccurred).toBe(true);
});
```

#### 3. Mock Timeout/Retry
```typescript
// tests/exercise2-mock-retry.spec.ts
import { test, expect } from '@playwright/test';

test('EXERCISE 2: Mock API - retry on failure', async ({ page }) => {
  let attempts = 0;
  
  await page.route('**/pet', (route) => {
    attempts++;
    
    if (attempts === 1) {
      // First attempt: timeout (abort)
      route.abort('timedout');
    } else {
      // Retry: success
      route.fulfill({
        status: 200,
        body: JSON.stringify({ id: 123, name: 'Dog' }),
      });
    }
  });

  // Application logic to handle retries would go here
  // Then verify it eventually succeeded
  expect(attempts).toBeGreaterThan(1);
});
```

### Expected Results
- ✅ Mock success endpoint returns valid pet data
- ✅ Mock error endpoint properly returns 400
- ✅ Mock retry scenarios work correctly

### Challenge Questions
1. What other HTTP status codes should you test? (500, 503, 429, etc.)
2. How would you mock a slow response (delay 5 seconds)?
3. Can you mock multiple endpoints in one test?

---

## Exercise 3: Go Offline with HAR Replay

### Objective
Record a complete flow and replay it offline without network calls.

### Steps

#### 1. Record Complete Flow
```typescript
// tests/exercise3-record.spec.ts
import { test } from '@playwright/test';

test('EXERCISE 3: Record complete pet checkout flow', async ({ page }) => {
  // Record all network requests
  await page.routeFromHAR('har-files/exercise3-complete-flow.har', {
    url: '**/*',
    update: true,
  });

  // Step 1: View available pets
  await page.goto('https://petstore.swagger.io/v2/swagger-ui.html');
  await page.waitForLoadState('networkidle');

  // Step 2: Get available pets
  await page.click('text=/pet/findByStatus');
  await page.click('button:has-text("Try it out")');
  await page.click('button:has-text("Execute")');
  await page.waitForResponse('**/findByStatus');

  // Step 3: Get single pet details
  await page.click('text=/pet/{petId}');
  await page.click('button:has-text("Try it out")');
  await page.fill('input[name="petId"]', '1');
  await page.click('button:has-text("Execute")');
  await page.waitForResponse('**/pet/1');

  // HAR file now contains entire flow
});
```

Record the flow:
```bash
npx playwright test exercise3-record.spec.ts
```

#### 2. Replay Offline
```typescript
// tests/exercise3-replay.spec.ts
import { test, expect } from '@playwright/test';

test('EXERCISE 3: Replay from HAR offline', async ({ page }) => {
  // Replay everything from HAR - no network needed!
  await page.routeFromHAR('har-files/exercise3-complete-flow.har', {
    url: '**/*',
  });

  // This test works exactly the same as recorded, but OFFLINE
  await page.goto('https://petstore.swagger.io/v2/swagger-ui.html');
  
  // All responses come from HAR file (instant, no network)
  await page.click('text=/pet/findByStatus');
  await page.click('button:has-text("Try it out")');
  await page.click('button:has-text("Execute")');
  
  // Verify response is visible (HAR replay)
  await expect(page.locator('.response-content')).toBeVisible();
});
```

Run the replay test:
```bash
npx playwright test exercise3-replay.spec.ts
```

#### 3. Verify Speed Improvement
```typescript
// tests/exercise3-performance.spec.ts
import { test, expect } from '@playwright/test';

test('EXERCISE 3: Compare real vs replay performance', async ({ page }) => {
  // Time real network call
  const startReal = Date.now();
  const response1 = await page.evaluate(() => {
    return fetch('https://petstore.swagger.io/v2/pet/findByStatus?status=available')
      .then(r => r.json());
  });
  const realTime = Date.now() - startReal;

  // Replay from HAR (should be much faster)
  await page.routeFromHAR('har-files/exercise3-complete-flow.har');
  
  const startReplay = Date.now();
  const response2 = await page.evaluate(() => {
    return fetch('https://petstore.swagger.io/v2/pet/findByStatus?status=available')
      .then(r => r.json());
  });
  const replayTime = Date.now() - startReplay;

  console.log(`Real time: ${realTime}ms, Replay time: ${replayTime}ms`);
  
  // HAR replay should be significantly faster
  expect(replayTime).toBeLessThan(realTime / 2);
});
```

### Expected Results
- ✅ HAR file records complete flow
- ✅ Replay test works offline
- ✅ Replay is 5-10x faster than real network

### Challenge Questions
1. How large is your HAR file? Can you estimate how much bandwidth it saves?
2. What happens if you try to replay with update: true? (Try it!)
3. Can you create a HAR file that mixes real and fake responses?

---

## Exercise 4 (Advanced): k6 Load Test

### Objective
Create a load test script and measure API performance under stress.

### Steps

#### 1. Create Load Test Script
```javascript
// exercise4-load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter } from 'k6/metrics';

// Custom metrics
const successCount = new Counter('successful_requests');
const failureCount = new Counter('failed_requests');

export const options = {
  vus: 5,               // Start with 5 virtual users
  duration: '30s',      // Run for 30 seconds
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    http_req_failed: ['rate<0.05'],
  },
};

export default function () {
  // Get available pets
  const res = http.get('https://petstore.swagger.io/v2/pet/findByStatus?status=available');
  
  const success = check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
    'response is array': (r) => Array.isArray(JSON.parse(r.body)),
  });
  
  if (success) {
    successCount.add(1);
  } else {
    failureCount.add(1);
  }
  
  sleep(1);
}
```

#### 2. Run Basic Load Test
```bash
k6 run exercise4-load-test.js
```

#### 3. Run Extended Stress Test
```bash
# Gradually increase load
k6 run exercise4-load-test.js --stage 30s:10 --stage 30s:25 --stage 30s:50
```

#### 4. Analyze Results
```bash
# Save results to JSON for analysis
k6 run exercise4-load-test.js --out json=exercise4-results.json
```

Parse results:
```javascript
// analyze-results.js
const fs = require('fs');
const results = JSON.parse(fs.readFileSync('exercise4-results.json', 'utf8'));

// Find max response time
const maxDuration = Math.max(...results.map(r => r.data.duration || 0));
console.log(`Max response time: ${maxDuration}ms`);

// Count successes/failures
const metrics = {};
results.forEach(r => {
  const counter = r.metric;
  metrics[counter] = (metrics[counter] || 0) + r.data.value;
});

console.log('Metrics:', metrics);
```

### Expected Results
- ✅ Load test runs for 30 seconds
- ✅ Shows performance metrics (response time, throughput)
- ✅ Identifies any failures under load
- ✅ Results saved to JSON for analysis

### Challenge Questions
1. At what VU count does performance degrade?
2. What's the maximum response time under load?
3. Can you create a test that stresses until failure?

---

## Exercise Solutions & Discussion

### Solution: Exercise 1 (Complete)
```typescript
// Full example combining capture + API test
import { test, expect } from '@playwright/test';

test.describe('Exercise 1: Complete Solution', () => {
  test('capture HAR', async ({ page }) => {
    await page.routeFromHAR('har-files/ex1-full.har', { url: '**/api/**', update: true });
    await page.goto('https://petstore.swagger.io/v2/swagger-ui.html');
    await page.click('text=/pet/findByStatus');
    await page.click('button:has-text("Try it out")');
    await page.click('button:has-text("Execute")');
    await page.waitForResponse('**/findByStatus');
  });

  test('replay HAR and test API', async ({ request }) => {
    const response = await request.get(
      'https://petstore.swagger.io/v2/pet/findByStatus?status=available'
    );
    expect(response.status()).toBe(200);
    const pets = await response.json();
    expect(Array.isArray(pets)).toBe(true);
    expect(pets.length).toBeGreaterThan(0);
  });
});
```

---

## Bonus Challenges

### Challenge 1: Multi-Status HAR
Create a HAR file that captures GET requests for all three statuses:
- available
- pending
- sold

```typescript
test('capture all statuses', async ({ page }) => {
  // TODO: Implement
});
```

### Challenge 2: Error Recovery
Create a test that mocks an API error, then retries and succeeds:

```typescript
test('mock error then retry success', async ({ page }) => {
  // TODO: Implement
});
```

### Challenge 3: Performance Comparison
Create a script that shows response time improvement using HAR vs real network:

```typescript
test('compare HAR replay vs real API', async ({ page }) => {
  // TODO: Implement - measure both and print comparison
});
```

### Challenge 4: Complete k6 Spike Test
Create a k6 script that simulates a spike from 10 to 500 VUs:

```javascript
// TODO: Implement - test how API handles extreme load
export const options = {
  stages: [
    { duration: '10s', target: 10 },
    { duration: '5s', target: 500 },
    { duration: '10s', target: 500 },
    { duration: '5s', target: 10 },
  ],
};
```

---

## Summary

You've now completed all 4 exercises:
1. ✅ Captured and created an API test
2. ✅ Mocked endpoints for different scenarios
3. ✅ Replayed HAR files offline
4. ✅ Performed load testing with k6

**What You've Learned**:
- How to capture real user flows as HAR files
- Convert HAR files to API tests
- Mock APIs for testing error scenarios
- Run tests offline using HAR replay
- Perform load and stress testing
- Analyze performance results

**Next Steps**:
- Practice with your own APIs
- Integrate tests into CI/CD pipeline
- Set performance baselines
- Monitor trends over time

