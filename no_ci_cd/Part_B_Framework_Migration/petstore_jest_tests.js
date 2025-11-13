/**
 * Part B: Postman to JavaScript (Jest + Supertest)
 * API Test Migration using Jest testing framework and Supertest for HTTP assertions
 * Includes async/await patterns and comprehensive error handling
 */

const request = require('supertest');

const BASE_URL = 'https://petstore.swagger.io/v2';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Make API request with error handling
 */
async function makeRequest(method, endpoint, data = null) {
  let req = request(BASE_URL)[method](endpoint);
  
  if (data) {
    req = req.send(data);
  }
  
  return req
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json');
}

/**
 * Extract ID from response
 */
function getPetId(response) {
  return response.body?.id;
}

/**
 * Sample pet data generator
 */
function generatePetData(overrides = {}) {
  return {
    id: Math.floor(Math.random() * 1000000),
    name: 'Test Pet',
    status: 'available',
    photoUrls: ['https://example.com/photo.jpg'],
    ...overrides
  };
}

// ============================================================================
// PART 1: SUCCESSFUL CRUD OPERATIONS
// ============================================================================

describe('Petstore API - Successful Operations', () => {
  let createdPetIds = [];

  afterAll(async () => {
    // Cleanup: delete all created pets
    for (const petId of createdPetIds) {
      try {
        await makeRequest('delete', `/pet/${petId}`);
      } catch (error) {
        console.log(`Cleanup failed for pet ${petId}:`, error.message);
      }
    }
  });

  describe('GET Operations', () => {
    test('Get all available pets with correct schema', async () => {
      const response = await request(BASE_URL)
        .get('/pet/findByStatus')
        .query({ status: 'available' })
        .expect(200)
        .expect('Content-Type', /json/);

      // Assertion: Response is array
      expect(Array.isArray(response.body)).toBe(true);

      // Assertion: Validate required fields
      if (response.body.length > 0) {
        const pet = response.body[0];
        expect(pet).toHaveProperty('id');
        expect(pet).toHaveProperty('name');
        expect(pet).toHaveProperty('status');
        expect(pet).toHaveProperty('photoUrls');
        
        // Assertion: Verify data types
        expect(typeof pet.id).toBe('number');
        expect(typeof pet.name).toBe('string');
        expect(Array.isArray(pet.photoUrls)).toBe(true);
      }
    });

    test('Get pet by ID with 200 response', async () => {
      // First create a pet
      const petData = generatePetData({ id: 10001 });
      const createResp = await makeRequest('post', '/pet', petData);
      createdPetIds.push(createResp.body.id);

      // Then get it
      const response = await request(BASE_URL)
        .get(`/pet/${petData.id}`)
        .expect(200);

      expect(response.body.id).toBe(petData.id);
      expect(response.body.name).toBe(petData.name);
    });

    test('Get multiple pets with different statuses', async () => {
      const statuses = ['available', 'pending', 'sold'];

      for (const status of statuses) {
        const response = await request(BASE_URL)
          .get('/pet/findByStatus')
          .query({ status })
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
      }
    });
  });

  describe('POST Operations', () => {
    test('Create new pet with correct schema validation', async () => {
      const petData = generatePetData();

      const response = await request(BASE_URL)
        .post('/pet')
        .send(petData)
        .expect(200);

      createdPetIds.push(response.body.id);

      // Assertions: Validate response
      expect(response.body).toEqual(expect.objectContaining({
        name: petData.name,
        status: petData.status
      }));
      expect(response.body.id).toBeDefined();
      expect(Array.isArray(response.body.photoUrls)).toBe(true);
    });

    test('Create pet and verify stored data', async () => {
      const petData = generatePetData({
        name: 'Verification Test',
        status: 'available'
      });

      const createResp = await request(BASE_URL)
        .post('/pet')
        .send(petData)
        .expect(200);

      createdPetIds.push(createResp.body.id);

      // Verify by fetching
      const getResp = await request(BASE_URL)
        .get(`/pet/${createResp.body.id}`)
        .expect(200);

      expect(getResp.body.name).toBe('Verification Test');
      expect(getResp.body.status).toBe('available');
    });

    test('Create multiple pets - data-driven test', async () => {
      const testCases = [
        { name: 'Dog', status: 'available' },
        { name: 'Cat', status: 'sold' },
        { name: 'Bird', status: 'pending' }
      ];

      for (const testCase of testCases) {
        const petData = generatePetData(testCase);
        const response = await request(BASE_URL)
          .post('/pet')
          .send(petData)
          .expect(200);

        createdPetIds.push(response.body.id);
        expect(response.body.name).toBe(testCase.name);
        expect(response.body.status).toBe(testCase.status);
      }
    });
  });

  describe('PUT Operations', () => {
    test('Update pet successfully', async () => {
      // Create pet
      const petData = generatePetData();
      const createResp = await request(BASE_URL)
        .post('/pet')
        .send(petData)
        .expect(200);

      createdPetIds.push(createResp.body.id);
      const petId = createResp.body.id;

      // Update pet
      const updatedData = { ...petData, name: 'Updated Name', status: 'sold' };
      const updateResp = await request(BASE_URL)
        .put('/pet')
        .send(updatedData)
        .expect(200);

      expect(updateResp.body.name).toBe('Updated Name');
      expect(updateResp.body.status).toBe('sold');
      expect(updateResp.body.id).toBe(petId);
    });

    test('Update pet and verify persistence', async () => {
      // Create
      const petData = generatePetData();
      const createResp = await request(BASE_URL)
        .post('/pet')
        .send(petData)
        .expect(200);

      createdPetIds.push(createResp.body.id);
      const petId = createResp.body.id;

      // Update
      const updatedData = { ...petData, status: 'pending' };
      await request(BASE_URL)
        .put('/pet')
        .send(updatedData)
        .expect(200);

      // Verify
      const getResp = await request(BASE_URL)
        .get(`/pet/${petId}`)
        .expect(200);

      expect(getResp.body.status).toBe('pending');
    });
  });

  describe('DELETE Operations', () => {
    test('Delete pet successfully', async () => {
      // Create pet
      const petData = generatePetData();
      const createResp = await request(BASE_URL)
        .post('/pet')
        .send(petData)
        .expect(200);

      const petId = createResp.body.id;

      // Delete pet
      const deleteResp = await request(BASE_URL)
        .delete(`/pet/${petId}`)
        .expect(200);

      expect(deleteResp.body).toHaveProperty('message');

      // Verify deletion
      await request(BASE_URL)
        .get(`/pet/${petId}`)
        .expect(404);
    });

    test('Delete pet and verify 404', async () => {
      // Create
      const petData = generatePetData();
      const createResp = await request(BASE_URL)
        .post('/pet')
        .send(petData)
        .expect(200);

      const petId = createResp.body.id;

      // Delete
      await request(BASE_URL)
        .delete(`/pet/${petId}`)
        .expect(200);

      // Should not exist
      await request(BASE_URL)
        .get(`/pet/${petId}`)
        .expect(404);
    });
  });
});

// ============================================================================
// PART 2: NEGATIVE TEST CASES
// ============================================================================

describe('Petstore API - Negative Test Cases', () => {
  test('Get non-existent pet returns 404', async () => {
    const response = await request(BASE_URL)
      .get('/pet/99999999')
      .expect(404);

    expect(response.body).toHaveProperty('message');
  });

  test('Invalid status parameter handling', async () => {
    const response = await request(BASE_URL)
      .get('/pet/findByStatus')
      .query({ status: 'invalid_status_xyz' })
      .expect(200);

    // Should return empty array or handle gracefully
    expect(Array.isArray(response.body) || response.body.message).toBeTruthy();
  });

  test('Create pet with missing required fields', async () => {
    const incompletePet = {
      name: 'Incomplete Pet'
      // Missing: id, photoUrls, status
    };

    const response = await request(BASE_URL)
      .post('/pet')
      .send(incompletePet);

    // API might accept partial data (200) or reject (400/422)
    expect([200, 400, 422, 415]).toContain(response.status);
  });

  test('Update non-existent pet', async () => {
    const nonExistentPet = {
      id: 99999999,
      name: 'Ghost Pet',
      status: 'available',
      photoUrls: ['url']
    };

    const response = await request(BASE_URL)
      .put('/pet')
      .send(nonExistentPet);

    // Might create or return error
    expect([200, 404, 400]).toContain(response.status);
  });

  test('Delete non-existent pet', async () => {
    const response = await request(BASE_URL)
      .delete('/pet/99999999');

    // Might return 200 (idempotent) or 404
    expect([200, 404]).toContain(response.status);
  });
});

// ============================================================================
// PART 3: BOUNDARY VALUE TESTING
// ============================================================================

describe('Petstore API - Boundary Value Tests', () => {
  let createdPetIds = [];

  afterAll(async () => {
    for (const petId of createdPetIds) {
      try {
        await request(BASE_URL).delete(`/pet/${petId}`);
      } catch (error) {
        // Ignore cleanup errors
      }
    }
  });

  describe.each([
    [1, 'minimum_id'],
    [9223372036854775807, 'maximum_64bit_int'],
    [0, 'zero_id']
  ])('Boundary ID values - %s', (petId, description) => {
    test(`Create pet with ${description}`, async () => {
      const petData = generatePetData({
        id: petId,
        name: `Pet_${description}`
      });

      const response = await request(BASE_URL)
        .post('/pet')
        .send(petData);

      if (response.status === 200) {
        createdPetIds.push(response.body.id);
        expect(response.body).toHaveProperty('id');
      }
    });
  });

  describe.each(['available', 'pending', 'sold'])(
    'Valid status values - %s',
    (status) => {
      test(`Get pets with status: ${status}`, async () => {
        const response = await request(BASE_URL)
          .get('/pet/findByStatus')
          .query({ status })
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
      });
    }
  );

  test('Create pet with empty name', async () => {
    const petData = generatePetData({ name: '' });

    const response = await request(BASE_URL)
      .post('/pet')
      .send(petData);

    if (response.status === 200) {
      createdPetIds.push(response.body.id);
      expect(response.body).toHaveProperty('name');
    }
  });
});

// ============================================================================
// PART 4: INTEGRATION TESTS
// ============================================================================

describe('Petstore API - Integration Tests', () => {
  test('Complete CRUD lifecycle', async () => {
    const petData = generatePetData({ name: 'Lifecycle Test' });

    // CREATE
    const createResp = await request(BASE_URL)
      .post('/pet')
      .send(petData)
      .expect(200);

    const petId = createResp.body.id;
    expect(createResp.body.name).toBe('Lifecycle Test');

    // READ
    const readResp = await request(BASE_URL)
      .get(`/pet/${petId}`)
      .expect(200);

    expect(readResp.body.id).toBe(petId);

    // UPDATE
    const updatedData = { ...petData, status: 'sold' };
    const updateResp = await request(BASE_URL)
      .put('/pet')
      .send(updatedData)
      .expect(200);

    expect(updateResp.body.status).toBe('sold');

    // VERIFY UPDATE
    const verifyResp = await request(BASE_URL)
      .get(`/pet/${petId}`)
      .expect(200);

    expect(verifyResp.body.status).toBe('sold');

    // DELETE
    await request(BASE_URL)
      .delete(`/pet/${petId}`)
      .expect(200);

    // VERIFY DELETION
    await request(BASE_URL)
      .get(`/pet/${petId}`)
      .expect(404);
  });

  test('Multiple concurrent operations', async () => {
    const petIds = [];

    // Create 3 pets
    for (let i = 0; i < 3; i++) {
      const petData = generatePetData({ name: `Concurrent Pet ${i}` });
      const resp = await request(BASE_URL)
        .post('/pet')
        .send(petData)
        .expect(200);

      petIds.push(resp.body.id);
    }

    // Query all
    const queryResp = await request(BASE_URL)
      .get('/pet/findByStatus')
      .query({ status: 'available' })
      .expect(200);

    expect(Array.isArray(queryResp.body)).toBe(true);
    expect(queryResp.body.length).toBeGreaterThan(0);

    // Cleanup
    for (const petId of petIds) {
      await request(BASE_URL).delete(`/pet/${petId}`);
    }
  });
});

// ============================================================================
// PART 5: PERFORMANCE TESTS
// ============================================================================

describe('Petstore API - Performance Tests', () => {
  test('GET response time < 5 seconds', async () => {
    const startTime = Date.now();

    const response = await request(BASE_URL)
      .get('/pet/findByStatus')
      .query({ status: 'available' })
      .expect(200);

    const responseTime = Date.now() - startTime;

    expect(responseTime).toBeLessThan(5000);
    console.log(`Response time: ${responseTime}ms`);
  });

  test('POST response time < 3 seconds', async () => {
    const petData = generatePetData();
    const startTime = Date.now();

    const response = await request(BASE_URL)
      .post('/pet')
      .send(petData)
      .expect(200);

    const responseTime = Date.now() - startTime;

    expect(responseTime).toBeLessThan(3000);
    console.log(`Creation time: ${responseTime}ms`);

    // Cleanup
    await request(BASE_URL).delete(`/pet/${response.body.id}`);
  });
});
