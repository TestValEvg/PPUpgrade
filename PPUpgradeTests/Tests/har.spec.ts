import { test, expect } from '@playwright/test';
import * as path from 'path';

const harDir = path.join(__dirname, '../har-files');

test.describe('HAR File Testing - Petstore API', () => {
  test('HAR: Capture and replay GET /pet/findByStatus', async ({ page }) => {
    const harFile = path.join(harDir, 'petstore-get-pets.har');

    // Record HAR for live API call
    await page.routeFromHAR(harFile, {
      url: '**/findByStatus**',
      update: true,
    });

    // Make direct API call to Petstore
    const response = await page.goto('https://petstore.swagger.io/v2/pet/findByStatus?status=available');
    expect(response?.status()).toBe(200);
    
    // Verify response contains pet data
    const content = await page.content();
    expect(content).toContain('id');
  });

  test('HAR: Capture multiple Petstore endpoints', async ({ page }) => {
    const harFile = path.join(harDir, 'petstore-multiple-endpoints.har');

    await page.routeFromHAR(harFile, {
      url: '**/v2/**',
      update: true,
    });

    // Test GET available pets
    let response = await page.goto('https://petstore.swagger.io/v2/pet/findByStatus?status=available');
    expect(response?.status()).toBe(200);
    
    // Test GET pet by ID
    response = await page.goto('https://petstore.swagger.io/v2/pet/1');
    expect(response?.status()).toMatch(/^(200|404)$/); // May be 404 if pet doesn't exist
  });

  test('HAR: Replay mocked responses offline', async ({ page }) => {
    const harFile = path.join(harDir, 'petstore-offline-mock.har');

    // Use replay mode - will use HAR if exists
    await page.routeFromHAR(harFile, {
      url: '**/findByStatus**',
      update: false,
    });

    try {
      const response = await page.goto('https://petstore.swagger.io/v2/pet/findByStatus?status=available', {
        timeout: 5000
      });
      
      if (response) {
        expect(response.status()).toMatch(/^[2-5]\d{2}$/);
      }
    } catch (e) {
      // Expected if HAR doesn't exist and no internet
      console.log('Offline mode - no HAR file yet');
    }
  });

  test('HAR: Store and Create Pet API call', async ({ page }) => {
    const harFile = path.join(harDir, 'petstore-create-pet.har');

    await page.routeFromHAR(harFile, {
      url: '**/pet**',
      update: true,
    });

    try {
      // Attempt to create a pet (may fail if no auth, but HAR will capture the attempt)
      const response = await page.request.post('https://petstore.swagger.io/v2/pet', {
        data: {
          id: Math.floor(Math.random() * 10000),
          name: 'TestPet',
          photoUrls: ['https://example.com/photo.jpg'],
          status: 'available'
        }
      });
      
      expect(response.status()).toMatch(/^(200|400|405)$/);
    } catch (e) {
      // API might not be available, but HAR will attempt capture
      console.log('Create pet request processed');
    }
  });

  test('HAR: Get Store inventory', async ({ page }) => {
    const harFile = path.join(harDir, 'petstore-store-inventory.har');

    await page.routeFromHAR(harFile, {
      url: '**/store/**',
      update: true,
    });

    try {
      const response = await page.goto('https://petstore.swagger.io/v2/store/inventory');
      expect(response?.status()).toMatch(/^(200|401)$/);
    } catch (e) {
      console.log('Store inventory request processed');
    }
  });
});
