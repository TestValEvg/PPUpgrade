# Postman Setup Guide - Petstore API

## Step-by-Step: From Swagger to Tested API

### Prerequisites
- Postman Desktop Application installed
- Internet connection (for Petstore API)

---

## 📋 Part A: Importing the Swagger Collection

### Method 1: Direct Swagger Import (Recommended)

1. **Open Postman** → Click **Import**
   ![Step 1]

2. **Select Import Tab** → Click **Link**
   ```
   URL: https://petstore.swagger.io/v2/swagger.json
   ```

3. **Postman Auto-Generates**
   - Collection with all endpoints
   - Request templates
   - Parameter specifications
   - Response examples

### Method 2: Using Provided Collection

1. **Import JSON file**: `petstore-collection.json` (already provided)
   - File → Import → Select JSON file
   - Collection imports with pre-configured tests

---

## 🤖 Using Postbot for AI-Powered Tests

### Enabling Postbot (Postman Free/Pro)

1. **Open any Request** in collection
2. **Click Tests Tab**
3. **Look for Postbot Button** (AI icon with lightning)
4. **Click "Generate test script with Postbot"**

### Example Postbot Workflow

#### Request: GET /pet/findByStatus

```javascript
// Postbot generates this automatically:

// Test 1: Status Code Validation
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// Test 2: Response Type Validation
pm.test("Response is array", function () {
    pm.expect(pm.response.json()).to.be.an('array');
});

// Test 3: Schema Validation
pm.test("Pet objects have required fields", function () {
    const pets = pm.response.json();
    if (pets.length > 0) {
        const pet = pets[0];
        pm.expect(pet).to.have.property('id');
        pm.expect(pet).to.have.property('name');
        pm.expect(pet).to.have.property('status');
    }
});
```

### Postbot Prompt Examples

**Prompt 1: Comprehensive CRUD Testing**
```
Generate comprehensive tests to validate:
- Successful 200 response with correct schema
- Required fields: id, name, status, photoUrls
- Add negative test cases for missing required fields
- Include boundary value testing for numeric parameters
- Test all status values: available, pending, sold
```

**Prompt 2: Error Handling**
```
Add authentication tests and error handling:
- Generate error response tests for 401 Unauthorized
- Add tests for 403 Forbidden responses
- Include 404 Not Found validation
- Add tests for malformed JSON (400 Bad Request)
- Validate error message format
```

**Prompt 3: Data-Driven Testing**
```
Generate data-driven tests with multiple scenarios:
- Create 3 different pet types (Dog, Cat, Bird)
- Test each with different statuses (available, pending, sold)
- Validate photo URL arrays with 1-5 URLs
- Test boundary values for pet IDs (1, 999999, max int)
```

---

## 📊 Organizing Tests in Collections

### Recommended Structure

```
Petstore API Collection/
├── Store Operations
│   ├── Get Pet by Status
│   │   ├── Tests
│   │   ├── Pre-request Script
│   │   └── Examples
│   ├── Create New Pet
│   ├── Get Pet by ID
│   ├── Update Pet
│   └── Delete Pet
├── Error Scenarios
│   ├── Get Non-existent Pet (404)
│   ├── Missing Required Fields (400)
│   └── Invalid Parameters (400)
├── Boundary Values
│   ├── Min/Max ID values
│   └── Empty/Large arrays
└── Environments
    ├── Development
    ├── Staging
    └── Production
```

### Pre-request Script Example (Setup)

```javascript
// Set base URL
pm.environment.set("base_url", "https://petstore.swagger.io/v2");

// Generate unique pet ID
pm.environment.set("pet_id", Math.floor(Math.random() * 1000000));

// Set common headers
pm.request.headers.add({
    key: "Content-Type",
    value: "application/json"
});
```

### Test Script Example (Validation)

```javascript
// Validate response
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// Validate schema
pm.test("Response has required fields", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('id');
    pm.expect(jsonData).to.have.property('name');
    pm.expect(jsonData).to.have.property('status');
});

// Validate data types
pm.test("Data types are correct", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.id).to.be.a('number');
    pm.expect(jsonData.name).to.be.a('string');
    pm.expect(jsonData.photoUrls).to.be.an('array');
});

// Save data for next request
pm.environment.set("created_pet_id", jsonData.id);
```

---

## 🚀 Running Tests in Postman

### Collection Runner

1. **Click Collection** → **Run** button
2. **Configure Runner Settings**:
   - Select all requests (or specific folder)
   - Set iterations: 1 (for single run)
   - Select environment: Development
   - Delay between requests: 100ms (to avoid rate limiting)

3. **Click Run** → View Results
   - Green checkmarks = Passed tests
   - Red X = Failed tests
   - View detailed results for each request

### Expected Results

```
Running petstore-collection.json
└─ Store Operations
   ├─ GET /pet/findByStatus                    ✓ PASSED (5 tests)
   ├─ POST /pet                                ✓ PASSED (5 tests)
   ├─ GET /pet/{id}                            ✓ PASSED (4 tests)
   ├─ PUT /pet                                 ✓ PASSED (4 tests)
   └─ DELETE /pet/{id}                         ✓ PASSED (2 tests)
└─ Error Scenarios
   ├─ GET /pet/999999999 (404)                 ✓ PASSED (2 tests)
   └─ POST /pet with missing fields            ✓ PASSED (2 tests)
└─ Boundary Tests
   ├─ Create with min ID                       ✓ PASSED (2 tests)
   └─ Create with max ID                       ✓ PASSED (2 tests)

Total: 28 tests | Passed: 28 | Failed: 0
```

---

## 📤 Newman CLI - Automated Testing

### Installation

```bash
# Install globally
npm install -g newman

# Or install locally
npm install newman
```

### Basic Commands

```bash
# Run collection
newman run petstore-collection.json

# With environment
newman run petstore-collection.json -e dev-environment.json

# Multiple reporters
newman run petstore-collection.json \
  --reporters cli,json,html

# Export reports
newman run petstore-collection.json \
  --reporter-json-export results.json \
  --reporter-html-export report.html

# Set iterations
newman run petstore-collection.json --iteration-count 5

# Folder-specific
newman run petstore-collection.json -f "Store Operations"

# Timeout settings
newman run petstore-collection.json --timeout 10000
```

### Exporting from Postman

1. **Select Collection** (right-click)
2. **Export** → Choose format:
   - **OpenAPI 3.0**: For documentation
   - **Postman v2.1**: For use with Newman (Recommended)

3. **Save File** → Use with Newman

### CI/CD Integration

```bash
# GitHub Actions example
- name: Run API Tests with Newman
  run: |
    npm install -g newman
    newman run petstore-collection.json \
      -e ${{ secrets.POSTMAN_ENV }} \
      --reporters cli,html,json \
      --reporter-html-export test-report.html \
      --reporter-json-export test-results.json
```

---

## 🌍 Environment Variables

### Create Development Environment

1. **Click Environments** (left sidebar)
2. **Create New** environment: `dev-environment.json`

```json
{
  "id": "dev-env",
  "name": "Development",
  "values": [
    {
      "key": "base_url",
      "value": "https://petstore.swagger.io/v2",
      "enabled": true
    },
    {
      "key": "timeout",
      "value": "30000",
      "enabled": true
    },
    {
      "key": "pet_status",
      "value": "available",
      "enabled": true
    }
  ]
}
```

### Using Variables in Requests

```
GET {{base_url}}/pet/findByStatus?status={{pet_status}}

Headers:
- Content-Type: application/json

Body:
{
  "id": {{pet_id}},
  "name": "{{pet_name}}",
  "status": "{{pet_status}}"
}
```

---

## 📊 Monitoring and Scheduling

### Postman Monitoring (Cloud)

1. **Select Collection**
2. **Monitor Collection** (3-dot menu)
3. **Create Monitor** → Configure:
   - **Frequency**: Every 5 minutes, hourly, daily
   - **Region**: Select monitoring regions
   - **Alert threshold**: Fail after X consecutive failures

### Monitor Results

```
Monitoring Dashboard:
├─ Last Run: 5 minutes ago ✓
├─ Success Rate: 100%
├─ Average Response Time: 245ms
├─ Failed Runs: 0
└─ Alerts: None
```

---

## 🔍 Debugging Tips

### Enable Console Logging

```javascript
// In Pre-request Script or Tests tab
console.log("Request URL:", pm.request.url);
console.log("Request Headers:", pm.request.headers);
console.log("Response Status:", pm.response.code);
console.log("Response Body:", pm.response.json());
```

### View Logs

- **Console** icon (bottom-left corner)
- Shows all `console.log()` output
- Useful for debugging test logic

### Common Issues and Solutions

| Issue | Solution |
|-------|----------|
| 429 Too Many Requests | Increase delay between requests in Runner settings |
| 401 Unauthorized | Verify authentication headers/tokens in environment |
| Request timeout | Increase timeout value in Newman: `--timeout 60000` |
| Variable undefined | Check variable spelling and environment selection |

---

## ✅ Verification Checklist

- [ ] Postman desktop app installed
- [ ] Swagger collection imported
- [ ] Postbot tests generated for at least 3 endpoints
- [ ] Collection Runner executed successfully
- [ ] Tests passed without errors
- [ ] Newman CLI installed
- [ ] Collection exported successfully
- [ ] Newman run completed with HTML report
- [ ] Environment variables configured
- [ ] Monitoring alert configured (optional)

---

## 📚 Reference

### API Endpoints Covered

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | /pet/findByStatus | Get pets by status |
| POST | /pet | Create new pet |
| GET | /pet/{petId} | Get pet by ID |
| PUT | /pet | Update pet |
| DELETE | /pet/{petId} | Delete pet |

### Test Types Implemented

- ✅ Positive tests (happy path)
- ✅ Negative tests (error scenarios)
- ✅ Boundary value tests
- ✅ Data-driven tests
- ✅ Schema validation
- ✅ Status code validation
- ✅ Response time validation

---

**Status**: ✓ Ready for Part A Completion

Next: Move to Part B for framework migration to Pytest/Jest
