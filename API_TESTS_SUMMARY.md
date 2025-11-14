# API Tests Summary

## Overview
The PPUpgrade project contains comprehensive API testing using HAR (HTTP Archive) files with Playwright. HAR files capture and replay HTTP traffic, enabling offline testing and API validation.

## API Test Files

### 1. **har.spec.ts** - Basic HAR Testing
Location: `PPUpgradeTests/Tests/har.spec.ts`

#### Test Cases:
1. **HAR: Capture and replay GET /pet/findByStatus**
   - Records HAR for live Petstore API call
   - Tests: `GET https://petstore.swagger.io/v2/pet/findByStatus?status=available`
   - Validates: HTTP 200 response with pet data

2. **HAR: Capture multiple Petstore endpoints**
   - Records multiple endpoint calls in single HAR file
   - Tests:
     - GET available pets by status
     - GET pet by specific ID
   - Validates: 200 responses and proper pet data

3. **HAR: Replay mocked responses offline**
   - Uses offline replay mode with HAR file
   - Tests: Petstore GET endpoints without live API
   - Validates: Mock data responses

4. **HAR: Store and Create Pet API call**
   - Records POST request to create new pet
   - Tests: `POST https://petstore.swagger.io/v2/pet`
   - Payload: Pet object with id, name, photoUrls, status
   - Validates: 200, 400, or 405 status responses

5. **HAR: Get Store inventory**
   - Records store inventory endpoint
   - Tests: `GET https://petstore.swagger.io/v2/store/inventory`
   - Validates: Store inventory data retrieval

### 2. **har-advanced.spec.ts** - Advanced API Testing
Location: `PPUpgradeTests/Tests/har-advanced.spec.ts`

#### Test Cases:
1. **HAR: Validate pet data structure from captured response**
   - Validates response schema contains required fields
   - Required fields: id, name, photoUrls, status
   - Endpoint: `GET /pet/findByStatus?status=available`

2. **HAR: Multiple API endpoints in sequence**
   - Tests sequential API calls (workflow testing)
   - Calls in order:
     1. GET available pets
     2. GET sold pets
     3. GET pending pets
   - Validates: All three requests return 200 status

3. **HAR: API error handling and status codes**
   - Tests both valid and invalid requests
   - Valid: `GET /pet/findByStatus?status=available` → 200
   - Invalid: `GET /pet/99999999999` → 404 or 200
   - Validates: Proper error handling

4. **HAR: Store and inventory API calls**
   - Tests store-related endpoints
   - Endpoint: `GET /store/inventory`
   - Handles: Auth requirements, timeouts
   - Expected responses: 200 or 401

## HAR Files Location
`PPUpgradeTests/har-files/`

### Captured HAR Files:
1. `petstore-get-pets.har` - Pet listing endpoints
2. `petstore-multiple-endpoints.har` - Multiple endpoints
3. `petstore-offline-mock.har` - Offline mock data
4. `petstore-create-pet.har` - Pet creation POST requests
5. `petstore-store-inventory.har` - Store inventory data
6. `petstore-pet-validation.har` - Pet data validation
7. `petstore-sequence-test.har` - Sequential API calls
8. `petstore-error-handling.har` - Error scenarios
9. `petstore-store-api.har` - Store API endpoints
10. `petstore-complete-flow.har` - Complete workflow
11. `petstore-performance.har` - Performance testing
12. `petstore-comparison-live.har` - Live vs recorded comparison

## Test API Base
**Petstore Swagger API**: `https://petstore.swagger.io/v2`

### Available Endpoints Tested:
- `GET /pet/findByStatus?status={status}` - Find pets by status
- `GET /pet/{petId}` - Get pet by ID
- `POST /pet` - Create new pet
- `GET /store/inventory` - Get store inventory

## Petstore API Response Example
```json
[
  {
    "id": 1,
    "name": "doggie",
    "photoUrls": [
      "url"
    ],
    "tags": [
      {
        "id": 0,
        "name": "string"
      }
    ],
    "status": "available"
  }
]
```

## Running the API Tests

### Run All API Tests:
```bash
npx playwright test har.spec.ts har-advanced.spec.ts
```

### Run Specific HAR Test:
```bash
npx playwright test har.spec.ts -g "Capture multiple Petstore endpoints"
```

### Generate HAR Files (Record Mode):
Update mode: `update: true` - Records new/updated HAR files
```typescript
await page.routeFromHAR(harFile, {
  url: '**/v2/**',
  update: true,
});
```

### Replay Mode (Offline):
Update mode: `update: false` - Uses existing HAR files offline
```typescript
await page.routeFromHAR(harFile, {
  url: '**/v2/**',
  update: false,
});
```

## Key Features

### 1. Network Traffic Recording
- Captures all HTTP requests and responses
- Stores in HAR (HTTP Archive) JSON format
- Enables offline testing

### 2. Request/Response Validation
- Status code assertions
- Response body validation
- Data structure verification

### 3. Sequential Testing
- Tests multiple API calls in sequence
- Validates workflow scenarios
- Captures complete transaction flows

### 4. Error Handling
- Tests valid requests (200 responses)
- Tests invalid requests (404, 400, 405)
- Validates error scenarios

### 5. Performance Testing
- Can measure response times
- Compare live vs replayed responses
- Identify performance issues

## Integration with Playwright
```typescript
import { page } from '@playwright/test';

// Record or replay HAR
await page.routeFromHAR(harFile, {
  url: '**/v2/**',
  update: true,  // Record new/update existing
});

// Make API calls
const response = await page.goto(url);
const apiResponse = await page.request.post(url, { data });
```

## Test Coverage Matrix

| Feature | har.spec.ts | har-advanced.spec.ts |
|---------|-------------|---------------------|
| GET Requests | ✓ | ✓ |
| POST Requests | ✓ | ✗ |
| Status Validation | ✓ | ✓ |
| Response Body Validation | ✓ | ✓ |
| Data Structure Validation | ✓ | ✓ |
| Sequential Calls | ✗ | ✓ |
| Error Handling | ✗ | ✓ |
| Offline Mode | ✓ | ✓ |
| Store API | ✓ | ✓ |

## Reports
- **HAR_TESTS_REPORT.md** - Comprehensive HAR testing documentation
- **HAR_TESTS_RESULTS.md** - Detailed test execution results

## Related Files
- **login.page.ts** - Page Object Model for authentication
- **Utilities/helpers.ts** - Test helper functions
- **Utilities/selectors.ts** - CSS/XPath selectors
- **Utilities/credentials.ts** - Test credentials

## Notes
- HAR files capture authentication tokens automatically
- Mock data can be used for CI/CD pipelines
- Supports both online (record) and offline (replay) modes
- All tests run with default Playwright configuration
