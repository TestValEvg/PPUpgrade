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

Extract the request details and create your k6 script.

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

## Practical k6 Scripts from Petstore API

See the included JavaScript files for complete script examples:
- `petstore_get_pets_loadtest.js` - Load test GET operations
- `petstore_create_pets_stresstest.js` - Stress test CREATE operations  
- `petstore_soak_test.js` - Soak test sustained load
- `petstore_spike_test.js` - Spike test sudden surge

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
// Point to local mock instead of real API
const res = http.get('http://localhost:3000/v2/pet/findByStatus?status=available');
```

**Benefits**:
- ✅ No impact on real infrastructure
- ✅ Can simulate 10,000+ VUs safely
- ✅ Test edge cases (500 errors, timeouts)
- ✅ Deterministic responses

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

