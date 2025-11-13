import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Gauge, Trend } from 'k6/metrics';

const BASE_URL = 'https://petstore.swagger.io/v2';

// Custom business metrics
const browsedPets = new Counter('browsed_pets');
const ordersCreated = new Counter('orders_created');
const petPrices = new Trend('pet_price');
const activeSessions = new Gauge('active_sessions');
const orderSuccessRate = new Trend('order_success_rate');

export let options = {
  vus: 15,
  duration: '10m',
  thresholds: {
    'order_success_rate': ['p(95)>0.95'],
    'http_req_duration': ['p(95)<2000'],
  },
};

export default function() {
  activeSessions.add(1);
  
  // Browse available pets
  let petsResponse = http.get(
    `${BASE_URL}/pet/findByStatus?status=available`,
    { tags: { endpoint: 'browse_pets' } }
  );
  
  if (petsResponse.status === 200) {
    let pets = JSON.parse(petsResponse.body);
    browsedPets.add(pets.length);
    
    // Check prices of all pets
    pets.forEach(pet => {
      if (pet.photoUrls && pet.photoUrls.length > 0) {
        // Simulate price tracking
        let estimatedPrice = Math.random() * 100 + 50; // $50-150
        petPrices.add(estimatedPrice);
      }
    });
    
    check(petsResponse, {
      'browse - status is 200': (r) => r.status === 200,
      'browse - has pets': (r) => JSON.parse(r.body).length > 0,
    });
  }
  
  sleep(1);
  
  // Select random pet and create order
  if (Math.random() < 0.7) { // 70% of users create orders
    let petsData = JSON.parse(petsResponse.body);
    let selectedPet = petsData[Math.floor(Math.random() * petsData.length)];
    
    let orderPayload = {
      petId: selectedPet.id,
      quantity: Math.floor(Math.random() * 3) + 1,
      status: 'placed',
      complete: false,
    };
    
    let createOrderResponse = http.post(
      `${BASE_URL}/store/order`,
      JSON.stringify(orderPayload),
      {
        headers: { 'Content-Type': 'application/json' },
        tags: { endpoint: 'create_order' },
      }
    );
    
    let orderSuccess = createOrderResponse.status === 200 ? 1 : 0;
    orderSuccessRate.add(orderSuccess);
    
    if (orderSuccess === 1) {
      ordersCreated.add(1);
      
      check(createOrderResponse, {
        'create order - success': (r) => r.status === 200,
      });
    }
  }
  
  activeSessions.add(-1);
  sleep(Math.random() * 2 + 1);
}

export function handleSummary(data) {
  console.log('\n=== Business Metrics Summary ===');
  console.log(`Pets browsed: ${data.metrics.browsed_pets.values.count}`);
  console.log(`Orders created: ${data.metrics.orders_created.values.count}`);
  console.log(`Average pet price: $${data.metrics.pet_price.values.avg.toFixed(2)}`);
  console.log(`Order success rate: ${(data.metrics.order_success_rate.values.avg * 100).toFixed(2)}%`);
}
