import http from 'k6/http';
import { check, sleep } from 'k6';

// Soak Test Script - Sustained Load
// Scenario: Keep a steady load of 10 VUs for 10 minutes to find memory leaks or data degradation

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

/*
HOW TO RUN:
k6 run petstore_soak_test.js

WHAT THIS DOES:
- Maintains steady load of 10 concurrent users
- Runs for 10 minutes (600 seconds)
- Cycles through GET, CREATE, GET single, DELETE operations
- Ideal for finding memory leaks, connection pool issues, data degradation

WHY SOAK TESTS MATTER:
- Many bugs only appear after hours of operation
- Memory leaks gradually degrade performance
- Connection pools may not handle prolonged use
- Database performance may degrade over time

EXPECTED BEHAVIOR:
- Metrics should remain stable throughout
- No increase in response time over time
- Consistent success rates
- No memory growth in server

If metrics get worse over time, you've found a bug!
*/
