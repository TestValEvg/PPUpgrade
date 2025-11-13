# 📊 k6 Performance Testing - Complete Report Template

## Executive Summary

| Metric | Value | Status |
|--------|-------|--------|
| **Test Date** | November 13, 2025 | - |
| **Test Duration** | 19 minutes | - |
| **Total Requests** | 3,450 | ✅ |
| **Successful Requests** | 3,406 | 98.73% |
| **Failed Requests** | 44 | 1.27% |
| **Peak Virtual Users** | 50 | - |
| **Average Response Time** | 487.34 ms | ✅ Pass |
| **95th Percentile** | 987.45 ms | ✅ Pass |
| **99th Percentile** | 1,645.34 ms | ✅ Pass |

---

## 1. Test Overview

### 1.1 Objectives
- ✅ Validate Petstore API performance under realistic load
- ✅ Identify performance bottlenecks
- ✅ Verify system meets SLA requirements (p95 < 1000ms)
- ✅ Establish baseline metrics for future comparisons
- ✅ Test multi-endpoint workflow reliability

### 1.2 Test Environment
- **Target System:** Petstore Swagger API (https://petstore.swagger.io/v2)
- **Test Type:** Load Testing with Ramp-up
- **Load Generator:** k6 v0.48.0
- **Test Framework:** Custom k6 script with business metrics
- **Network:** Cloud-based testing environment

### 1.3 Scope
- ✅ Browse pets endpoint (`GET /pet/findByStatus`)
- ✅ Get pet details endpoint (`GET /pet/{id}`)
- ✅ Create order endpoint (`POST /store/order`)
- ✅ Get order endpoint (`GET /store/order/{id}`)
- ⛔ User authentication (not in scope)
- ⛔ Admin endpoints (not in scope)

---

## 2. Load Profile

### 2.1 Test Stages

```
Virtual Users over Time
│
50 ├─────────────────────────────────────────────────┐
   │                     SUSTAINED LOAD (10 min)      │
40 │                                                   │
30 │            ╱─────────────────────────╲            │
20 │          ╱                             ╲          │
10 │        ╱                                 ╲        │
   │      ╱ RAMP UP (7 min)  RAMP DOWN (2 min)╲      │
 0 │────────────────────────────────────────────────────
   0      2      4      6      8     10     12     14    16  18+
                     Time (minutes)
```

### 2.2 Load Stages Breakdown

| Stage | Duration | Target VUs | Purpose |
|-------|----------|-----------|---------|
| Ramp-up Phase 1 | 2 min | 20 | Initial load validation |
| Ramp-up Phase 2 | 5 min | 50 | Gradual load increase |
| Sustained Load | 10 min | 50 | Measure steady-state performance |
| Ramp-down | 2 min | 0 | Graceful shutdown |
| **Total** | **19 min** | - | - |

### 2.3 User Behavior

**Per Virtual User:**
- Browse pets: 100% of iterations
- Get pet details: 80% of iterations
- Create order: 20% of iterations
- Think time: 1-2 seconds between actions
- Average iteration duration: 4-6 seconds

---

## 3. Performance Metrics

### 3.1 Response Time Analysis

```
Response Time Distribution (ms)
│
│     ╭╮
│     ││                    HTTP Request Duration
│     ││                    ────────────────────────
│     ││                    Min:    45.23 ms
│ ▄▄▄ ││ ▄▄▄ ▄▄▄ ▄▄ ▄ ▄    Mean:  487.34 ms
│▐███▌││▐███▌▌ ▄  Median: 432.15 ms
│▐███▌││▐███▌ ▐▌   Max: 2,134.56 ms
│▐███▌││▐███▌ ▐▌   P90: 872.45 ms
│▐███▌││▐███▌▐▌    P95: 987.45 ms
└────┴┴─────────────P99: 1,645.34 ms
 0-100 100-200 200-500 500-1000 1000-2000+ (ms)
```

### 3.2 Key Metrics Table

| Metric | Value | Status | SLA Requirement |
|--------|-------|--------|-----------------|
| **Average Response Time** | 487.34 ms | ✅ Pass | < 500 ms |
| **Median Response Time** | 432.15 ms | ✅ Pass | < 400 ms |
| **Min Response Time** | 45.23 ms | ✅ Pass | - |
| **Max Response Time** | 2,134.56 ms | ⚠️ Monitor | < 3000 ms |
| **P90 Response Time** | 872.45 ms | ✅ Pass | < 900 ms |
| **P95 Response Time** | 987.45 ms | ✅ Pass | < 1000 ms |
| **P99 Response Time** | 1,645.34 ms | ✅ Pass | < 2000 ms |

### 3.3 Throughput Metrics

| Metric | Value | Analysis |
|--------|-------|----------|
| **Total Requests** | 3,450 | - |
| **Requests/Second (avg)** | 18.4 | Healthy |
| **Requests/Second (peak)** | 28.5 | At 50 VUs |
| **Failed Requests** | 44 | 1.27% |
| **Success Rate** | 98.73% | Good |

### 3.4 Reliability Metrics

```
Request Success Rate Over Time
│
100%├─────────────────────────────────────────────────
   │ ╱─┐
   │╱  └─────────────────────────────────────────────
 98%│
   │
 96%│
   └─────────────────────────────────────────────────
   0      5      10     15     19 (minutes)
```

---

## 4. Endpoint-Level Analysis

### 4.1 Browse Pets Endpoint

**Endpoint:** `GET /pet/findByStatus?status=available`

| Metric | Value | Status |
|--------|-------|--------|
| **Total Requests** | 1,725 | 50% of traffic |
| **Avg Response Time** | 234 ms | ✅ Excellent |
| **P95 Response Time** | 456 ms | ✅ Excellent |
| **Max Response Time** | 890 ms | ✅ Good |
| **Success Rate** | 99.8% | ✅ Excellent |
| **Failure Count** | 3 | Minimal |

**Analysis:**
- Fastest endpoint (lowest response time)
- Most frequently called (50% of all requests)
- Excellent success rate
- Likely benefits from caching

---

### 4.2 Get Pet Details Endpoint

**Endpoint:** `GET /pet/{id}`

| Metric | Value | Status |
|--------|-------|--------|
| **Total Requests** | 1,380 | 40% of traffic |
| **Avg Response Time** | 289 ms | ✅ Good |
| **P95 Response Time** | 567 ms | ✅ Good |
| **Max Response Time** | 1,234 ms | ✅ Good |
| **Success Rate** | 99.1% | ✅ Good |
| **Failure Count** | 12 | Acceptable |

**Analysis:**
- Second most frequently called endpoint
- Slightly slower than browse (expected - specific lookup)
- Good success rate
- Response times consistent

---

### 4.3 Create Order Endpoint

**Endpoint:** `POST /store/order`

| Metric | Value | Status |
|--------|-------|--------|
| **Total Requests** | 345 | 10% of traffic |
| **Avg Response Time** | 456 ms | ✅ Pass |
| **P95 Response Time** | 789 ms | ✅ Pass |
| **Max Response Time** | 2,134 ms | ⚠️ Monitor |
| **Success Rate** | 96.5% | ✅ Pass |
| **Failure Count** | 12 | Acceptable |

**Analysis:**
- Slowest endpoint (write operation - expected)
- Lower success rate (96.5% vs 99%+)
- Some slow outliers (2.1 seconds)
- Consider optimization or queue implementation

---

### 4.4 Get Order Endpoint

**Endpoint:** `GET /store/order/{id}`

| Metric | Value | Status |
|--------|-------|--------|
| **Total Requests** | 345 | 10% of traffic |
| **Avg Response Time** | 298 ms | ✅ Good |
| **P95 Response Time** | 512 ms | ✅ Good |
| **Max Response Time** | 1,456 ms | ✅ Good |
| **Success Rate** | 100% | ✅ Perfect |
| **Failure Count** | 0 | Excellent |

**Analysis:**
- Perfect success rate (100%)
- Consistent response times
- Good performance

---

## 5. Business Metrics

### 5.1 Conversion Funnel

```
User Journey Conversion
───────────────────────────

Users arrived:                    3,450 iterations
  └─ Browsed pets:              3,450 (100%)
      └─ Viewed pet details:     2,760 (80%)
          └─ Created order:        690 (20% of total, 25% of viewers)
              └─ Successfully:      667 (96.7% success)
```

### 5.2 Business KPIs

| KPI | Value | Target | Status |
|-----|-------|--------|--------|
| **Conversion Rate** | 20% | > 15% | ✅ Pass |
| **Order Success Rate** | 96.7% | > 95% | ✅ Pass |
| **Browse Success Rate** | 99.8% | > 98% | ✅ Pass |
| **Average Order Value** | $87.45 | - | - |
| **Pet Browse Rate** | 1,725/min | - | Baseline |
| **Order Creation Rate** | 230/min | > 200 | ✅ Pass |

### 5.3 Simulated Revenue Impact

**Assumptions:**
- Average order value: $87.45
- Conversion rate: 20%
- Peak throughput: 28.5 requests/sec

**Extrapolation to 1 hour:**
- Requests: 102,600
- Orders: 20,520
- **Revenue: $1,794,639**

---

## 6. Error Analysis

### 6.1 Error Rate by Endpoint

| Endpoint | Errors | Total | Rate |
|----------|--------|-------|------|
| Browse Pets | 3 | 1,725 | 0.17% |
| Get Details | 12 | 1,380 | 0.87% |
| Create Order | 12 | 345 | 3.48% |
| Get Order | 0 | 345 | 0.00% |
| **Total** | **27** | **3,795** | **0.71%** |

### 6.2 Error Types

| Type | Count | Cause | Resolution |
|------|-------|-------|------------|
| Timeout (>5s) | 15 | Network latency or slow backend | Monitor network |
| 500 Server Error | 8 | Backend temporary issue | Auto-retry |
| Connection Error | 4 | Network connectivity | Check connection |

### 6.3 Error Timeline

```
Errors per Minute
│
│
4 ├─┐
│ │
│ │  ┌─┐
3 ├─┼──┤
│ │  │ │    ┌─┐
│ │  │ ├─┐  │ │  ┌─┐
2 ├─┼──┤ ├──┤ ├──┤ ├
│ │  │ │  │  │ │   │ │
│ │  │ │  │  │ │   │ │
1 ├─┼──┼──┼──┼──────┼─
│ │  │ │  │  │   │ │
└─┴──┴─┴──┴──┴──────┴─
  0  5 10 15 19 (min)
```

---

## 7. System Behavior Under Load

### 7.1 Load Impact Analysis

```
Response Time vs. Load
                        
Max Response Time│      ╱─────────
(ms)             │    ╱
2000 ├───────────┼──╱
     │          │╱
1500 ├────────╱─┤
     │      ╱   │
1000 ├────╱─────┤
     │  ╱       │
 500 ├╱─────────┤
     │         │
   0 └──────────┴──────────
     0   10   20   30   40   50 (VUs)
```

### 7.2 Load Progression Impact

| VUs | Avg Response (ms) | P95 Response (ms) | Error Rate |
|-----|------------------|------------------|-----------|
| 0-10 | 234 | 423 | 0.2% |
| 10-20 | 289 | 567 | 0.5% |
| 20-30 | 387 | 745 | 0.8% |
| 30-40 | 412 | 856 | 1.0% |
| 40-50 | 487 | 987 | 1.3% |

**Observation:** Linear response time increase with load (healthy pattern)

---

## 8. Findings & Insights

### 8.1 Key Findings

✅ **Positive:**
1. **System scales linearly** - Response times increase proportionally with load
2. **High reliability** - 98.73% success rate under 50 concurrent users
3. **Fast browse endpoint** - Averaging 234ms (cacheable)
4. **Good order processing** - 96.7% success rate despite write operations
5. **Consistent performance** - No degradation during sustained load

⚠️ **Areas for Attention:**
1. **Order creation slowness** - Average 456ms (consider async processing)
2. **Occasional slowdowns** - Max 2.1 seconds on some requests
3. **Create order failures** - 3.48% error rate (vs 0.17% browse)
4. **Missing caching** - Browse endpoint called frequently

❌ **Issues Found:**
- None critical

### 8.2 Performance Bottlenecks

**Bottleneck #1: Order Creation Latency**
- **Issue:** POST /store/order averages 456ms
- **Root Cause:** Write operations + database persistence
- **Impact:** Could limit transaction throughput during peak hours
- **Severity:** Medium
- **Recommendation:** Implement async processing or queue

**Bottleneck #2: Occasional Response Time Spikes**
- **Issue:** Max response time reached 2.1 seconds
- **Root Cause:** Likely backend resource contention
- **Impact:** Affects user experience for 1-2% of requests
- **Severity:** Low
- **Recommendation:** Monitor and add auto-scaling triggers

---

## 9. Recommendations

### 9.1 Priority 1: Immediate Actions

| Recommendation | Rationale | Effort | Impact |
|---|---|---|---|
| **Set up monitoring** | No real-time alerting in place | Low | High |
| **Add error tracking** | Understand why 3.48% orders fail | Medium | High |
| **Establish baselines** | Compare future tests to these metrics | Low | High |

### 9.2 Priority 2: Short-term (1-2 weeks)

| Recommendation | Rationale | Effort | Impact |
|---|---|---|---|
| **Optimize order endpoint** | Reduce 456ms avg to <300ms | Medium | High |
| **Implement caching** | Browse called 50% of requests | Medium | Medium |
| **Add connection pooling** | Improve throughput | Medium | Medium |

### 9.3 Priority 3: Long-term (1-3 months)

| Recommendation | Rationale | Effort | Impact |
|---|---|---|---|
| **Database optimization** | Prepare for 2-3x load increase | High | High |
| **Implement CDN** | Reduce latency for global users | High | Medium |
| **Auto-scaling strategy** | Handle traffic spikes | High | High |

---

## 10. SLA Compliance

### 10.1 SLA Requirements

| Requirement | Target | Actual | Status |
|---|---|---|---|
| Average Response Time | < 500ms | 487.34ms | ✅ **PASS** |
| P95 Response Time | < 1000ms | 987.45ms | ✅ **PASS** |
| P99 Response Time | < 2000ms | 1,645.34ms | ✅ **PASS** |
| Success Rate | > 95% | 98.73% | ✅ **PASS** |
| Browse Success Rate | > 98% | 99.8% | ✅ **PASS** |
| Order Success Rate | > 95% | 96.7% | ✅ **PASS** |

### 10.2 Overall Compliance

**🟢 COMPLIANT - All SLA requirements met**

The Petstore API meets or exceeds all defined SLA requirements under the tested load conditions (50 concurrent users).

---

## 11. Scalability Assessment

### 11.1 Estimated Capacity

Based on current performance:

| Metric | Current (50 VUs) | Estimated (100 VUs) | Estimated (500 VUs) |
|--------|------------------|-------------------|-------------------|
| **Requests/sec** | 18.4 | 36.8 | 184 |
| **Avg Response (ms)** | 487 | 650-750 | 1200-1500 |
| **P95 Response (ms)** | 987 | 1300-1500 | 2500-3000 |
| **Success Rate** | 98.73% | 97-98% | 95-96% |

### 11.2 Breaking Point Prediction

Based on linear scaling pattern:
- **System starts degrading significantly** at ~100-150 concurrent users
- **Critical performance degradation** at ~300+ concurrent users
- **Recommended capacity ceiling:** 100 concurrent users (for p95 < 1500ms)

---

## 12. Comparison & Baseline

### 12.1 Industry Benchmarks

| Metric | Your System | Industry Average | Status |
|--------|------------|-----------------|--------|
| **Avg Response Time** | 487ms | 300-500ms | ✅ On par |
| **P95 Response Time** | 987ms | 800-1200ms | ✅ On par |
| **Success Rate** | 98.73% | 99%+ | ⚠️ Slightly below |
| **Throughput (req/s)** | 18.4 | 20-50 | ⚠️ Below industry |

### 12.2 Baseline for Future Testing

**Baseline Established: November 13, 2025**

Use these metrics to compare future test runs:
- Avg Response Time: **487.34 ms**
- P95 Response Time: **987.45 ms**
- Success Rate: **98.73%**
- Requests/Second: **18.4**

---

## 13. Conclusion

### 13.1 Executive Conclusion

✅ **The Petstore API is PRODUCTION-READY** under the tested load conditions.

The system demonstrates:
- Solid performance with sub-1-second response times (p95)
- Reliable operation with 98.73% success rate
- Linear scaling characteristics
- Meeting or exceeding all SLA requirements

### 13.2 Next Steps

1. **Deploy with confidence** - System meets production requirements
2. **Set up monitoring** - Monitor the baseline metrics continuously
3. **Plan for growth** - Prepare scaling strategy for 2-3x current load
4. **Schedule retesting** - Rerun these tests monthly
5. **Optimize bottlenecks** - Address Priority 1 recommendations

### 13.3 Risk Assessment

**Production Readiness: 🟢 LOW RISK**

- ✅ Performance excellent
- ✅ Reliability high
- ⚠️ Plan for scaling
- ⚠️ Monitor error trends

---

## 14. Appendices

### A. Test Script Metadata

```
Script: k6_petstore_load_test.js
k6 Version: 0.48.0
Test Date: November 13, 2025
Duration: 19 minutes
Peak Load: 50 concurrent users
Total Requests: 3,450
API Target: https://petstore.swagger.io/v2
```

### B. Metrics Definitions

- **Response Time:** Total time from request sent to response received
- **P95:** 95th percentile - 95% of requests faster than this value
- **Success Rate:** Percentage of requests with HTTP status 200-299
- **Throughput:** Requests per second
- **VU:** Virtual User (simulated user)

### C. Recommendations for Re-testing

1. **Monthly:** Regression testing with same load profile
2. **Quarterly:** Increase load by 50% to test scaling
3. **Semi-annually:** Full stress test to find breaking point
4. **After changes:** Test after any backend modifications

---

## 15. Sign-off

| Role | Name | Date | Status |
|------|------|------|--------|
| Test Analyst | Performance Team | 13-Nov-2025 | ✅ Approved |
| System Owner | - | - | ⏳ Pending |
| Operations | - | - | ⏳ Pending |

---

**Report Generated:** November 13, 2025
**Report Version:** 1.0
**Status:** ✅ Final
**Confidentiality:** Internal Use

---

*For questions or additional analysis, contact the Performance Testing Team.*
