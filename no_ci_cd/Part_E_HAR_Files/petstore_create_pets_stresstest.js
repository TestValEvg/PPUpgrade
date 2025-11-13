import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter } from 'k6/metrics';

// Stress Test Script - Create Pets
// Scenario: Create pets with escalating load (start at 5 VUs, ramp up to 50 VUs over 30 seconds)

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

/*
HOW TO RUN:
k6 run petstore_create_pets_stresstest.js

WHAT THIS DOES:
- Starts with 5 concurrent users
- Gradually increases to 50 users over 60 seconds
- Then ramps down to 0
- Tracks successful/failed pet creations
- Monitors response times

KEY METRICS TO WATCH:
- pets_created: Number of successfully created pets
- pets_errors: Number of failures
- http_req_duration: Response time distribution
- http_req_failed: Failure rate percentage
*/
