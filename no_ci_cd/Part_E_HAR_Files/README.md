# HAR File Testing - Complete Homework Guide

## 📚 Table of Contents

1. **Part 1**: Capturing HAR Files (Browser DevTools & Playwright)
2. **Part 2**: k6 Performance Testing (Load, Stress, Soak, Spike Tests)
3. **Part 3**: Playwright HAR Testing (Replay & Mocking)
4. **Part 4**: Practical Exercises & Challenges

---

## 🎯 Quick Start (5 Minutes)

### What is a HAR File?
A **HAR (HTTP Archive)** file is a JSON log of all network interactions between your browser and server. It records:
- Every API call made
- Request/response data
- Headers and payloads
- Response times
- Status codes

### Why Learn This?
- 🚀 **Fast Testing**: Test offline with HAR replay
- 🧪 **Realistic Scenarios**: Use real user flows
- 🔍 **Easy Debugging**: See exactly what was sent/received
- 📊 **Performance Testing**: Load test with real request patterns
- 🎭 **Mock Any Scenario**: Test errors without breaking production

### Real-World Example
User clicks "Add to Cart" → Browser makes 5 API calls → HAR file captures all 5 → You can now:
- Replay the flow offline in tests
- Load test with the exact same pattern
- Mock specific endpoints to test errors
- Analyze performance characteristics

---

## 📂 Project Structure

```
Part_E_HAR_Files/
├── part1_har_capture_guide.md          # How to capture HAR files
├── part2_k6_performance_guide.md       # Performance testing guide
├── part3_playwright_har_testing.md     # Replay & mocking guide
├── part4_exercises.md                  # Practical exercises
├── petstore_get_pets_loadtest.js       # k6 load test example
├── petstore_create_pets_stresstest.js  # k6 stress test example
├── petstore_soak_test.js               # k6 soak test example
├── petstore_spike_test.js              # k6 spike test example
├── har-files/                          # Directory for HAR captures
│   ├── login-flow.har
│   ├── checkout-flow.har
│   └── api-calls.har
└── README.md (this file)
```

---

## 🚀 Getting Started

### Prerequisites
```bash
# Node.js 18+ and npm
node --version
npm --version

# Playwright (for recording HAR)
npm install -D @playwright/test

# k6 (for load testing)
# macOS
brew install k6

# Windows
choco install k6

# Linux
sudo apt-get install k6
```

### Installation
```bash
# Clone or create the Part_E_HAR_Files folder
cd no_ci_cd/Part_E_HAR_Files

# Install Playwright
npm install -D @playwright/test

# Verify installations
npx playwright --version
k6 version
```

---

## 📖 Learning Paths

### Path 1: Frontend/UI Testing Developer
**Goal**: Use HAR files to test UI functionality faster

**Recommended Flow**:
1. Read Part 1 (5 min) - Understand HAR files
2. Read Part 3 (10 min) - Learn replay & mocking
3. Complete Exercise 1 (15 min) - Capture and replay
4. Complete Exercise 2 (15 min) - Mock error scenarios
5. Complete Exercise 3 (15 min) - Go offline with replay
6. **Total Time**: ~60 minutes

### Path 2: Performance/Load Testing Engineer
**Goal**: Use HAR files for realistic load testing

**Recommended Flow**:
1. Read Part 1 (5 min) - Understand HAR files
2. Read Part 2 (10 min) - Learn k6 and load testing
3. Review k6 script examples (10 min)
4. Complete Exercise 4 (30 min) - Run load test
5. Analyze results (15 min)
6. **Total Time**: ~70 minutes

### Path 3: API Testing Expert
**Goal**: Master all aspects of HAR testing

**Recommended Flow**:
1. Read Part 1 (5 min)
2. Read Part 2 (10 min)
3. Read Part 3 (10 min)
4. Complete Exercise 1-4 (60 min)
5. Complete bonus challenges (30 min)
6. **Total Time**: ~115 minutes (Full Mastery)

---

## 🎓 Part Summaries

### Part 1: Capturing HAR Files (⏱️ 15 min read)
**Topics Covered**:
- What is a HAR file and why use it
- Method 1: Browser DevTools (manual capture)
- Method 2: Playwright script (automated)
- HAR file structure and anatomy
- Real examples from Petstore API
- Sanitization for security
- Best practices and troubleshooting

**Key Takeaway**: You'll know how to capture realistic user flows as HAR files.

### Part 2: k6 Performance Testing (⏱️ 20 min read)
**Topics Covered**:
- What is k6 and why use it
- Converting HAR to k6 scripts
- 4 types of load tests:
  - Load test (sustained)
  - Stress test (escalating)
  - Soak test (long-running)
  - Spike test (sudden surge)
- Custom metrics and tagging
- Mock server setup
- Installation and running tests
- Result analysis

**Key Takeaway**: You'll be able to test API performance under realistic load conditions.

### Part 3: Playwright HAR Testing (⏱️ 20 min read)
**Topics Covered**:
- HAR replay for offline testing
- Mocking individual API endpoints
- Conditional mocking (different responses)
- Error scenario mocking
- API testing with request context
- Combining replay with UI testing
- Best practices

**Key Takeaway**: You'll know how to make tests fast, reliable, and deterministic using HAR replay and mocking.

### Part 4: Practical Exercises (⏱️ 60 min practice)
**Exercises**:
1. **Exercise 1** (15 min): Capture HAR and create API test
2. **Exercise 2** (20 min): Mock success, error, and retry scenarios
3. **Exercise 3** (15 min): Record complete flow and replay offline
4. **Exercise 4** (30 min): Create k6 load test and analyze results
5. **Bonus Challenges** (30 min): Multi-status capture, error recovery, performance comparison

**Key Takeaway**: Hands-on practice with all HAR file techniques.

---

## 🔄 Workflow Example: Complete User Flow

### Step 1: Capture (5 minutes)
```bash
npx playwright test --headed  # Use --headed to see browser
# Manually perform: login → browse products → add to cart → checkout
# Browser DevTools automatically records all API calls
# Save as: checkout-flow.har
```

### Step 2: Analyze (3 minutes)
```bash
# Open checkout-flow.har in VS Code
# Find the key API requests:
# - POST /api/login (get auth token)
# - GET /api/products (fetch product list)
# - POST /api/cart (add item)
# - POST /api/checkout (complete purchase)
```

### Step 3: Test (5 minutes)
```bash
# Run tests that replay the HAR file
npx playwright test --headed
# Tests run FAST because responses come from HAR
```

### Step 4: Load Test (5 minutes)
```bash
# Convert HAR to k6 script
# Or use one of the provided petstore examples
k6 run petstore_get_pets_loadtest.js
# See how API handles 20+ concurrent users
```

---

## 💡 Real-World Scenarios

### Scenario 1: E-Commerce Checkout
**What to capture**:
- User searches products
- Adds items to cart
- Fills shipping info
- Enters payment
- Confirms order

**Why HAR**:
- Test each step with real API patterns
- Mock payment processor (avoid charges during testing)
- Load test with real checkout flow (5 API calls per purchase)
- Find which step is slowest

### Scenario 2: Social Media Feed
**What to capture**:
- User scrolls feed
- API paginates (100 posts per request)
- Images load lazily
- Comments endpoint calls

**Why HAR**:
- Test pagination with real data sizes
- Load test with realistic scroll patterns
- Mock slow image CDN (simulate poor connection)
- Find pagination bottleneck

### Scenario 3: Real-Time Dashboard
**What to capture**:
- WebSocket connection to live data
- Poll for updates every 5 seconds
- User subscribes to alerts
- Notifications arrive

**Why HAR**:
- Replay WebSocket messages for consistent testing
- Simulate late-arriving updates
- Load test with many concurrent subscriptions
- Test reconnection logic

---

## 🛠️ Tools You'll Use

| Tool | Purpose | Install |
|------|---------|---------|
| **Playwright** | Record/replay HAR files | `npm install @playwright/test` |
| **k6** | Load testing | `brew install k6` or `choco install k6` |
| **VS Code** | Edit HAR and test files | Download from code.visualstudio.com |
| **Browser DevTools** | Manual HAR capture | Built-in (F12) |
| **Mockoon** (optional) | Mock server | `npm install -g @mockoon/cli` |

---

## ✅ Learning Checklist

### Part 1: HAR Capture
- [ ] Understand what HAR files contain
- [ ] Capture a HAR using Browser DevTools
- [ ] Capture a HAR using Playwright script
- [ ] Analyze a HAR file structure
- [ ] Sanitize a HAR file

### Part 2: k6 Performance Testing
- [ ] Understand load vs stress vs soak vs spike tests
- [ ] Install k6
- [ ] Run a basic k6 script
- [ ] Understand k6 metrics and thresholds
- [ ] Run petstore_get_pets_loadtest.js

### Part 3: Playwright Testing
- [ ] Understand HAR replay
- [ ] Replay a HAR file in a test
- [ ] Mock an API endpoint
- [ ] Mock error scenarios
- [ ] Combine replay with UI testing

### Part 4: Exercises
- [ ] Complete Exercise 1 (capture + test)
- [ ] Complete Exercise 2 (mocking)
- [ ] Complete Exercise 3 (replay)
- [ ] Complete Exercise 4 (k6 load test)
- [ ] Complete bonus challenges

---

## 🚨 Troubleshooting

### HAR file is too large
**Solution**: Filter by URL pattern
```typescript
await page.routeFromHAR('file.har', {
  url: '**/api/**'  // Only API calls
});
```

### Sensitive data in HAR
**Solution**: Sanitize before committing
```bash
node sanitize-har.js file.har
git add file-sanitized.har
```

### Test is flaky (sometimes passes, sometimes fails)
**Solution**: Use HAR replay for consistency
```typescript
// Before: Real API (flaky)
const res = await fetch(url);

// After: Use HAR replay (consistent)
await page.routeFromHAR('file.har', { url: '**/*' });
```

### k6 says "Connection refused"
**Solution**: Make sure API is running
```bash
# Check if Petstore API is accessible
curl https://petstore.swagger.io/v2/pet/findByStatus?status=available
```

---

## 📚 Additional Resources

### Official Documentation
- [Playwright HAR Recording](https://playwright.dev/docs/har)
- [k6 Documentation](https://k6.io/docs/)
- [HTTP Archive Format](http://www.softwareishard.com/blog/har-12-spec/)

### Related Concepts
- **API Testing**: Validate backend functionality
- **Load Testing**: Verify performance under stress
- **Mocking**: Isolate components for testing
- **Network Monitoring**: Understand request/response cycle

### Next Steps After This Course
1. Apply to your own APIs
2. Integrate into CI/CD pipeline
3. Set performance baselines
4. Monitor trends over time
5. Share knowledge with team

---

## 🎁 Bonus Features

### Feature 1: HAR File Sanitization Script
```bash
# Automatically remove passwords and tokens
node sanitize-har.js login-flow.har
```

### Feature 2: Convert HAR to cURL
```bash
# Generate cURL commands from HAR entries
# Useful for manual testing or documentation
```

### Feature 3: HAR to Postman Converter
```bash
# Import HAR file into Postman
# Use Postman runner for manual API exploration
```

### Feature 4: Performance Comparison
```bash
# Compare real API vs mocked response times
# See speedup factor (usually 5-10x faster)
```

---

## 🏆 Success Criteria

By the end of this homework, you should be able to:

✅ **Capture** realistic user flows as HAR files  
✅ **Replay** HAR files for fast, offline testing  
✅ **Mock** API endpoints for error scenarios  
✅ **Test** APIs directly without UI layer  
✅ **Load test** with realistic request patterns  
✅ **Analyze** performance metrics  
✅ **Debug** API issues using network logs  
✅ **Integrate** HAR tests into CI/CD  

---

## 📝 Summary

This homework teaches you a critical skill: **using real network interactions to build better tests**.

Instead of guessing what APIs do, you capture the actual data and:
- Replay it for fast, reliable tests
- Use it for realistic load testing
- Mock specific scenarios for error testing
- Debug issues with full request/response visibility

**Time Investment**: 2-3 hours for full mastery  
**Career Value**: High - these are professional testing techniques  
**Job Market**: Load testing and API testing are in-demand skills  

---

## 🎉 Ready to Start?

1. **Choose your learning path** (UI Testing, Load Testing, or Full Mastery)
2. **Start with Part 1** (15 min read)
3. **Work through Part 4 exercises** (60 min hands-on)
4. **Practice on your own APIs** (1-2 hours)

Let's make your tests faster, more reliable, and more professional! 🚀

---

**Last Updated**: November 13, 2025  
**Version**: 1.0  
**Status**: Complete & Ready to Use  

