import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'https://petstore.swagger.io/v2';

export let options = {
  vus: 10,
  duration: '5m',
  thresholds: {
    http_req_duration: ['p(95)<3000'],
    http_req_failed: ['rate<0.05'],
  },
};

export default function() {
  // STEP 1: Get available pets
  let petsResponse = http.get(`${BASE_URL}/pet/findByStatus?status=available`);
  
  check(petsResponse, {
    'get pets - status is 200': (r) => r.status === 200,
    'get pets - has data': (r) => JSON.parse(r.body).length > 0,
  });
  
  let pets = JSON.parse(petsResponse.body);
  let randomPet = pets[Math.floor(Math.random() * pets.length)];
  let petId = randomPet.id;
  
  sleep(0.5);
  
  // STEP 2: Get pet details
  let petDetailsResponse = http.get(`${BASE_URL}/pet/${petId}`);
  
  check(petDetailsResponse, {
    'get pet details - status is 200': (r) => r.status === 200,
    'get pet details - has pet name': (r) => {
      let pet = JSON.parse(r.body);
      return pet.name && pet.name.length > 0;
    },
  });
  
  let petDetails = JSON.parse(petDetailsResponse.body);
  console.log(`Selected pet: ${petDetails.name} (ID: ${petId})`);
  
  sleep(0.5);
  
  // STEP 3: Create order
  let orderPayload = {
    petId: petId,
    quantity: 1,
    shipDate: new Date().toISOString(),
    status: 'placed',
    complete: false,
  };
  
  let orderResponse = http.post(
    `${BASE_URL}/store/order`,
    JSON.stringify(orderPayload),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
  
  check(orderResponse, {
    'create order - status is 200': (r) => r.status === 200,
    'create order - has orderId': (r) => {
      let order = JSON.parse(r.body);
      return order.id && order.id > 0;
    },
  });
  
  let order = JSON.parse(orderResponse.body);
  let orderId = order.id;
  console.log(`Created order: ${orderId}`);
  
  sleep(0.5);
  
  // STEP 4: Retrieve order
  let getOrderResponse = http.get(`${BASE_URL}/store/order/${orderId}`);
  
  check(getOrderResponse, {
    'get order - status is 200': (r) => r.status === 200,
    'get order - matches petId': (r) => {
      let retrieved = JSON.parse(r.body);
      return retrieved.petId === petId;
    },
  });
  
  sleep(Math.random() * 3 + 1);
}
