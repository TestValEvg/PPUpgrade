# Part 2: From HAR to k6 Performance Testing

## What is k6?

**k6** is an open-source load testing tool that simulates thousands of concurrent users. Unlike UI tests (which are slow), k6 tests run at the protocol level (HTTP/WebSocket), making them extremely fast and scalable.

### Why k6 for API Testing?
- **Fast**: Tests run at network protocol speed, not browser speed
- **Scalable**: Simulate 10,000+ concurrent users
- **Easy**: JavaScript-based, familiar to developers
- **CI/CD Ready**: Can run in pipelines
- **Real Results**: Measures actual performance under load

### k6 vs Playwright vs JMeter
| Feature | k6 | Playwright | JMeter |
|---------|-----|-----------|--------|
| Best for | Load/Performance | UI/Functional | Complex Load |
| Speed | ⚡ Very Fast | 🟡 Medium | 🟡 Medium |
| User Experience | API Protocol | Real Browser | Protocol |
| Learning Curve | 📚 Easy | 📚 Easy | 📚 Steep |
| Open Source | ✅ Yes | ✅ Yes | ✅ Yes |

---

## How to Convert HAR to k6 Script

### Step 1: Capture Your HAR File
```bash
# From Part 1, capture your flow as HAR
# File: login-flow.har
```

### Step 2: Analyze the HAR Entry

Open your HAR file and find the key request. For example:

```json
{
  "startedDateTime": "2025-11-13T10:30:00.000Z",
  "request": {
    "method": "POST",
    "url": "https://api.example.com/api/v1/login",
    "headers": [
      {"name": "Content-Type", "value": "application/json"},
      {"name": "User-Agent", "value": "Mozilla/5.0..."},
      {"name": "Accept", "value": "application/json"}
    ],
    "postData": {
      "mimeType": "application/json",
      "text": "{\"email\":\"user@example.com\",\"password\":\"pass123\"}"
    }
  },
  "response": {
    "status": 200,
    "content": {
      "mimeType": "application/json",
      "text": "{\"token\":\"eyJhbGc...\",\"userId\":\"user-123\",\"name\":\"John Doe\"}"
    },
    "timings": {
      "wait": 150,
      "receive": 50
    }
  }
}
```

### Step 3: Generate k6 Script

Extract the request details and create your k6 script:

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,              // 10 concurrent virtual users
  duration: '30s',      // Run for 30 seconds
};

export default function () {
  const url = 'https://api.example.com/api/v1/login';
  
  const payload = JSON.stringify({
    email: 'user@example.com',
    password: 'pass123',
  });
  
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };
  
  const res = http.post(url, payload, params);
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
    'has token': (r) => r.body.includes('token'),
  });
  
  sleep(1);
}
```

---

## Practical k6 Scripts from Petstore API HAR

### Script 1: Load Test - Get Available Pets

**Scenario**: Every second, fetch all available pets. Simulate 20 concurrent users for 1 minute.

```javascript
// petstore-get-pets-loadtest.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 20,              // 20 concurrent virtual users
  duration: '60s',      // Run for 60 seconds
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'],  // 95% responses under 500ms
    http_req_failed: ['rate<0.1'],                    // Less than 10% failure rate
  },
};

export default function () {
  const url = 'https://petstore.swagger.io/v2/pet/findByStatus';
  
  const params = {
    headers: {
      'Accept': 'application/json',
    },
  };
  
  // Test all status values
  const statuses = ['available', 'pending', 'sold'];
  
  for (const status of statuses) {
    const res = http.get(`${url}?status=${status}`, params);
    
    check(res, {
      [`GET /pet/findByStatus?status=${status} returns 200`]: (r) => r.status === 200,
      [`Response time < 500ms for ${status}`]: (r) => r.timings.duration < 500,
      [`Response is valid JSON`]: (r) => {
        try {
          JSON.parse(r.body);
          return true;
        } catch {
          return false;
        }
      },
      [`Response contains pets array`]: (r) => Array.isArray(JSON.parse(r.body)),
    });
    
    sleep(1);
  }
}
```

**Run the test**:
```bash
k6 run petstore-get-pets-loadtest.js
```

**Expected Output**:
```
     data_received..................: 150 kB
     data_sent......................: 45 kB
     http_req_duration..............: avg=245ms, p(95)=450ms, p(99)=850ms
     http_req_failed................: 0.50%
     iterations.....................: 1200
     vus............................: 20
     vus_max........................: 20
```

---

### Script 2: Stress Test - Create Pets

**Scenario**: Create pets with escalating load (start at 5 VUs, ramp up to 50 VUs over 30 seconds)

```javascript
// petstore-create-pets-stresstest.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter } from 'k6/metrics';

// Custom metrics
const petCreatedCounter = new Counter('pets_created');
const petErrorCounter = new Counter('pets_errors');

export const options = {
  stages: [
    { duration: '10s', target: 5 },    // Ramp up to 5 VUs
    { duration: '20s', target: 25 },   // Ramp up to 25 VUs
    { duration: '20s', target: 50 },   // Ramp up to 50 VUs
    { duration: '10s', target: 0 },    // Ramp down to 0 VUs
  ],
  thresholds: {
    http_req_duration: ['p(95)<600'],
    http_req_failed: ['rate<0.05'],
  },
};

export default function () {
  const url = 'https://petstore.swagger.io/v2/pet';
  
  // Generate unique pet ID
  const petId = Math.floor(Math.random() * 1000000) + __VU;
  
  const payload = JSON.stringify({
    id: petId,
    name: `LoadTest-Dog-${petId}`,
    photoUrls: ['https://example.com/photo.jpg'],
    status: 'available',
    tags: [
      {
        id: 1,
        name: 'load-test'
      }
    ]
  });
  
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  const res = http.post(url, payload, params);
  
  const success = check(res, {
    'POST /pet returns 200': (r) => r.status === 200,
    'Response time < 600ms': (r) => r.timings.duration < 600,
    'Response contains pet ID': (r) => r.body.includes(`"id":${petId}`),
  });
  
  if (success) {
    petCreatedCounter.add(1);
  } else {
    petErrorCounter.add(1);
  }
  
  sleep(1);
}
```

**Run the test**:
```bash
k6 run petstore-create-pets-stresstest.js
```

---

### Script 3: Soak Test - Sustained Load

**Scenario**: Keep a steady load of 10 VUs for 10 minutes to find memory leaks or data degradation

```javascript
// petstore-soak-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '10m',      // Run for 10 minutes
  thresholds: {
    'http_req_duration': ['p(99)<1000'],
    'http_req_failed': ['rate<0.01'],
  },
};

export default function () {
  // Mix of different operations
  const randomOp = Math.random();
  
  if (randomOp < 0.4) {
    // 40% GET operations
    getAvailablePets();
  } else if (randomOp < 0.7) {
    // 30% CREATE operations
    createPet();
  } else if (randomOp < 0.9) {
    // 20% GET single pet
    getPet();
  } else {
    // 10% DELETE operations
    deletePet();
  }
  
  sleep(1);
}

function getAvailablePets() {
  const res = http.get('https://petstore.swagger.io/v2/pet/findByStatus?status=available');
  check(res, {
    'Get pets status 200': (r) => r.status === 200,
  });
}

function createPet() {
  const petId = Math.floor(Math.random() * 1000000);
  const payload = JSON.stringify({
    id: petId,
    name: `Soak-Test-${petId}`,
    photoUrls: [],
    status: 'available'
  });
  
  const res = http.post('https://petstore.swagger.io/v2/pet', payload, {
    headers: { 'Content-Type': 'application/json' }
  });
  
  check(res, {
    'Create pet status 200': (r) => r.status === 200,
  });
}

function getPet() {
  const petId = Math.floor(Math.random() * 100) + 1;
  const res = http.get(`https://petstore.swagger.io/v2/pet/${petId}`);
  check(res, {
    'Get pet status 200 or 404': (r) => r.status === 200 || r.status === 404,
  });
}

function deletePet() {
  const petId = Math.floor(Math.random() * 1000000);
  const res = http.delete(`https://petstore.swagger.io/v2/pet/${petId}`);
  check(res, {
    'Delete pet status 200 or 404': (r) => r.status === 200 || r.status === 404,
  });
}
```

**Run the test**:
```bash
k6 run petstore-soak-test.js
```

---

### Script 4: Spike Test - Sudden Traffic Surge

**Scenario**: Simulate a sudden traffic spike (users watching a live stream going live)

```javascript
// petstore-spike-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 10 },    // Normal traffic: 10 VUs
    { duration: '5s', target: 100 },    // Spike: instantly 100 VUs
    { duration: '10s', target: 100 },   // Maintain: hold at 100 VUs
    { duration: '5s', target: 10 },     // Drop: back to 10 VUs
    { duration: '10s', target: 0 },     // Recovery
  ],
  thresholds: {
    http_req_duration: ['p(99)<2000'],  // Relaxed threshold during spike
    http_req_failed: ['rate<0.1'],      // Allow 10% failures during spike
  },
};

export default function () {
  const res = http.get('https://petstore.swagger.io/v2/pet/findByStatus?status=available');
  
  check(res, {
    'Get pets (spike test)': (r) => r.status === 200 || r.status === 429,  // 429 = Rate limited (ok)
    'Response time < 3000ms': (r) => r.timings.duration < 3000,
  });
  
  sleep(0.5);
}
```

**Run the test**:
```bash
k6 run petstore-spike-test.js
```

---

## Advanced k6: Custom Metrics & Tags

### Track Custom Metrics

```javascript
import http from 'k6/http';
import { Counter, Gauge, Trend } from 'k6/metrics';

// Define custom metrics
const loginCounter = new Counter('logins_success');
const errorRate = new Counter('errors');
const responseTimeTrend = new Trend('response_time');
const maxResponseTime = new Gauge('max_response_time');

export const options = {
  vus: 10,
  duration: '30s',
};

export default function () {
  const res = http.post('https://api.example.com/login', {
    email: 'user@example.com',
    password: 'pass123'
  });
  
  // Track metrics
  if (res.status === 200) {
    loginCounter.add(1);
  } else {
    errorRate.add(1);
  }
  
  responseTimeTrend.add(res.timings.duration);
  maxResponseTime.value = Math.max(maxResponseTime.value || 0, res.timings.duration);
}
```

---

## k6 Best Practices

### ✅ Do
- ✅ Start with small VU count (5-10) and gradually increase
- ✅ Set realistic thresholds based on SLAs
- ✅ Test from multiple geographic regions
- ✅ Use think time (sleep) between requests
- ✅ Test during off-peak hours first
- ✅ Monitor API health during tests

### ❌ Don't
- ❌ Run load tests against production without approval
- ❌ Use real customer data
- ❌ Create unlimited resources (cleanup after tests)
- ❌ Ignore rate limiting (respect API quotas)
- ❌ Run tests at peak hours
- ❌ Assume results from staging apply to production

---

## Using Mock Servers with k6

### Mockoon Setup

```bash
# 1. Install Mockoon CLI
npm install -g @mockoon/cli

# 2. Start mock server
mockoon-cli start --file petstore-mock.json --port 3000
```

### k6 Script for Mock Server

```javascript
// petstore-mock-loadtest.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 50,
  duration: '2m',
  // Much higher load on mock (no real backend stress)
};

export default function () {
  // Point to local mock instead of real API
  const res = http.get('http://localhost:3000/v2/pet/findByStatus?status=available');
  
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
  
  sleep(1);
}
```

**Benefits**:
- ✅ No impact on real infrastructure
- ✅ Can simulate 10,000+ VUs safely
- ✅ Test edge cases (500 errors, timeouts)
- ✅ Deterministic responses

---

## k6 Installation & Setup

### Install k6

```bash
# macOS
brew install k6

# Windows
choco install k6

# Linux (Ubuntu/Debian)
sudo apt-get install k6

# Docker
docker run -i loadimpact/k6 run - < script.js
```

### Verify Installation

```bash
k6 version
# Output: k6 v0.47.0 (go1.20.5, linux/amd64)
```

---

## Running k6 with Different Configurations

```bash
# Basic run
k6 run script.js

# With custom VUs and duration
k6 run script.js --vus 50 --duration 1m

# With verbose output
k6 run script.js -v

# Output results to JSON
k6 run script.js --out json=results.json

# Output results to CSV
k6 run script.js --out csv=results.csv

# Output results to InfluxDB
k6 run script.js --out influxdb=http://localhost:8086/k6
```

---

## Summary

You now know how to:
1. **Extract requests from HAR files**
2. **Convert them to k6 scripts**
3. **Run different types of load tests**:
   - Load Test (sustained)
   - Stress Test (escalating)
   - Soak Test (long-running)
   - Spike Test (sudden surge)
4. **Track custom metrics**
5. **Use mock servers**

**Next Step**: Go to Part 3 to learn how to mock and replay HAR files in Playwright tests!

---

## Quick Reference - k6 Script Template

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,              // Virtual users
  duration: '30s',      // Duration
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.1'],
  },
};

export default function () {
  const res = http.get('https://api.example.com/endpoint');
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  
  sleep(1);
}
```

