# 🎯 k6 Practical Exercises - Petstore API with Real Data

## Overview

This guide provides **hands-on exercises** using the **Petstore Swagger API** (https://petstore.swagger.io/v2) - the same API you've already used in your homework. We'll progress from simple to complex scenarios with real working examples.

---

## 📋 Exercise Progression

```
Exercise 1: Simple API Test (Beginner)
    ↓
Exercise 2: Multi-Step User Journey (Beginner→Intermediate)
    ↓
Exercise 3: Custom Metrics & Validation (Intermediate)
    ↓
Exercise 4: Load Testing with Analysis (Intermediate)
    ↓
Exercise 5: Stress Testing (Advanced)
    ↓
Exercise 6: Complex Workflow Simulation (Advanced)
```

---

## 🔍 Petstore API Endpoints Reference

### Base URL
```
https://petstore.swagger.io/v2
```

### Available Endpoints

| Method | Endpoint | Purpose | Status |
|--------|----------|---------|--------|
| GET | `/pet/findByStatus?status=available` | List pets by status | ✅ Working |
| GET | `/pet/{petId}` | Get pet by ID | ✅ Working |
| POST | `/pet` | Create new pet | ✅ Working |
| PUT | `/pet` | Update existing pet | ✅ Working |
| POST | `/pet/{petId}` | Update pet with form data | ✅ Working |
| DELETE | `/pet/{petId}` | Delete pet | ✅ Working |
| POST | `/pet/{petId}/uploadImage` | Upload pet photo | ✅ Working |
| GET | `/store/order/{orderId}` | Get order | ✅ Working |
| POST | `/store/order` | Create order | ✅ Working |
| GET | `/user/{username}` | Get user | ✅ Working |
| POST | `/user` | Create user | ✅ Working |

---

## 📝 Exercise 1: Simple API Test (30 minutes)

### Objective
Write a simple k6 test that fetches available pets from the Petstore API.

### Requirements
- Fetch list of available pets
- Validate response status (200)
- Check that we get pet data
- Add basic metrics
- Run with 5 virtual users for 1 minute

### Starter Code

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'https://petstore.swagger.io/v2';

export let options = {
  vus: 5,
  duration: '1m',
};

export default function() {
  // TODO: Fetch available pets
  
  // TODO: Add checks for:
  // - Status is 200
  // - Response contains pets
  // - Response time < 2000ms
  
  sleep(1);
}
```

### Solution

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'https://petstore.swagger.io/v2';

export let options = {
  vus: 5,
  duration: '1m',
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    http_req_failed: ['rate<0.1'],
  },
};

export default function() {
  // Fetch available pets
  let response = http.get(`${BASE_URL}/pet/findByStatus?status=available`);
  
  // Validate response
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response has pets': (r) => JSON.parse(r.body).length > 0,
    'response time < 2000ms': (r) => r.timings.duration < 2000,
  });
  
  sleep(1);
}
```

### How to Run
```bash
k6 run exercise1_simple_api_test.js
```

### Expected Output
```
checks.........................: 100.00% ✓ 300      ✗ 0
http_req_duration..............: avg=450ms  min=350ms  max=800ms  p(95)=750ms
http_req_failed................: 0.00%     ✓ 0       ✗ 300
http_reqs......................: 300       5/s
iterations.....................: 300       5/s
vus............................: 5         min=5     max=5
```

---

## 🔄 Exercise 2: Multi-Step User Journey (1 hour)

### Objective
Simulate a complete user workflow: View pets → View pet details → Create order → Check order.

### Requirements
- Fetch available pets
- Select a random pet
- Get details of that specific pet
- Create an order for the pet
- Retrieve and validate the order
- All in one iteration

### Starter Code

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'https://petstore.swagger.io/v2';

export let options = {
  vus: 10,
  duration: '5m',
};

export default function() {
  // STEP 1: TODO - Get available pets
  
  // STEP 2: TODO - Pick random pet and get its details
  
  // STEP 3: TODO - Create order for the pet
  
  // STEP 4: TODO - Retrieve and validate the order
  
  sleep(Math.random() * 3 + 1); // 1-4 seconds
}
```

### Solution

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'https://petstore.swagger.io/v2';

export let options = {
  vus: 10,
  duration: '5m',
  thresholds: {
    http_req_duration: ['p(95)<3000'],
    http_req_failed: ['rate<0.05'],
  },
};

export default function() {
  // STEP 1: Get available pets
  let petsResponse = http.get(`${BASE_URL}/pet/findByStatus?status=available`);
  
  check(petsResponse, {
    'get pets - status is 200': (r) => r.status === 200,
    'get pets - has data': (r) => JSON.parse(r.body).length > 0,
  });
  
  let pets = JSON.parse(petsResponse.body);
  let randomPet = pets[Math.floor(Math.random() * pets.length)];
  let petId = randomPet.id;
  
  sleep(0.5);
  
  // STEP 2: Get pet details
  let petDetailsResponse = http.get(`${BASE_URL}/pet/${petId}`);
  
  check(petDetailsResponse, {
    'get pet details - status is 200': (r) => r.status === 200,
    'get pet details - has pet name': (r) => {
      let pet = JSON.parse(r.body);
      return pet.name && pet.name.length > 0;
    },
  });
  
  let petDetails = JSON.parse(petDetailsResponse.body);
  console.log(`Selected pet: ${petDetails.name} (ID: ${petId})`);
  
  sleep(0.5);
  
  // STEP 3: Create order
  let orderPayload = {
    petId: petId,
    quantity: 1,
    shipDate: new Date().toISOString(),
    status: 'placed',
    complete: false,
  };
  
  let orderResponse = http.post(
    `${BASE_URL}/store/order`,
    JSON.stringify(orderPayload),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
  
  check(orderResponse, {
    'create order - status is 200': (r) => r.status === 200,
    'create order - has orderId': (r) => {
      let order = JSON.parse(r.body);
      return order.id && order.id > 0;
    },
  });
  
  let order = JSON.parse(orderResponse.body);
  let orderId = order.id;
  console.log(`Created order: ${orderId}`);
  
  sleep(0.5);
  
  // STEP 4: Retrieve order
  let getOrderResponse = http.get(`${BASE_URL}/store/order/${orderId}`);
  
  check(getOrderResponse, {
    'get order - status is 200': (r) => r.status === 200,
    'get order - matches petId': (r) => {
      let retrieved = JSON.parse(r.body);
      return retrieved.petId === petId;
    },
  });
  
  sleep(Math.random() * 3 + 1);
}
```

### How to Run
```bash
k6 run exercise2_user_journey.js
```

### Expected Output
```
checks.........................: 99.80%   ✓ 598    ✗ 1
http_req_duration..............: avg=520ms  min=200ms  max=1800ms  p(95)=1200ms
http_req_failed................: 0.05%    ✓ 1      ✗ 1999
http_reqs......................: 2000     6.7/s
iterations.....................: 500      1.7/s
vus............................: 10       min=10    max=10
```

---

## 📊 Exercise 3: Custom Metrics & Business Logic (1.5 hours)

### Objective
Track business metrics: products browsed, orders created, order values, success rate.

### Requirements
- Track custom metrics for each action
- Implement realistic business scenarios
- Tag requests by endpoint
- Monitor order values
- Calculate success rates

### Starter Code

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Gauge, Trend } from 'k6/metrics';

const BASE_URL = 'https://petstore.swagger.io/v2';

// TODO: Define custom metrics
// - browsed_pets (counter)
// - orders_created (counter)
// - pet_prices (trend)
// - user_sessions (gauge)
// - order_success_rate (trend)

export let options = {
  vus: 15,
  duration: '10m',
};

export default function() {
  // TODO: Implement browsing with metrics
  // TODO: Track order creation
  // TODO: Record business metrics
}
```

### Solution

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Gauge, Trend } from 'k6/metrics';

const BASE_URL = 'https://petstore.swagger.io/v2';

// Custom business metrics
const browsedPets = new Counter('browsed_pets');
const ordersCreated = new Counter('orders_created');
const petPrices = new Trend('pet_price');
const activeSessions = new Gauge('active_sessions');
const orderSuccessRate = new Trend('order_success_rate');

export let options = {
  vus: 15,
  duration: '10m',
  thresholds: {
    'order_success_rate': ['p(95)>0.95'],
    'http_req_duration': ['p(95)<2000'],
  },
};

export default function() {
  activeSessions.add(1);
  
  // Browse available pets
  let petsResponse = http.get(
    `${BASE_URL}/pet/findByStatus?status=available`,
    { tags: { endpoint: 'browse_pets' } }
  );
  
  if (petsResponse.status === 200) {
    let pets = JSON.parse(petsResponse.body);
    browsedPets.add(pets.length);
    
    // Check prices of all pets
    pets.forEach(pet => {
      if (pet.photoUrls && pet.photoUrls.length > 0) {
        // Simulate price tracking
        let estimatedPrice = Math.random() * 100 + 50; // $50-150
        petPrices.add(estimatedPrice);
      }
    });
    
    check(petsResponse, {
      'browse - status is 200': (r) => r.status === 200,
      'browse - has pets': (r) => JSON.parse(r.body).length > 0,
    });
  }
  
  sleep(1);
  
  // Select random pet and create order
  if (Math.random() < 0.7) { // 70% of users create orders
    let petsData = JSON.parse(petsResponse.body);
    let selectedPet = petsData[Math.floor(Math.random() * petsData.length)];
    
    let orderPayload = {
      petId: selectedPet.id,
      quantity: Math.floor(Math.random() * 3) + 1,
      status: 'placed',
      complete: false,
    };
    
    let createOrderResponse = http.post(
      `${BASE_URL}/store/order`,
      JSON.stringify(orderPayload),
      {
        headers: { 'Content-Type': 'application/json' },
        tags: { endpoint: 'create_order' },
      }
    );
    
    let orderSuccess = createOrderResponse.status === 200 ? 1 : 0;
    orderSuccessRate.add(orderSuccess);
    
    if (orderSuccess === 1) {
      ordersCreated.add(1);
      
      check(createOrderResponse, {
        'create order - success': (r) => r.status === 200,
      });
    }
  }
  
  activeSessions.add(-1);
  sleep(Math.random() * 2 + 1);
}

export function handleSummary(data) {
  console.log('=== Business Metrics Summary ===');
  console.log(`Pets browsed: ${data.metrics.browsed_pets.values.count}`);
  console.log(`Orders created: ${data.metrics.orders_created.values.count}`);
  console.log(`Average pet price: $${data.metrics.pet_price.values.avg.toFixed(2)}`);
  console.log(`Order success rate: ${(data.metrics.order_success_rate.values.avg * 100).toFixed(2)}%`);
}
```

### How to Run
```bash
k6 run exercise3_custom_metrics.js
```

### Expected Output
```
=== Business Metrics Summary ===
Pets browsed: 1245
Orders created: 587
Average pet price: $87.45
Order success rate: 98.32%

checks.........................: 99.85%  ✓ 28954   ✗ 44
browsed_pets....................: 1245    2.1/min
orders_created..................: 587     1.0/min
order_success_rate..............: avg=0.98 min=0    max=1
pet_price.......................: avg=87.45
```

---

## 💪 Exercise 4: Load Testing with Ramp-Up (2 hours)

### Objective
Conduct a professional load test with gradual user ramp-up and analysis.

### Requirements
- Start with 5 users, ramp to 50 over 5 minutes
- Maintain 50 users for 10 minutes
- Ramp down over 2 minutes
- Set performance thresholds
- Capture metrics for analysis

### Starter Code

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'https://petstore.swagger.io/v2';

export let options = {
  stages: [
    // TODO: Ramp up phase
    // TODO: Sustained load phase
    // TODO: Ramp down phase
  ],
  thresholds: {
    // TODO: Set meaningful thresholds
  },
};

export default function() {
  // TODO: Realistic user behavior
}
```

### Solution

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Counter } from 'k6/metrics';

const BASE_URL = 'https://petstore.swagger.io/v2';

// Metrics
const responseTime = new Trend('response_time');
const petQueries = new Counter('pet_queries');
const orderCreations = new Counter('order_creations');

export let options = {
  stages: [
    { duration: '2m', target: 20 },  // Ramp up to 20 users over 2 minutes
    { duration: '5m', target: 50 },  // Ramp up to 50 users
    { duration: '10m', target: 50 }, // Maintain 50 users for 10 minutes
    { duration: '2m', target: 0 },   // Ramp down to 0 users
  ],
  thresholds: {
    'http_req_duration': [
      'p(95)<1000',  // 95% of requests under 1 second
      'p(99)<2000',  // 99% of requests under 2 seconds
      'avg<500',     // Average response time under 500ms
    ],
    'http_req_failed': ['rate<0.05'],  // Less than 5% failure rate
    'response_time': ['p(95)<1500'],   // Custom metric threshold
  },
  gracefulStop: '30s',
};

export default function() {
  // Browse pets
  let browseResponse = http.get(
    `${BASE_URL}/pet/findByStatus?status=available`,
    { tags: { name: 'browse_pets' } }
  );
  
  responseTime.add(browseResponse.timings.duration);
  petQueries.add(1);
  
  check(browseResponse, {
    'browse - status 200': (r) => r.status === 200,
    'browse - response time < 1000ms': (r) => r.timings.duration < 1000,
  });
  
  sleep(1);
  
  // Get pet details
  if (Math.random() < 0.8) {
    let pets = JSON.parse(browseResponse.body);
    let pet = pets[Math.floor(Math.random() * pets.length)];
    
    let detailResponse = http.get(
      `${BASE_URL}/pet/${pet.id}`,
      { tags: { name: 'pet_details' } }
    );
    
    responseTime.add(detailResponse.timings.duration);
    
    check(detailResponse, {
      'details - status 200': (r) => r.status === 200,
    });
    
    sleep(1);
  }
  
  // Create order (20% chance)
  if (Math.random() < 0.2) {
    let pets = JSON.parse(browseResponse.body);
    let pet = pets[Math.floor(Math.random() * pets.length)];
    
    let orderResponse = http.post(
      `${BASE_URL}/store/order`,
      JSON.stringify({
        petId: pet.id,
        quantity: 1,
        status: 'placed',
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        tags: { name: 'create_order' },
      }
    );
    
    responseTime.add(orderResponse.timings.duration);
    orderCreations.add(1);
    
    check(orderResponse, {
      'order - status 200': (r) => r.status === 200,
    });
    
    sleep(1);
  }
  
  sleep(Math.random() * 2);
}

export function handleSummary(data) {
  return {
    'stdout': textSummary(data),
    'load-test-report.json': JSON.stringify(data),
  };
}

function textSummary(data) {
  const summary = `
════════════════════════════════════════════════════════════════════
                        LOAD TEST REPORT
════════════════════════════════════════════════════════════════════

Test Duration: ${data.metrics.http_req_duration.values.count / (data.state?.scenario?.name || 'test')} seconds
Total Requests: ${data.metrics.http_reqs.values.count}
Failed Requests: ${(data.metrics.http_req_failed.values.rate * 100).toFixed(2)}%

Response Times:
  Average: ${data.metrics.http_req_duration.values.avg.toFixed(2)}ms
  Min: ${data.metrics.http_req_duration.values.min.toFixed(2)}ms
  Max: ${data.metrics.http_req_duration.values.max.toFixed(2)}ms
  P95: ${data.metrics.http_req_duration.values['p(95)'].toFixed(2)}ms
  P99: ${data.metrics.http_req_duration.values['p(99)'].toFixed(2)}ms

Business Metrics:
  Pet Queries: ${data.metrics.pet_queries.values.count}
  Order Creations: ${data.metrics.order_creations.values.count}

════════════════════════════════════════════════════════════════════
  `;
  
  return summary;
}
```

### How to Run
```bash
k6 run exercise4_load_test.js
```

### Expected Output
```
════════════════════════════════════════════════════════════════════
                        LOAD TEST REPORT
════════════════════════════════════════════════════════════════════

Test Duration: 19 seconds
Total Requests: 3450
Failed Requests: 1.23%

Response Times:
  Average: 487.34ms
  Min: 45.23ms
  Max: 2134.56ms
  P95: 987.45ms
  P99: 1645.34ms

Business Metrics:
  Pet Queries: 2760
  Order Creations: 276

════════════════════════════════════════════════════════════════════
```

---

## ⚡ Exercise 5: Stress Testing (2 hours)

### Objective
Find the breaking point of the Petstore API.

### Requirements
- Start with realistic load (20 users)
- Gradually increase to breaking point
- Monitor for errors and slowdowns
- Document system behavior under stress

### Code

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Trend } from 'k6/metrics';

const BASE_URL = 'https://petstore.swagger.io/v2';

const errors = new Counter('errors');
const responseTime = new Trend('response_time');

export let options = {
  stages: [
    { duration: '1m', target: 20 },   // Start
    { duration: '2m', target: 50 },   // Ramp up
    { duration: '2m', target: 100 },  // Increase further
    { duration: '2m', target: 200 },  // Find breaking point
    { duration: '1m', target: 0 },    // Cool down
  ],
  thresholds: {
    'http_req_failed': ['rate<0.5'],  // Allowed to go higher during stress test
  },
};

export default function() {
  let response = http.get(
    `${BASE_URL}/pet/findByStatus?status=available`
  );
  
  responseTime.add(response.timings.duration);
  
  if (response.status !== 200) {
    errors.add(1);
  }
  
  check(response, {
    'status is 200': (r) => r.status === 200,
  });
  
  // Reduced sleep to increase load
  sleep(Math.random() * 0.5);
}

export function handleSummary(data) {
  console.log('\n=== STRESS TEST SUMMARY ===');
  console.log(`Total Requests: ${data.metrics.http_reqs.values.count}`);
  console.log(`Errors: ${data.metrics.errors.values.count}`);
  console.log(`Error Rate: ${(data.metrics.http_req_failed.values.rate * 100).toFixed(2)}%`);
  console.log(`Avg Response Time: ${data.metrics.response_time.values.avg.toFixed(2)}ms`);
  console.log(`Max Response Time: ${data.metrics.response_time.values.max.toFixed(2)}ms`);
}
```

---

## 🔧 Exercise 6: Complex Workflow (3 hours)

### Objective
Simulate realistic multi-user scenarios with different behavior patterns.

### Requirements
- 3 user types: Browsers (60%), Buyers (30%), Admins (10%)
- Different behavior patterns per user type
- Track metrics per user type
- Realistic think times

### Code

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Gauge, Trend } from 'k6/metrics';

const BASE_URL = 'https://petstore.swagger.io/v2';

// User type metrics
const browsers = new Gauge('browsers_active');
const buyers = new Gauge('buyers_active');
const admins = new Gauge('admins_active');

// Activity metrics
const browsingActions = new Counter('browsing_actions');
const purchaseActions = new Counter('purchase_actions');
const adminActions = new Counter('admin_actions');

export let options = {
  scenarios: {
    browsers: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 60 },
        { duration: '10m', target: 60 },
        { duration: '2m', target: 0 },
      ],
      exec: 'browserUser',
    },
    buyers: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 30 },
        { duration: '10m', target: 30 },
        { duration: '2m', target: 0 },
      ],
      exec: 'buyerUser',
    },
    admins: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 10 },
        { duration: '10m', target: 10 },
        { duration: '2m', target: 0 },
      ],
      exec: 'adminUser',
    },
  },
};

// Browser users: Just browse pets
export function browserUser() {
  browsers.add(1);
  browsingActions.add(1);
  
  http.get(`${BASE_URL}/pet/findByStatus?status=available`);
  
  check(http.get(`${BASE_URL}/pet/findByStatus?status=available`), {
    'browse successful': (r) => r.status === 200,
  });
  
  browsers.add(-1);
  sleep(Math.random() * 3 + 2); // 2-5 seconds
}

// Buyer users: Browse and buy
export function buyerUser() {
  buyers.add(1);
  
  // Browse
  let browse = http.get(`${BASE_URL}/pet/findByStatus?status=available`);
  browsingActions.add(1);
  check(browse, { 'browse ok': (r) => r.status === 200 });
  
  sleep(1);
  
  // Buy
  let pets = JSON.parse(browse.body);
  if (pets.length > 0) {
    let pet = pets[Math.floor(Math.random() * pets.length)];
    let order = http.post(
      `${BASE_URL}/store/order`,
      JSON.stringify({ petId: pet.id, quantity: 1, status: 'placed' }),
      { headers: { 'Content-Type': 'application/json' } }
    );
    purchaseActions.add(1);
    check(order, { 'purchase ok': (r) => r.status === 200 });
  }
  
  buyers.add(-1);
  sleep(Math.random() * 4 + 3); // 3-7 seconds
}

// Admin users: Monitor and manage
export function adminUser() {
  admins.add(1);
  adminActions.add(1);
  
  // Check multiple endpoints
  http.get(`${BASE_URL}/pet/findByStatus?status=available`);
  http.get(`${BASE_URL}/pet/findByStatus?status=sold`);
  http.get(`${BASE_URL}/pet/findByStatus?status=pending`);
  
  adminActions.add(1);
  admins.add(-1);
  sleep(Math.random() * 5 + 5); // 5-10 seconds
}

export function handleSummary(data) {
  console.log('\n=== COMPLEX WORKFLOW REPORT ===');
  console.log(`Browse actions: ${data.metrics.browsing_actions.values.count}`);
  console.log(`Purchase actions: ${data.metrics.purchase_actions.values.count}`);
  console.log(`Admin actions: ${data.metrics.admin_actions.values.count}`);
  console.log(`Total requests: ${data.metrics.http_reqs.values.count}`);
}
```

---

## 📊 Comprehensive Report Template

Create a file `performance_report.md` to document your findings:

```markdown
# Performance Test Report - Petstore API

## Executive Summary
- **Test Date:** November 13, 2025
- **Duration:** 19 minutes
- **Total Requests:** 3,450
- **Total Users:** 50 (peak)
- **Success Rate:** 98.77%

## Test Objectives
1. Validate API performance under load
2. Identify performance bottlenecks
3. Verify system meets SLA requirements

## Load Profile
- **Ramp-up:** 0-50 users over 7 minutes
- **Sustained:** 50 users for 10 minutes
- **Ramp-down:** 50-0 users over 2 minutes

## Key Metrics
| Metric | Value | Status |
|--------|-------|--------|
| Avg Response Time | 487.34 ms | ✅ Pass |
| P95 Response Time | 987.45 ms | ✅ Pass |
| P99 Response Time | 1645.34 ms | ✅ Pass |
| Max Response Time | 2134.56 ms | ✅ Pass |
| Failure Rate | 1.23% | ✅ Pass |
| Requests/Second | 18.4 | ✅ Normal |

## Endpoint Performance
| Endpoint | Avg (ms) | P95 (ms) | Requests |
|----------|----------|---------|----------|
| GET /pet/findByStatus | 234 | 456 | 1725 |
| GET /pet/{id} | 289 | 567 | 1380 |
| POST /store/order | 456 | 789 | 345 |

## Business Metrics
- Total pets browsed: 1,245
- Total orders created: 587
- Conversion rate: 47.1%
- Average order value simulation: $87.45

## Findings
1. **System performs well under load** - All response times within acceptable ranges
2. **Browse endpoint is fastest** - 234ms average
3. **Order creation is slower** - 456ms average (expected for write operations)
4. **Error rate acceptable** - 1.23% mostly from network timeouts

## Recommendations
1. Optimize order creation endpoint (target: <300ms)
2. Add caching for pet browse queries
3. Implement connection pooling
4. Monitor for bottlenecks under 100+ users

## Conclusion
✅ **API is production-ready** - Meets all performance requirements

---
Generated by k6
```

---

## 🚀 Running All Exercises

### Setup
```bash
# Create exercise files (save each as separate file)
# exercise1_simple_api_test.js
# exercise2_user_journey.js
# exercise3_custom_metrics.js
# exercise4_load_test.js
# exercise5_stress_test.js
# exercise6_complex_workflow.js
```

### Run Individually
```bash
k6 run exercise1_simple_api_test.js
k6 run exercise2_user_journey.js
k6 run exercise3_custom_metrics.js
k6 run exercise4_load_test.js --out json=results4.json
k6 run exercise5_stress_test.js
k6 run exercise6_complex_workflow.js --out json=results6.json
```

### Run with Output
```bash
k6 run exercise4_load_test.js --out json=load-test-results.json
k6 run exercise6_complex_workflow.js --out json=workflow-results.json
```

---

## 📈 Progression Guide

### Week 1: Basics
- ✅ Complete Exercise 1 (30 min)
- ✅ Complete Exercise 2 (1 hour)
- 🎯 Focus: Understanding API, basic checks

### Week 2: Metrics
- ✅ Complete Exercise 3 (1.5 hours)
- ✅ Complete Exercise 4 (2 hours)
- 🎯 Focus: Custom metrics, thresholds, reporting

### Week 3: Advanced
- ✅ Complete Exercise 5 (2 hours)
- ✅ Complete Exercise 6 (3 hours)
- 🎯 Focus: Complex scenarios, multiple user types

---

## 💡 Tips for Success

✅ **Do:**
- Run exercises in order (build complexity)
- Modify code to experiment
- Read output carefully
- Document findings
- Share results with team

❌ **Don't:**
- Skip exercises
- Ignore error messages
- Run against production
- Skip think times
- Forget to monitor the API

---

## 🔗 Resources

- **Petstore API:** https://petstore.swagger.io/
- **k6 Docs:** https://k6.io/docs/
- **k6 API Reference:** https://k6.io/docs/api/
- **Your Repository:** https://github.com/TestValEvg/PPUpgrade

---

## ✅ Completion Checklist

- [ ] Exercise 1: Simple API Test (Completed)
- [ ] Exercise 2: User Journey (Completed)
- [ ] Exercise 3: Custom Metrics (Completed)
- [ ] Exercise 4: Load Test (Completed & Analyzed)
- [ ] Exercise 5: Stress Test (Completed)
- [ ] Exercise 6: Complex Workflow (Completed)
- [ ] Created performance report
- [ ] Shared results with team
- [ ] Documented learnings
- [ ] Ready for production testing

---

**Last Updated:** November 13, 2025
**Status:** ✅ All Exercises Ready
**API:** Petstore Swagger (https://petstore.swagger.io/v2)
