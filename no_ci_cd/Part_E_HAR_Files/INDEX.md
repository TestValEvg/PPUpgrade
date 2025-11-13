# 📚 HAR File Testing - Complete Index

## Navigation Guide

### 🎯 Quick Links by Topic

#### Understanding HAR Files
- [What is a HAR File?](part1_har_capture_guide.md#what-is-a-har-file) - 2 min
- [Why Use HAR Files?](part1_har_capture_guide.md#why-use-har-files-for-api-testing) - 3 min
- [HAR File Structure](part1_har_capture_guide.md#har-file-structure) - 5 min

#### Capturing HAR Files
- [Browser DevTools Method](part1_har_capture_guide.md#method-1-manual-capture-using-browser-devtools) - 10 min
- [Playwright Automated Method](part1_har_capture_guide.md#method-2-automated-capture-using-playwright) - 10 min
- [Petstore API Examples](part1_har_capture_guide.md#capturing-from-petstore-api-real-example) - 10 min
- [Sanitization (Security)](part1_har_capture_guide.md#sanitizing-har-files-security-best-practice) - 5 min

#### Performance Testing (k6)
- [What is k6?](part2_k6_performance_guide.md#what-is-k6) - 2 min
- [Converting HAR to k6](part2_k6_performance_guide.md#how-to-convert-har-to-k6-script) - 10 min
- [Load Test Example](part2_k6_performance_guide.md#script-1-load-test---get-available-pets) - 5 min
- [Stress Test Example](part2_k6_performance_guide.md#script-2-stress-test---create-pets) - 5 min
- [Soak Test Example](part2_k6_performance_guide.md#script-3-soak-test---sustained-load) - 5 min
- [Spike Test Example](part2_k6_performance_guide.md#script-4-spike-test---sudden-traffic-surge) - 5 min
- [k6 Installation](part2_k6_performance_guide.md#k6-installation--setup) - 5 min
- [Running k6 Tests](part2_k6_performance_guide.md#running-k6-with-different-configurations) - 5 min

#### Playwright HAR Testing
- [HAR Replay Overview](part3_playwright_har_testing.md#what-is-har-replay) - 3 min
- [Recording HAR Files](part3_playwright_har_testing.md#recording-a-har-file) - 5 min
- [Replaying HAR Files](part3_playwright_har_testing.md#replaying-from-har-files) - 5 min
- [Mocking API Responses](part3_playwright_har_testing.md#mocking-api-responses) - 10 min
- [API Testing with Playwright](part3_playwright_har_testing.md#api-testing-with-playwright-request-context) - 10 min
- [Best Practices](part3_playwright_har_testing.md#best-practices) - 3 min

#### Practical Exercises
- [Exercise 1: Capture and Test](part4_exercises.md#exercise-1-capture-and-create-api-test) - 15 min
- [Exercise 2: Mock and Validate](part4_exercises.md#exercise-2-mock-and-validate) - 20 min
- [Exercise 3: Go Offline with Replay](part4_exercises.md#exercise-3-go-offline-with-har-replay) - 15 min
- [Exercise 4: k6 Load Test](part4_exercises.md#exercise-4-advanced-k6-load-test) - 30 min
- [Bonus Challenges](part4_exercises.md#bonus-challenges) - 30 min

---

## 📂 File Structure

```
Part_E_HAR_Files/
│
├── 📖 Documentation
│   ├── README.md                           ← START HERE
│   ├── INDEX.md                            ← YOU ARE HERE
│   ├── part1_har_capture_guide.md          ← Capturing HAR files
│   ├── part2_k6_performance_guide.md       ← Performance testing
│   ├── part3_playwright_har_testing.md     ← Replay & mocking
│   └── part4_exercises.md                  ← Hands-on practice
│
├── 🧪 k6 Scripts (Ready to Run)
│   ├── petstore_get_pets_loadtest.js       ← 20 concurrent users, 60s
│   ├── petstore_create_pets_stresstest.js  ← Escalating 5→50 VUs
│   ├── petstore_soak_test.js               ← Sustained 10 VUs for 10m
│   └── petstore_spike_test.js              ← Sudden 10→100→10 spike
│
└── 📁 HAR Files Directory (Create during exercises)
    └── har-files/                          ← Store captured HAR files here
        ├── login-flow.har
        ├── checkout-flow.har
        └── api-calls.har
```

---

## 🚀 Quick Start Paths

### 🏃 5-Minute Overview
1. Read: [What is a HAR File?](part1_har_capture_guide.md#what-is-a-har-file)
2. Read: [Why Use HAR Files?](part1_har_capture_guide.md#why-use-har-files-for-api-testing)
3. Look at: [HAR File Structure](part1_har_capture_guide.md#har-file-structure)

### ⏱️ 30-Minute Quick Start
1. Read: [Part 1 Overview](part1_har_capture_guide.md) - 15 min
2. Read: [Part 3 Overview](part3_playwright_har_testing.md) - 15 min
3. You now understand HAR capture and replay!

### 🎯 1-Hour Focused Learning
**Choose One Track**:

**Track A: Frontend Testing**
- Part 1: Capture (10 min)
- Part 3: Replay & Mocking (15 min)
- Exercise 1: Capture and Test (15 min)
- Exercise 2: Mock Scenarios (15 min)

**Track B: Performance Testing**
- Part 2: k6 Overview (15 min)
- Review k6 Scripts (10 min)
- Run petstore_get_pets_loadtest.js (5 min)
- Run petstore_create_pets_stresstest.js (5 min)
- Analyze results (5 min)

### 💎 2-Hour Complete Mastery
1. Part 1: HAR Capture (15 min) ← Core concept
2. Part 2: k6 Performance (15 min) ← Performance testing
3. Part 3: Replay & Mocking (15 min) ← Advanced techniques
4. Exercise 1-3 (30 min) ← Hands-on practice
5. Exercise 4 (20 min) ← Load testing
6. Review & Bonus (15 min) ← Mastery

---

## 🎓 Learning Objectives by Part

### Part 1: HAR Capture - What You'll Learn
- [ ] What HAR files are and why they're useful
- [ ] How to capture with Browser DevTools
- [ ] How to capture with Playwright scripts
- [ ] HAR file JSON structure
- [ ] Real examples from Petstore API
- [ ] Security: Sanitizing sensitive data
- [ ] Common issues and solutions

**Time**: 15-20 minutes | **Difficulty**: ⭐ Easy | **Value**: ⭐⭐⭐⭐⭐

### Part 2: k6 Performance - What You'll Learn
- [ ] What k6 is and when to use it
- [ ] How to extract requests from HAR files
- [ ] Converting HAR to k6 scripts
- [ ] Four types of load tests:
  - Load test (steady load)
  - Stress test (escalating)
  - Soak test (endurance)
  - Spike test (sudden surge)
- [ ] Custom metrics
- [ ] Analyzing results
- [ ] Mock servers

**Time**: 20-25 minutes | **Difficulty**: ⭐⭐ Intermediate | **Value**: ⭐⭐⭐⭐⭐

### Part 3: Replay & Mocking - What You'll Learn
- [ ] HAR replay for offline testing
- [ ] Recording HAR in Playwright
- [ ] Replaying from HAR files
- [ ] Mocking individual endpoints
- [ ] Conditional mocking logic
- [ ] Error scenario mocking
- [ ] API testing with request context
- [ ] Combining replay + UI testing

**Time**: 20-25 minutes | **Difficulty**: ⭐⭐ Intermediate | **Value**: ⭐⭐⭐⭐

### Part 4: Exercises - What You'll Do
- [ ] Exercise 1: Capture and create API test
- [ ] Exercise 2: Mock success and error scenarios
- [ ] Exercise 3: Record and replay offline
- [ ] Exercise 4: Create and run k6 load test
- [ ] Bonus: Multi-status capture, error recovery, performance comparison

**Time**: 60-90 minutes | **Difficulty**: ⭐⭐⭐ Hard | **Value**: ⭐⭐⭐⭐⭐

---

## 📊 Skill Progression

```
Part 1 (Capture)
    ↓
    You can: Record user flows as HAR files ✓
    
Part 3 (Replay)
    ↓
    You can: Replay HAR for fast, offline tests ✓
    
Part 3 (Mocking)
    ↓
    You can: Mock errors for test scenarios ✓
    
Part 2 (k6)
    ↓
    You can: Load test with realistic patterns ✓
    
Exercise 1-4
    ↓
    You can: Do all of the above! 🎉
```

---

## 🔍 Find What You Need

### "How do I...?"

#### Capture HAR Files?
- Browser DevTools: [Method 1](part1_har_capture_guide.md#method-1-manual-capture-using-browser-devtools)
- Playwright Script: [Method 2](part1_har_capture_guide.md#method-2-automated-capture-using-playwright)
- Petstore API: [Real Example](part1_har_capture_guide.md#capturing-from-petstore-api-real-example)

#### Replay HAR Files?
- Basic Replay: [Replaying from HAR](part3_playwright_har_testing.md#replaying-from-har-files)
- Filtered Replay: [Replay Specific Endpoints](part3_playwright_har_testing.md#replay-specific-api-endpoints)
- Offline Testing: [Exercise 3](part4_exercises.md#exercise-3-go-offline-with-har-replay)

#### Mock API Endpoints?
- Basic Mocking: [Mock Individual Requests](part3_playwright_har_testing.md#mock-individual-requests)
- Conditional Logic: [Conditional Mocking](part3_playwright_har_testing.md#conditional-mocking)
- Error Scenarios: [Mock Error Scenarios](part3_playwright_har_testing.md#mock-error-scenarios)
- Exercise: [Exercise 2](part4_exercises.md#exercise-2-mock-and-validate)

#### Load Test with k6?
- Installation: [k6 Setup](part2_k6_performance_guide.md#k6-installation--setup)
- Load Test: [Load Test Script](part2_k6_performance_guide.md#script-1-load-test---get-available-pets)
- Stress Test: [Stress Test Script](part2_k6_performance_guide.md#script-2-stress-test---create-pets)
- Run Tests: [Running k6](part2_k6_performance_guide.md#running-k6-with-different-configurations)
- Exercise: [Exercise 4](part4_exercises.md#exercise-4-advanced-k6-load-test)

#### Test APIs with Playwright?
- Basic API Test: [Playwright Request Context](part3_playwright_har_testing.md#api-testing-with-playwright-request-context)
- With Auth: [API Test with Authentication](part3_playwright_har_testing.md#api-test-with-authentication)
- Data-Driven: [Data-Driven Testing](part3_playwright_har_testing.md#api-test-with-data-driven-testing)
- Exercise: [Exercise 1](part4_exercises.md#exercise-1-capture-and-create-api-test)

---

## 📝 Cheat Sheets

### Playwright HAR Commands
```typescript
// Record HAR
await page.routeFromHAR('file.har', { url: '**/*', update: true });

// Replay HAR
await page.routeFromHAR('file.har', { url: '**/*' });

// Mock endpoint
await page.route('**/api/login', (route) => {
  route.fulfill({ status: 200, body: '{"token":"abc"}' });
});
```

### k6 Commands
```bash
# Run basic test
k6 run script.js

# With custom load
k6 run script.js --vus 50 --duration 1m

# Save results
k6 run script.js --out json=results.json
```

### Capture HAR Steps
1. Open DevTools (F12)
2. Go to Network tab
3. Check "Preserve log"
4. Clear network log
5. Perform actions
6. Right-click → "Save all as HAR"

---

## 🎯 Common Use Cases

| Use Case | Best Tool | Time | Difficulty |
|----------|-----------|------|------------|
| Test login flow | Replay HAR | 5 min | Easy |
| Find slow endpoint | Load test with k6 | 10 min | Medium |
| Test payment error | Mock 403 response | 5 min | Easy |
| Run tests offline | HAR replay | 2 min | Easy |
| Load test checkout | k6 stress test | 15 min | Medium |
| Test all error codes | Mock multiple scenarios | 15 min | Medium |
| Find performance regression | k6 baseline comparison | 20 min | Hard |
| Simulate spike traffic | k6 spike test | 10 min | Medium |

---

## ⚠️ Troubleshooting Index

### HAR Files
- **Too Large**: [Filter by URL](part1_har_capture_guide.md#issue-1-har-file-is-too-large)
- **Contains Sensitive Data**: [Sanitize](part1_har_capture_guide.md#sanitizing-har-files-security-best-practice)
- **Missing Requests**: [Use wait strategies](part1_har_capture_guide.md#issue-3-har-doesnt-contain-expected-requests)
- **Stale Data**: [Force update](part1_har_capture_guide.md#issue-4-recorded-har-is-stale)

### Tests
- **Flaky Tests**: Use HAR replay for consistency
- **Tests Too Slow**: Use HAR replay instead of real API
- **Mock Not Working**: Check URL pattern matches

### k6
- **Connection Refused**: [API not running](part2_k6_performance_guide.md#k6-installation--setup)
- **Out of Memory**: Reduce VUs or duration
- **High Failure Rate**: Check API, reduce load

---

## 📚 Knowledge Graph

```
                    Understanding Network
                            ↓
                    What is HAR?
                    ↙           ↘
            Capture HAR          Analyze HAR
            ↓                     ↓
    Record Real Flows      Extract Requests
            ↓                     ↓
    Part 1: Capture    Part 2: Convert to k6
            ↓                     ↓
    Exercise 1-3       Exercise 4, k6 Scripts
            ↓                     ↓
    Recording Skills    Load Testing Skills
            ↓                     ↓
    Part 3: Replay             ↓
    & Mocking           Performance Testing
            ↓                   Expertise
    Mocking Skills
            ↓
    Complete Mastery ✓
```

---

## 🏆 Achievement Unlocked

### Bronze Level (Part 1)
- [ ] Understand what HAR is
- [ ] Capture a HAR file with DevTools
- **Badge**: HAR Apprentice 🥉

### Silver Level (Parts 1-3)
- [ ] Capture with Playwright
- [ ] Replay HAR files
- [ ] Mock API endpoints
- **Badge**: HAR Practitioner 🥈

### Gold Level (Parts 1-4 + Exercises)
- [ ] Complete all 4 exercises
- [ ] Run k6 load tests
- [ ] Analyze performance metrics
- **Badge**: HAR Expert 🥇

### Platinum Level (Master)
- [ ] Complete bonus challenges
- [ ] Integrate into CI/CD
- [ ] Mentor others
- **Badge**: HAR Master 💎

---

## 📞 Quick Reference

| Question | Answer | Reference |
|----------|--------|-----------|
| What is HAR? | JSON log of network requests | [Part 1](part1_har_capture_guide.md#what-is-a-har-file) |
| Why use HAR? | Fast, reliable, realistic tests | [Part 1](part1_har_capture_guide.md#why-use-har-files-for-api-testing) |
| How to capture? | DevTools or Playwright | [Part 1](part1_har_capture_guide.md) |
| How to replay? | `routeFromHAR()` | [Part 3](part3_playwright_har_testing.md#replaying-from-har-files) |
| How to mock? | `route.fulfill()` | [Part 3](part3_playwright_har_testing.md#mock-individual-requests) |
| How to load test? | k6 scripts | [Part 2](part2_k6_performance_guide.md) |
| Help? Start here | [README](README.md) | Navigation |

---

## 🎓 Study Tips

1. **Start with Part 1** - Understand the concept
2. **Do Exercise 1** - Get hands-on immediately
3. **Read Part 2** - Learn performance testing
4. **Do Exercise 4** - Apply to k6
5. **Read Part 3** - Advanced techniques
6. **Do Exercises 2-3** - Master replay/mocking
7. **Complete Bonus** - Become an expert

---

## 📈 Progress Tracker

```
Week 1:
□ Read Part 1 (HAR Capture)
□ Complete Exercise 1 (Capture and Test)
□ Practice capturing on own API

Week 2:
□ Read Part 2 (k6 Performance)
□ Read Part 3 (Replay & Mocking)
□ Complete Exercise 2 (Mocking)
□ Complete Exercise 3 (Replay)

Week 3:
□ Complete Exercise 4 (k6 Load Test)
□ Complete Bonus Challenges
□ Integrate tests into CI/CD
□ Celebrate mastery! 🎉
```

---

## 📖 This Index at a Glance

| Section | Purpose | Time |
|---------|---------|------|
| Quick Start Paths | Choose your learning path | 2 min |
| File Structure | Understand what's where | 2 min |
| Learning Objectives | Know what you'll learn | 5 min |
| Skill Progression | See your journey | 2 min |
| Find What You Need | Locate answers quickly | 2 min |
| Cheat Sheets | Remember key commands | 3 min |
| Common Use Cases | See real applications | 5 min |
| Troubleshooting | Fix problems | As needed |
| Knowledge Graph | Understand connections | 3 min |
| Reference Table | Quick lookups | As needed |

---

**Version**: 1.0  
**Last Updated**: November 13, 2025  
**Status**: Complete & Ready to Use

👉 **Get started!** Pick your [learning path](README.md) and dive in!
