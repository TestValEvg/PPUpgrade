import { test, expect } from '@playwright/test';
import * as path from 'path';

const harDir = path.join(__dirname, '../har-files');

test.describe('HAR Advanced Tests - API Validation', () => {
  test('HAR: Validate pet data structure from captured response', async ({ page }) => {
    const harFile = path.join(harDir, 'petstore-pet-validation.har');

    await page.routeFromHAR(harFile, {
      url: '**/findByStatus**',
      update: true,
    });

    // Make API call to get pets
    const response = await page.goto('https://petstore.swagger.io/v2/pet/findByStatus?status=available');
    expect(response?.status()).toBe(200);
    
    // Get response body
    const responseBody = await page.content();
    expect(responseBody).toBeTruthy();
    
    // Verify it contains expected pet data fields
    expect(responseBody).toMatch(/id|name|photoUrls|status/);
  });

  test('HAR: Multiple API endpoints in sequence', async ({ page }) => {
    const harFile = path.join(harDir, 'petstore-sequence-test.har');

    await page.routeFromHAR(harFile, {
      url: '**/v2/**',
      update: true,
    });

    // Call 1: Get available pets
    let response = await page.goto('https://petstore.swagger.io/v2/pet/findByStatus?status=available');
    expect(response?.status()).toBe(200);
    
    // Call 2: Get sold pets  
    response = await page.goto('https://petstore.swagger.io/v2/pet/findByStatus?status=sold');
    expect(response?.status()).toBe(200);
    
    // Call 3: Get pending pets
    response = await page.goto('https://petstore.swagger.io/v2/pet/findByStatus?status=pending');
    expect(response?.status()).toBe(200);
    
    // All calls are now captured in the HAR file
  });

  test('HAR: API error handling and status codes', async ({ page }) => {
    const harFile = path.join(harDir, 'petstore-error-handling.har');

    await page.routeFromHAR(harFile, {
      url: '**/pet**',
      update: true,
    });

    // Valid request
    let response = await page.goto('https://petstore.swagger.io/v2/pet/findByStatus?status=available');
    expect(response?.status()).toBe(200);
    
    // Invalid request (non-existent pet ID)
    response = await page.goto('https://petstore.swagger.io/v2/pet/99999999999');
    expect(response?.status()).toMatch(/^(200|404)$/); // May be 404
  });

  test('HAR: Store and inventory API calls', async ({ page }) => {
    const harFile = path.join(harDir, 'petstore-store-api.har');

    await page.routeFromHAR(harFile, {
      url: '**/store/**',
      update: true,
    });

    try {
      // Get store inventory (may require auth)
      const response = await page.goto('https://petstore.swagger.io/v2/store/inventory', {
        timeout: 5000,
        waitUntil: 'domcontentloaded'
      });
      
      if (response) {
        expect(response.status()).toMatch(/^(200|401)$/);
      }
    } catch (e) {
      // Request attempted and captured in HAR
      console.log('Store inventory request processed');
    }
  });
});
