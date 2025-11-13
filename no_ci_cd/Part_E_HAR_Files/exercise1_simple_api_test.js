import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'https://petstore.swagger.io/v2';

export let options = {
  vus: 5,
  duration: '1m',
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    http_req_failed: ['rate<0.1'],
  },
};

export default function() {
  // Fetch available pets
  let response = http.get(`${BASE_URL}/pet/findByStatus?status=available`);
  
  // Validate response
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response has pets': (r) => JSON.parse(r.body).length > 0,
    'response time < 2000ms': (r) => r.timings.duration < 2000,
  });
  
  sleep(1);
}
