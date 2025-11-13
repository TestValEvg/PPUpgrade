import http from 'k6/http';
import { check, sleep } from 'k6';

// Spike Test Script - Sudden Traffic Surge
// Scenario: Simulate a sudden traffic spike (users watching a live stream going live)

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

/*
HOW TO RUN:
k6 run petstore_spike_test.js

WHAT THIS DOES:
- Starts with 10 normal users
- SUDDENLY increases to 100 users (simulating viral moment)
- Maintains high load for 10 seconds
- Then drops back to 10 users
- Tests how API handles rapid change in load

REAL-WORLD SCENARIOS:
- Celebrity tweets about your product
- Product launch announcement
- Black Friday/Cyber Monday traffic spikes
- Breaking news alert broadcast
- Live streaming event starts

EXPECTED RESULTS:
- Some delays are acceptable during spike
- API should recover quickly when load drops
- Should not crash or return 500 errors
- 429 (Rate Limited) responses are acceptable

WHAT TO WATCH FOR:
- Cascading failures (ones requests cause others to fail)
- Slow recovery (stuck at high latency after load drops)
- Memory not being freed
- Connection pool exhaustion
*/
