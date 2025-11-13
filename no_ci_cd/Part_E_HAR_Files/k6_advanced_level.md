# k6 Advanced Level - Complete Learning Guide

## 📚 Table of Contents

- [Part 1: Fundamentals](#part-1-fundamentals)
- [Part 2: Advanced Techniques](#part-2-advanced-techniques)
- [Part 3: Real-World Exercises](#part-3-real-world-exercises)

---

## Part 1: Fundamentals

### What is k6?

k6 is a modern, developer-centric performance testing tool that uses JavaScript as the scripting language. It's designed to test the performance of APIs, microservices, and websites under various load conditions.

### Why k6?

- **JavaScript-based**: Easy to learn and write tests
- **Cloud and on-premise**: Can run locally or in the cloud
- **CI/CD friendly**: Integrates well with development workflows
- **Rich metrics**: Comprehensive performance insights
- **Scalable**: Can simulate thousands of virtual users

### k6 Installation

```bash
# macOS (using Homebrew)
brew install k6

# Windows (using Chocolatey)
choco install k6

# Linux (using package manager)
sudo apt-get install k6
```

### Basic k6 Script Structure

Every k6 script follows this basic structure:

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 10,        // Virtual users
  duration: '30s', // Test duration
};

export default function() {
  // Your test logic here
  let response = http.get('https://api.example.com/users');
  
  // Validation
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  
  sleep(1); // Think time between requests
}
```

### Types of Performance Tests

#### 1. Load Testing

Tests normal expected load to verify system behavior under typical conditions.

```javascript
export let options = {
  stages: [
    { duration: '5m', target: 100 },  // Ramp up to 100 users
    { duration: '10m', target: 100 }, // Stay at 100 users
    { duration: '5m', target: 0 },    // Ramp down to 0 users
  ],
};
```

**Use Cases:**
- Verify expected system behavior under normal load
- Establish baseline performance metrics
- Identify performance bottlenecks
- Ensure system meets SLA requirements

#### 2. Stress Testing

Gradually increases load to find the breaking point.

```javascript
export let options = {
  stages: [
    { duration: '2m', target: 100 },
    { duration: '5m', target: 100 },
    { duration: '2m', target: 200 },
    { duration: '5m', target: 200 },
    { duration: '2m', target: 300 },
    { duration: '5m', target: 300 },
    { duration: '2m', target: 400 },
    { duration: '5m', target: 400 },
    { duration: '10m', target: 0 },
  ],
};
```

**Use Cases:**
- Find the system's breaking point
- Determine maximum capacity
- Identify failure modes
- Test error handling under extreme load

#### 3. Spike Testing

Tests system behavior under sudden load spikes.

```javascript
export let options = {
  stages: [
    { duration: '10s', target: 100 }, // Below normal load
    { duration: '1m', target: 100 },
    { duration: '20s', target: 1400 }, // Spike to 1400 users
    { duration: '3m', target: 1400 },  // Stay at 1400 for 3 minutes
    { duration: '20s', target: 100 },  // Scale down
    { duration: '3m', target: 100 },
    { duration: '20s', target: 0 },
  ],
};
```

**Use Cases:**
- Test system recovery after sudden traffic surge
- Verify auto-scaling mechanisms
- Check resource cleanup
- Identify timeout issues

#### 4. Endurance Testing

Tests system stability over extended periods.

```javascript
export let options = {
  stages: [
    { duration: '5m', target: 100 },   // Ramp up
    { duration: '4h', target: 100 },   // Stay for 4 hours
    { duration: '5m', target: 0 },     // Ramp down
  ],
};
```

**Use Cases:**
- Detect memory leaks
- Verify database connection pooling
- Identify resource degradation over time
- Test long-running transactions

### Key Performance Metrics

#### Built-in Metrics

| Metric | Description |
|--------|-------------|
| `http_req_duration` | Total request time |
| `http_req_blocked` | Time blocked before request |
| `http_req_connecting` | Time establishing TCP connection |
| `http_req_sending` | Time sending data |
| `http_req_waiting` | Time waiting for response |
| `http_req_receiving` | Time receiving response data |
| `http_reqs` | Total number of requests |
| `http_req_failed` | Rate of failed requests |

#### Custom Metrics

k6 provides excellent built-in metrics, but sometimes you need to measure something specific to your business logic. Custom metrics let you track any numerical value you want.

**Common use cases:**
- Tracking the time for a specific workflow step
- Measuring the size of specific JSON response elements
- Counting business-specific events (e.g., "items added to cart")

**Custom Metric Types:**

```javascript
import { Counter, Gauge, Rate, Trend } from 'k6/metrics';

let errorCounter = new Counter('errors');
let responseTimeGauge = new Gauge('response_time');
let successRate = new Rate('success_rate');
let customTrend = new Trend('custom_metric');

export default function() {
  let response = http.get('https://api.example.com/data');
  
  if (response.status !== 200) {
    errorCounter.add(1);
  }
  
  responseTimeGauge.add(response.timings.duration);
  successRate.add(response.status === 200);
  customTrend.add(response.timings.duration);
}
```

**Metric Types Explained:**
- **Counter**: A value that accumulates (e.g., total logins)
- **Gauge**: A value that can go up or down (e.g., number of items in queue)
- **Rate**: Tracks the frequency of an event (e.g., percentage of successful checkouts)
- **Trend**: Perfect for response times and calculating statistics on series of values

### Reading k6 Reports

#### Command Line Output

```
✓ status is 200
✓ response time < 500ms

checks.........................: 100.00% ✓ 1000      ✗ 0
data_received..................: 1.2 MB  40 kB/s
data_sent......................: 89 kB   3.0 kB/s
http_req_blocked...............: avg=1.2ms    min=0s       med=0s      max=15.3ms  p(90)=0s      p(95)=8.7ms
http_req_connecting............: avg=580µs    min=0s       med=0s      max=7.8ms   p(90)=0s      p(95)=4.1ms
http_req_duration..............: avg=45.2ms   min=31.2ms   med=43.1ms  max=89.7ms  p(90)=58.4ms  p(95)=67.2ms
http_req_failed................: 0.00%   ✓ 0         ✗ 1000
http_req_receiving.............: avg=125µs    min=49µs     med=98µs    max=1.1ms   p(90)=182µs   p(95)=259µs
http_req_sending...............: avg=65µs     min=25µs     med=59µs    max=181µs   p(90)=97µs    p(95)=125µs
http_req_waiting...............: avg=45ms     min=31.1ms   med=42.9ms  max=89.5ms  p(90)=58.2ms  p(95)=67ms
http_reqs......................: 1000    33.3/s
iteration_duration.............: avg=1.04s    min=1.03s    med=1.04s   max=1.09s   p(90)=1.05s   p(95)=1.06s
iterations.....................: 1000    33.3/s
vus............................: 10      min=10      max=10
vus_max........................: 10      min=10      max=10
```

#### Understanding Key Values

| Term | Meaning |
|------|---------|
| `avg` | Average value |
| `min/max` | Minimum and maximum values |
| `med` | Median (50th percentile) |
| `p(90)` | 90th percentile (90% of requests were faster) |
| `p(95)` | 95th percentile (95% of requests were faster) |

### Best Practices

#### 1. Test Environment

```javascript
// Use dedicated test environments
// Ensure test data is representative
// Monitor resource usage on test machines
```

**Guidelines:**
- Test against staging environment, not production
- Use realistic test data that mirrors production patterns
- Monitor CPU, memory, and network on the load generator
- Ensure target system logging is enabled

#### 2. Script Design

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

// Use environment variables for configuration
const BASE_URL = __ENV.BASE_URL || 'https://api.example.com';
const API_KEY = __ENV.API_KEY || 'default-key';

export let options = {
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must be below 500ms
    http_req_failed: ['rate<0.1'],    // Error rate must be below 10%
  },
};

export default function() {
  const params = {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
  };

  let response = http.get(`${BASE_URL}/users`, params);
  
  check(response, {
    'status is 200': (r) => r.status === 200,
    'has users': (r) => JSON.parse(r.body).users.length > 0,
  });
  
  sleep(Math.random() * 2 + 1); // Random sleep between 1-3 seconds
}
```

**Best Practices:**
- Use environment variables for configuration
- Implement realistic think times (random delays)
- Use comprehensive checks for validation
- Add meaningful assertions

#### 3. Data Management

```javascript
import { SharedArray } from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';

// Load test data once and share between VUs
const testData = new SharedArray('users', function () {
  const csvData = papaparse.parse(open('./users.csv'), { header: true });
  return csvData.data;
});

export default function() {
  const randomUser = testData[Math.floor(Math.random() * testData.length)];
  
  let response = http.post('https://api.example.com/login', {
    username: randomUser.username,
    password: randomUser.password,
  });
  
  check(response, {
    'login successful': (r) => r.status === 200,
  });
}
```

**Data Best Practices:**
- Use SharedArray to load data once and share across VUs
- Implement data cycling strategies
- Clean up test data after tests
- Use realistic data volumes

### Using GitHub Copilot for k6 Test Generation

#### Setting Up Copilot Context

When using GitHub Copilot to generate k6 tests, provide clear context in comments:

```javascript
// Generate a k6 performance test for an e-commerce API
// Test should include:
// - User authentication
// - Browse products
// - Add items to cart
// - Checkout process
// - Include realistic think times
// - Use 50 virtual users ramping up over 2 minutes

import http from 'k6/http';
import { check, sleep } from 'k6';

// Copilot will generate the rest based on your context
```

#### Example Prompts for Copilot

**Basic API Test:**
```javascript
// Create a k6 test that authenticates users and fetches their profile data
// Include error handling and response validation
```

**Complex Workflow:**
```javascript
// Generate a k6 test simulating a complete user journey:
// 1. Register new user
// 2. Login
// 3. Update profile
// 4. Logout
// Add appropriate checks and realistic delays
```

**Load Pattern:**
```javascript
// Create a stress test configuration that:
// - Starts with 10 users
// - Ramps up to 100 users over 5 minutes
// - Maintains 100 users for 10 minutes
// - Ramps down to 0 over 2 minutes
```

#### Copilot Tips for k6

✅ **Do:**
- Use descriptive comments before code blocks
- Specify the type of test (load, stress, spike)
- Mention specific requirements (response time, error rates)
- Include environment details if relevant
- Ask for specific k6 features (thresholds, custom metrics)

❌ **Don't:**
- Ask for production-only tests without safeguards
- Request unrealistic load patterns
- Forget to specify response time requirements
- Skip error handling requirements

---

## Part 2: Advanced Techniques

### Advanced Load Patterns

#### Ramping VUs (Virtual Users)

```javascript
export let options = {
  scenarios: {
    ramping_vus: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '5m', target: 20 },
        { duration: '10m', target: 20 },
        { duration: '5m', target: 0 },
      ],
      gracefulRampDown: '30s',
    },
  },
};

export default function() {
  http.get('https://api.example.com/api/data');
}
```

**Use Cases:**
- Gradual user ramp-up scenarios
- Testing auto-scaling triggers
- Graceful degradation testing

#### Constant Arrival Rate

```javascript
export let options = {
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 30, // 30 requests per second
      timeUnit: '1s',
      duration: '10m',
      preAllocatedVUs: 50,
      maxVUs: 100,
    },
  },
};

export default function() {
  http.get('https://api.example.com/api/data');
}
```

**Use Cases:**
- Target specific request rates per second
- SLA-based testing
- Request rate stabilization testing

#### Per-VU Iterations

```javascript
export let options = {
  scenarios: {
    per_vu_iterations: {
      executor: 'per-vu-iterations',
      vus: 10,
      iterations: 20, // Each VU runs 20 iterations
      maxDuration: '10m',
    },
  },
};

export default function() {
  http.get('https://api.example.com/api/data');
}
```

**Use Cases:**
- Fixed workload testing
- Batch processing scenarios
- Reproducible test results

### Advanced Metrics and Monitoring

#### Custom Metrics with Tags

```javascript
import { Counter, Gauge, Trend } from 'k6/metrics';

let apiErrors = new Counter('api_errors');
let dbResponseTime = new Trend('db_response_time');
let activeUsers = new Gauge('active_users');

export default function() {
  let response = http.get('https://api.example.com/data', {
    tags: { endpoint: 'data', version: 'v1' },
  });
  
  if (response.status >= 400) {
    apiErrors.add(1, { error_type: response.status });
  }
  
  dbResponseTime.add(response.timings.waiting, {
    database: 'postgresql',
    query_type: 'select',
  });
  
  activeUsers.add(Math.floor(Math.random() * 100));
}
```

**Benefits:**
- Track metrics by endpoint or service
- Identify performance issues by component
- Separate reporting by environment or version

#### Advanced Thresholds

```javascript
export let options = {
  thresholds: {
    // Global thresholds
    http_req_duration: [
      'p(95)<500',
      'p(99)<1000',
      'avg<200',
    ],
    http_req_failed: ['rate<0.01'],
    
    // Tagged thresholds
    'http_req_duration{endpoint:login}': ['p(95)<200'],
    'http_req_duration{endpoint:api}': ['p(95)<500'],
    
    // Custom metric thresholds
    api_errors: ['count<10'],
    'db_response_time{database:postgresql}': ['p(95)<300'],
  },
};

export default function() {
  // Test implementation
}
```

**Threshold Types:**
- `p(XX)<value`: Percentile threshold
- `avg<value`: Average threshold
- `max<value`: Maximum threshold
- `count<value`: Count threshold
- `rate<value`: Rate threshold

### Browser Testing with k6

```javascript
import { chromium } from 'k6/experimental/browser';

export let options = {
  scenarios: {
    ui: {
      executor: 'shared-iterations',
      options: {
        browser: {
          type: 'chromium',
        },
      },
    },
  },
};

export default async function () {
  const browser = chromium.launch({ headless: true });
  const page = browser.newPage();
  
  try {
    await page.goto('https://example.com/login');
    
    await page.fill('#username', 'testuser');
    await page.fill('#password', 'testpass');
    await page.click('button[type="submit"]');
    
    // Wait for navigation
    await page.waitForNavigation();
    
    check(page, {
      'login successful': p => p.url().includes('/dashboard'),
    });
    
  } finally {
    page.close();
    browser.close();
  }
}
```

**Features:**
- Full browser automation
- DOM interaction testing
- Visual regression testing
- End-to-end performance testing

### Advanced Reporting

#### JSON Output

```bash
k6 run --out json=results.json script.js
```

**Use:**
- Machine-readable format
- Integration with other tools
- Historical comparison

#### InfluxDB Integration

```bash
k6 run --out influxdb=http://localhost:8086/mydb script.js
```

**Benefits:**
- Real-time monitoring
- Grafana integration
- Long-term metrics storage

#### Custom Summary

```javascript
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

export function handleSummary(data) {
  return {
    'stdout': textSummary(data, { indent: ' ', enableColors: true }),
    'summary.json': JSON.stringify(data),
    'summary.html': htmlReport(data),
  };
}

function htmlReport(data) {
  return `<!DOCTYPE html>
<html>
<head>
  <title>k6 Test Results</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .metric { margin: 10px 0; padding: 10px; background: #f0f0f0; }
    .passed { color: green; }
    .failed { color: red; }
  </style>
</head>
<body>
  <h1>Performance Test Summary</h1>
  <h2>Test Overview</h2>
  <div class="metric">
    <strong>Total Requests:</strong> ${data.metrics.http_reqs.values.count}
  </div>
  <div class="metric">
    <strong>Average Response Time:</strong> ${data.metrics.http_req_duration.values.avg.toFixed(2)}ms
  </div>
  <div class="metric">
    <strong>95th Percentile:</strong> ${data.metrics.http_req_duration.values['p(95)'].toFixed(2)}ms
  </div>
  <div class="metric">
    <strong>Error Rate:</strong> ${(data.metrics.http_req_failed.values.rate * 100).toFixed(2)}%
  </div>
</body>
</html>`;
}
```

### Performance Testing CI/CD Integration

#### GitHub Actions Example

```yaml
name: Performance Tests
on:
  pull_request:
    branches: [main]

jobs:
  performance-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Install k6
        run: |
          curl https://github.com/grafana/k6/releases/download/v0.45.0/k6-v0.45.0-linux-amd64.tar.gz -L | tar xvz --strip-components 1
      
      - name: Run k6 performance tests
        run: |
          ./k6 run --out json=results.json performance-tests/load-test.js
      
      - name: Upload results
        uses: actions/upload-artifact@v2
        with:
          name: k6-results
          path: results.json
```

**Benefits:**
- Automated performance testing on every PR
- Early detection of performance regressions
- Historical trend analysis
- Continuous quality monitoring

### Advanced k6 Features

#### Modular Test Organization

**auth.js:**
```javascript
import http from 'k6/http';

export function login(username, password) {
  const response = http.post('https://api.example.com/login', {
    username: username,
    password: password,
  });
  
  return JSON.parse(response.body).token;
}
```

**products.js:**
```javascript
import http from 'k6/http';

export function browse_products(token) {
  const params = {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };
  
  return http.get('https://api.example.com/products', params);
}
```

**checkout.js:**
```javascript
import http from 'k6/http';

export function checkout(token, cartItems) {
  const params = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
  
  return http.post('https://api.example.com/checkout', JSON.stringify(cartItems), params);
}
```

**main-test.js:**
```javascript
import { login } from './auth.js';
import { browse_products } from './products.js';
import { checkout } from './checkout.js';

export let options = {
  vus: 10,
  duration: '5m',
};

export default function() {
  const token = login('testuser', 'password');
  browse_products(token);
  checkout(token, [{ id: 1, quantity: 2 }]);
}
```

**Benefits:**
- Code reusability
- Easy maintenance
- Clear separation of concerns

#### Environment-Specific Configuration

**config.js:**
```javascript
const environments = {
  dev: {
    baseUrl: 'https://api-dev.example.com',
    users: 10,
    duration: '5m',
  },
  staging: {
    baseUrl: 'https://api-staging.example.com',
    users: 50,
    duration: '10m',
  },
  prod: {
    baseUrl: 'https://api.example.com',
    users: 100,
    duration: '30m',
  },
};

const env = __ENV.ENVIRONMENT || 'dev';
export const config = environments[env];
```

**test.js:**
```javascript
import { config } from './config.js';
import http from 'k6/http';

export let options = {
  vus: config.users,
  duration: config.duration,
};

export default function() {
  http.get(`${config.baseUrl}/api/data`);
}
```

**Usage:**
```bash
k6 run --env ENVIRONMENT=staging test.js
```

### Performance Optimization Tips

#### Minimize Script Overhead

```javascript
// ✅ GOOD: Efficient script
import http from 'k6/http';
import { check } from 'k6';

const BASE_URL = 'https://api.example.com';

export default function() {
  const response = http.get(`${BASE_URL}/data`);
  check(response, { 'status is 200': (r) => r.status === 200 });
}

// ❌ AVOID: Inefficient script
import http from 'k6/http';
import { check } from 'k6';
import heavyLibrary from 'heavy-library'; // Loaded every iteration

export default function() {
  // Unnecessary JSON parsing
  const data = JSON.parse(heavyLibrary.process());
  const response = http.get('https://api.example.com/data');
  check(response, { 'status is 200': (r) => r.status === 200 });
}
```

**Guidelines:**
- Import only what you need
- Avoid complex computations per iteration
- Cache derived values
- Use efficient algorithms

#### Resource Management

```javascript
export let options = {
  discardResponseBodies: true, // Save memory when not needed
  noConnectionReuse: false,    // Reuse connections
  noVUConnectionReuse: false,  // Allow VU connection reuse
  batchPerHost: 6,            // Batch requests per host
};
```

**Best Practices:**
- Monitor load generator resources
- Use appropriate hardware for load scale
- Consider distributed testing for extreme loads
- Implement connection pooling

#### Network Considerations

```javascript
import http from 'k6/http';
import { sleep } from 'k6';

export default function() {
  // Account for network latency
  let response = http.get('https://api.example.com/data', {
    timeout: '30s', // Appropriate timeout
  });
  
  // Realistic think time
  sleep(Math.random() * 3 + 1); // 1-4 seconds
}
```

**Guidelines:**
- Use realistic network conditions
- Implement appropriate timeouts
- Add think times between operations
- Test from geographically distributed locations

#### Test Data Strategy

```javascript
import { SharedArray } from 'k6/data';

// Load large datasets once
const users = new SharedArray('users', function () {
  const data = JSON.parse(open('./users.json'));
  return data;
});

// Implement data cycling
let userIndex = 0;

export default function() {
  const user = users[userIndex % users.length];
  userIndex++;
  
  // Use user data
  http.post('https://api.example.com/login', {
    username: user.username,
    password: user.password,
  });
}
```

---

## Part 3: Real-World Exercises

### Exercise 1: Building a Complete E-Commerce Load Test

**Objective:** Create a comprehensive load test for an e-commerce platform with multiple user journeys.

**Requirements:**
- Implement three different user personas (browser, shopper, purchaser)
- Include realistic think times
- Track custom metrics for business events
- Implement advanced thresholds
- Generate HTML report

**Starter Code:**
```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Gauge, Trend } from 'k6/metrics';

// Custom metrics
const orderValue = new Trend('order_value');
const cartAdds = new Counter('cart_additions');
const checkoutSuccess = new Gauge('checkout_success_rate');

const BASE_URL = __ENV.BASE_URL || 'https://api.example.com';

export let options = {
  scenarios: {
    browsing: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 50 },
        { duration: '5m', target: 50 },
        { duration: '2m', target: 0 },
      ],
    },
  },
  thresholds: {
    'http_req_duration{endpoint:browse}': ['p(95)<200'],
    'http_req_duration{endpoint:checkout}': ['p(95)<500'],
    'http_req_failed': ['rate<0.05'],
  },
};

export default function() {
  // TODO: Implement test scenarios
}

export function handleSummary(data) {
  // TODO: Generate HTML report
}
```

**Tasks:**
1. Implement three user journey functions
2. Add realistic think times between operations
3. Track all custom business metrics
4. Create tagged thresholds for different endpoints
5. Generate professional HTML report

---

### Exercise 2: Advanced Data Management

**Objective:** Implement sophisticated data handling for realistic load testing.

**Requirements:**
- Load CSV data with SharedArray
- Implement user rotation strategy
- Add data cleanup
- Handle concurrent data access

**Starter Code:**
```javascript
import { SharedArray } from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';

// Load test data
const users = new SharedArray('users', function () {
  const csvData = papaparse.parse(open('./test-users.csv'), { header: true });
  return csvData.data;
});

// Track user assignments
let userIndex = 0;

export let options = {
  vus: 50,
  duration: '10m',
};

export default function() {
  // TODO: Implement data rotation
  // TODO: Implement user assignment
  // TODO: Add data validation
}
```

**Tasks:**
1. Create CSV file with test users
2. Implement SharedArray for efficient loading
3. Create user rotation strategy (cycle, random, sequential)
4. Add data conflict detection
5. Implement cleanup function

---

### Exercise 3: CI/CD Integration

**Objective:** Integrate k6 tests into a GitHub Actions workflow.

**Requirements:**
- Automated test execution
- Performance regression detection
- Result artifact upload
- Slack notifications

**Starter Code:**
```yaml
name: Performance Tests

on:
  pull_request:
    branches: [main]

jobs:
  perf-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install k6
        run: |
          curl https://github.com/grafana/k6/releases/download/v0.45.0/k6-v0.45.0-linux-amd64.tar.gz -L | tar xvz --strip-components 1
      
      - name: Run performance tests
        # TODO: Add k6 command with output options
        continue-on-error: true
      
      - name: Upload results
        # TODO: Add artifact upload
        if: always()
      
      - name: Comment PR with results
        # TODO: Add PR comment with results
        if: always()
```

**Tasks:**
1. Install and configure k6
2. Execute load test script
3. Generate JSON output
4. Upload results as artifact
5. Add PR comment with summary
6. Implement pass/fail status check

---

### Exercise 4: Performance Monitoring and Analysis

**Objective:** Implement comprehensive performance monitoring and trend analysis.

**Requirements:**
- Real-time metrics collection
- Performance trend detection
- Automated alerts for anomalies
- Historical comparison

**Starter Code:**
```javascript
import http from 'k6/http';
import { check } from 'k6';
import { Trend, Counter } from 'k6/metrics';

// Performance metrics
const respTime = new Trend('response_time');
const errorCount = new Counter('errors');

export let options = {
  vus: 100,
  duration: '30m',
  thresholds: {
    'response_time': ['p(95)<500', 'p(99)<1000'],
    'errors': ['count<100'],
  },
};

export default function() {
  // TODO: Implement monitoring logic
  // TODO: Calculate performance deviations
  // TODO: Trigger alerts if thresholds exceeded
}

export function handleSummary(data) {
  // TODO: Generate performance report with trends
  // TODO: Compare with baseline
  // TODO: Generate recommendations
}
```

**Tasks:**
1. Collect performance metrics during test
2. Calculate statistics (mean, median, percentiles)
3. Detect performance anomalies
4. Generate performance trends
5. Create comparison with baseline
6. Implement automated alerting

---

## Summary

This advanced k6 course covers:

✅ **Part 1: Fundamentals**
- k6 basics and installation
- Script structure and types of tests
- Built-in and custom metrics
- Best practices and Copilot usage

✅ **Part 2: Advanced Techniques**
- Advanced load patterns and scenarios
- Custom metrics and tagging
- Browser testing
- Advanced reporting and CI/CD integration
- Modular test organization
- Performance optimization

✅ **Part 3: Real-World Exercises**
- E-commerce load testing
- Advanced data management
- CI/CD integration
- Performance monitoring and analysis

**Next Steps:**
1. Start with Part 1 exercises from previous materials
2. Practice advanced patterns from Part 2
3. Complete real-world exercises from Part 3
4. Integrate tests into your CI/CD pipeline
5. Monitor and optimize continuously

---

*Last Updated: November 13, 2025*
*Version: 1.0 - Advanced Level Guide*
