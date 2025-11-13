import http from 'k6/http';
import { check, sleep } from 'k6';

// Load Test Script - Get Available Pets
// Scenario: Every second, fetch all available pets. Simulate 20 concurrent users for 1 minute.

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

/*
HOW TO RUN:
k6 run petstore_get_pets_loadtest.js

EXPECTED OUTPUT:
     data_received..................: 150 kB
     data_sent......................: 45 kB
     http_req_duration..............: avg=245ms, p(95)=450ms, p(99)=850ms
     http_req_failed................: 0.50%
     iterations.....................: 1200
     vus............................: 20
     vus_max........................: 20
*/
