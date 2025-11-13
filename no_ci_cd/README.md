# 🚀 AI-Powered API Test Generation and Framework Setup

## Complete Homework Guide

This comprehensive guide covers all parts of the AI-Enhanced API Test Automation course using the Petstore API (https://petstore.swagger.io/).

---

## 📋 Table of Contents

1. [Part A: Postman & Postbot](#part-a-postman--postbot)
2. [Part B: Framework Migration](#part-b-framework-migration)
3. [Part C: BDD Implementation](#part-c-bdd-implementation)
4. [Part D: Advanced AI Prompts](#part-d-advanced-ai-prompts)
5. [Quick Reference](#quick-reference)
6. [AI Workflow Cheat Sheet](#ai-workflow-cheat-sheet)

---

## Part A: Postman & Postbot

### 🎯 Objective
Learn to rapidly create API tests using AI assistance (Postbot) directly from API documentation.

### 📁 Files in this Section
- `petstore-collection.json` - Complete Postman collection with AI-generated tests

### Step-by-Step Workflow

#### Step 1: Import API Documentation
1. Open **Postman Desktop Application**
2. Click **Import** → **Link**
3. Paste URL: `https://petstore.swagger.io/v2/swagger.json`
4. Postman auto-generates collection with all endpoints

#### Step 2: Generate Tests with Postbot
1. Select any request in the collection
2. Click **Tests** tab
3. Click **"Generate test script with Postbot"**
4. AI generates comprehensive test scripts

#### Step 3: Suggested Postbot Prompts

```
Prompt 1 (Basic Coverage):
"Generate comprehensive tests to validate:
- Successful 200 response with correct schema
- Required fields: id, name, status, photoUrls
- Add negative test cases for missing required fields
- Include boundary value testing for numeric parameters"

Prompt 2 (Advanced Coverage):
"Add authentication tests and error handling:
- Error handling for 401/403 responses
- Generate data-driven tests with multiple user scenarios
- Include edge case testing for empty arrays and null values"
```

#### Step 4: Organize Tests by Collections
```
Petstore Collection/
├── Store Operations/
│   ├── Get Pet by Status (with AI tests)
│   ├── Create New Pet (with AI tests)
│   ├── Get Pet by ID (with AI tests)
│   ├── Update Pet (with AI tests)
│   └── Delete Pet (with AI tests)
├── Negative Test Cases/
│   ├── Get Non-existent Pet (404)
│   ├── Invalid Status Parameter
│   └── Missing Required Fields
└── Boundary Value Tests/
    ├── Boundary ID Values
    └── Valid Status Values
```

#### Step 5: Run Collection with Newman CLI
```bash
# Export collection from Postman
# File → Export → Select collection → JSON format

# Install Newman (Postman CLI)
npm install -g newman

# Run collection
newman run petstore-collection.json -e dev-environment.json --reporters cli,html

# Output reports
newman run petstore-collection.json \
  --reporters cli,json,html \
  --reporter-json-export results.json \
  --reporter-html-export report.html
```

### 📊 Postman Features Used
- **Collections & Environments**: Organize requests by endpoint groups
- **Pre-request Scripts**: Set up test data and environment variables
- **Test Scripts**: Validate responses with assertions
- **Collection Runner**: Execute multiple requests with iterations
- **Newman CLI**: Run tests in CI/CD pipelines
- **Data-Driven Testing**: CSV/JSON data file support
- **Monitoring**: Schedule automated test runs

### ✅ Part A Success Criteria
- ✓ Collection imported from Swagger/OpenAPI
- ✓ Tests generated using Postbot for CRUD operations
- ✓ Response validation implemented
- ✓ Negative test cases included
- ✓ Collection runs successfully in Newman
- ✓ HTML reports generated

---

## Part B: Framework Migration

### 🎯 Objective
Use GitHub Copilot to migrate tests between different frameworks and programming languages.

### 📁 Files in this Section
- `petstore_pytest_tests.py` - Pytest implementation with requests library
- `petstore_jest_tests.js` - JavaScript Jest implementation with Supertest

### Framework Migration Examples

#### Migration 1: Postman → Pytest

**Original Postman Test Script (JavaScript):**
```javascript
pm.test('Status code is 200', function () {
    pm.response.to.have.status(200);
});
pm.test('Response contains pets', function () {
    pm.expect(pm.response.json()).to.be.an('array');
});
```

**Migrated Pytest Version:**
```python
def test_get_pets_returns_200_with_array(session, base_url):
    """Migrated from Postman test script"""
    response = session.get(f"{base_url}/pet/findByStatus", params={"status": "available"})
    
    assert response.status_code == 200
    assert isinstance(response.json(), list)
```

#### Migration 2: Postman → Jest/Supertest

**Migrated Jest Version:**
```javascript
test('Get pets returns 200 with array', async () => {
    const response = await request(BASE_URL)
        .get('/pet/findByStatus')
        .query({ status: 'available' })
        .expect(200);
    
    expect(Array.isArray(response.body)).toBe(true);
});
```

### 🤖 AI Prompts for Migration

```
PROMPT 1 - Postman to Pytest:
"Convert this Postman collection to pytest functions using requests library.
Include:
- Proper fixtures for authentication and environment setup
- Session management and cleanup
- Data-driven testing with parameterization
- Comprehensive assertions
- Error handling and logging"

PROMPT 2 - Postman to Jest:
"Rewrite these Postman tests as Jest test suites using supertest.
Include:
- Async/await patterns
- Proper error handling
- Data-driven tests with test.each()
- Performance assertions
- Cleanup hooks (beforeAll, afterAll)"

PROMPT 3 - Cross-Language:
"Convert this Python pytest API test suite to Java RestAssured.
Include:
- Proper annotations (@Test, @BeforeClass)
- Maven structure and dependencies
- Fluent API assertions
- Data providers for parameterized tests
- Report generation"
```

### ✅ Part B Success Criteria
- ✓ Postman tests converted to Pytest
- ✓ Pytest tests converted to Jest/Supertest
- ✓ Fixtures and setup properly implemented
- ✓ Data-driven tests included in both frameworks
- ✓ Tests run successfully in both frameworks
- ✓ Results verified for consistency

---

## Part C: BDD Implementation

### 🎯 Objective
Implement BDD with Gherkin scenarios that non-technical stakeholders can understand.

### 📁 Files in this Section
- `petstore_api.feature` - Comprehensive Gherkin feature files
- `petstore_steps.py` - Python Behave step definitions

### BDD Feature File Structure

```gherkin
Feature: Petstore API - Pet Management CRUD Operations

  Background:
    Given the Petstore API is available
    And the base URL is "https://petstore.swagger.io/v2"

  Scenario: Get available pets successfully
    Given I want to retrieve pets with status "available"
    When I send a GET request to "/pet/findByStatus"
    Then the response code should be 200
    And the response should contain a list of pets
    And each pet should have required fields: id, name, status, photoUrls
```

### Running Behave Tests

```bash
# Install behave and dependencies
pip install behave requests

# Run all feature tests
behave

# Run specific feature file
behave no_ci_cd/Part_C_BDD_Implementation/petstore_api.feature

# Run with specific tags
behave -t @smoke

# Generate HTML report
behave -f html -o reports/behave_report.html
```

### 🤖 AI Prompt for Step Definitions

```
PROMPT:
"Generate Python behave step definitions for these Gherkin scenarios:
- Include proper request handling with requests library
- Add comprehensive response validation
- Implement data table handling for parameterized tests
- Include proper error handling and logging
- Add cleanup hooks for test data
- Support both positive and negative test paths

Scenarios to cover:
1. CRUD operations (Create, Read, Update, Delete)
2. Error responses (404, 400, 401)
3. Data validation and schema checking
4. Boundary value testing
5. Concurrent operations"
```

### ✅ Part C Success Criteria
- ✓ Feature files written in Gherkin syntax
- ✓ Readable by non-technical stakeholders
- ✓ Step definitions implemented in Python Behave
- ✓ All scenarios execute successfully
- ✓ Test reports generated
- ✓ Background setup included

---

## Part D: Advanced AI Prompts

### 🎯 Objective
Master advanced AI prompts for gap analysis, performance testing, and maintenance automation.

### 📁 Files in this Section
- `advanced_tests.py` - Implementation examples for all 4 advanced topics

### Topic 1: Test Gap Analysis

**AI Prompt:**
```
"Analyze this OpenAPI specification and existing test suite.
Identify missing test coverage and generate additional test cases for:
1. Edge cases (empty responses, large datasets, pagination)
2. Error scenarios (401, 403, 429, 500, 503)
3. Security testing (SQL injection, XSS, CSRF)
4. Concurrent request handling
5. Response header validation
6. API versioning scenarios"
```

**Gaps Identified:**
- ❌ Authentication/Authorization tests
- ❌ Response header validation
- ❌ Large dataset handling
- ❌ Concurrent request handling
- ❌ State management and idempotency

**Generated Tests:**
```python
class TestResponseHeaderValidation:
    """Fills gap: Response header validation"""
    
    def test_response_content_type_header(self, api_url):
        response = requests.get(f"{api_url}/pet/findByStatus", params={"status": "available"})
        assert "application/json" in response.headers.get("Content-Type", "")

class TestConcurrentRequestHandling:
    """Fills gap: Concurrent request handling"""
    
    def test_concurrent_get_requests(self):
        with ThreadPoolExecutor(max_workers=5) as executor:
            futures = [executor.submit(make_request) for _ in range(10)]
            results = [f.result() for f in futures]
        
        assert all(code == 200 for code in results)
```

### Topic 2: Performance Test Generation

**AI Prompt:**
```
"Convert these functional API tests into performance tests using locust framework.
Include:
1. Load testing with gradually increasing users (1, 5, 10, 50 users)
2. Stress testing to find breaking points
3. Response time assertions (< 1s for GET, < 3s for POST)
4. Error rate monitoring (< 5% acceptable)
5. Generate CSV reports for analysis"
```

**Performance Assertions:**
```python
def test_get_endpoint_performance_multiple_runs(self):
    """Performance test with multiple iterations"""
    response_times = []
    
    for _ in range(20):
        start = time.time()
        response = requests.get(f"{api_url}/pet/findByStatus", params={"status": "available"})
        response_time = (time.time() - start) * 1000
        response_times.append(response_time)
    
    # Performance assertions
    avg_time = statistics.mean(response_times)
    assert avg_time < 1000, f"Average response time exceeds 1s"
```

### Topic 3: Test Data Factory

**AI Prompt:**
```
"Create a dynamic test data factory that generates realistic test data.
Include:
1. Generate valid pet objects with random but realistic data
2. Support data templates for different pet types
3. Generate data for edge cases (empty strings, max values)
4. Provide fluent builder interface
5. Support data cleanup and isolation strategies"
```

**Factory Implementation:**
```python
class PetDataFactory:
    """Factory for generating realistic test data"""
    
    def create_pet(self, name=None, status=None, pet_type=None) -> dict:
        pet_id = self.generate_pet_id()
        return {
            "id": pet_id,
            "name": name or self.generate_pet_name(pet_type),
            "status": status or random.choice(self.PET_STATUSES),
            "photoUrls": self.generate_photo_urls()
        }
    
    def create_pets_batch(self, count: int = 5) -> List[dict]:
        return [self.create_pet() for _ in range(count)]
```

### Topic 4: Maintenance Automation

**AI Prompt:**
```
"Analyze these failing API tests and suggest fixes based on API changes:

Breaking Changes in v2:
- DELETE now returns 204 instead of 200
- Create returns 200 OK instead of 201 Created
- 'photoUrl' field renamed to 'photoUrls'
- Error field renamed from 'error' to 'message'

Generate:
1. Automated migration scripts
2. Version compatibility layer
3. Deprecation warnings
4. New endpoint tests (GET /pet/findByTags)"
```

**Migration Automation:**
```python
class APIVersionMigration:
    """Handle API version migrations automatically"""
    
    @staticmethod
    def get_expected_delete_status_code(api_version: str = "v2") -> int:
        if api_version == "v1":
            return 200
        return 204  # v2+
    
    @staticmethod
    def transform_pet_data_for_version(pet_data: dict, target_version: str = "v2") -> dict:
        transformed = pet_data.copy()
        if target_version == "v1":
            # Convert for backward compatibility
            if "photoUrls" in transformed:
                transformed["photoUrl"] = transformed.pop("photoUrls")[0]
        return transformed
```

### ✅ Part D Success Criteria
- ✓ Test gap analysis completed
- ✓ Performance tests implemented
- ✓ Test data factory created
- ✓ Maintenance automation scripts written
- ✓ All examples run successfully

---

## Quick Reference

### Running Tests by Part

```bash
# Part A: Postman Collection
newman run petstore-collection.json --reporters cli,html

# Part B: Pytest
pytest no_ci_cd/Part_B_Framework_Migration/petstore_pytest_tests.py -v

# Part B: Jest
npm test petstore_jest_tests.js

# Part C: Behave
behave no_ci_cd/Part_C_BDD_Implementation/

# Part D: Pytest
pytest no_ci_cd/Part_D_Advanced_AI/advanced_tests.py -v -m performance
```

### File Locations

```
no_ci_cd/
├── Part_A_Postman_Postbot/
│   └── petstore-collection.json
├── Part_B_Framework_Migration/
│   ├── petstore_pytest_tests.py
│   └── petstore_jest_tests.js
├── Part_C_BDD_Implementation/
│   ├── petstore_api.feature
│   └── petstore_steps.py
├── Part_D_Advanced_AI/
│   └── advanced_tests.py
└── README.md (this file)
```

---

## AI Workflow Cheat Sheet

### ✨ Quick Generation Prompts

#### Test Creation
```
PROMPT:
"Generate API tests for all CRUD operations on /pet endpoint with:
- Status code validation
- Required field checks
- Response schema validation
- Data-driven test cases
- Negative test scenarios"
```

#### Data Variation
```
PROMPT:
"Create parameterized tests covering:
- Boundary values (min, max, zero)
- Edge cases (empty strings, null values)
- Invalid inputs (wrong types, format)
- Special characters in strings
- Maximum array sizes"
```

#### Error Scenarios
```
PROMPT:
"Add comprehensive error handling tests for:
- All 4xx responses (400, 401, 403, 404, 429)
- All 5xx responses (500, 502, 503)
- Network timeouts
- Malformed JSON
- Missing authentication headers"
```

### 🔧 Maintenance Prompts

#### Refactoring
```
PROMPT:
"Refactor this test suite for:
- Better maintainability (DRY principle)
- Reusable test utilities
- Shared fixtures and setup
- Consistent naming conventions
- Reduced code duplication"
```

#### Documentation
```
PROMPT:
"Generate comprehensive test documentation including:
- Test scenarios and objectives
- Expected outcomes for each test
- Setup and teardown procedures
- Data requirements
- Known limitations or edge cases"
```

#### Migration
```
PROMPT:
"Update these tests for new API version, handling:
- Breaking changes (parameter names, response codes)
- New endpoints
- Deprecated features
- Backward compatibility
- Version-specific assertions"
```

---

## 📊 Success Metrics

### Completion Checklist

- [ ] Part A: Postman collection created with AI-generated tests
- [ ] Part A: Newman CLI integration working
- [ ] Part B: Tests converted to Pytest successfully
- [ ] Part B: Tests converted to Jest successfully
- [ ] Part C: Gherkin feature files written
- [ ] Part C: Behave step definitions implemented
- [ ] Part C: All scenarios execute successfully
- [ ] Part D: Gap analysis tests implemented
- [ ] Part D: Performance tests created
- [ ] Part D: Test data factory working
- [ ] Part D: Maintenance automation examples provided

### Performance Goals

- ✅ Reduce test creation time by 70% (with AI assistance)
- ✅ Achieve 90%+ API endpoint coverage
- ✅ Establish maintainable test framework structure
- ✅ Enable non-technical understanding via BDD
- ✅ Automate test maintenance and updates

---

## 🎓 Learning Outcomes

After completing all 4 parts, you will understand:

1. **Postman & Postbot**: Rapid API test generation with AI
2. **Framework Migration**: Converting tests between languages/frameworks
3. **BDD Implementation**: Writing business-readable test scenarios
4. **Advanced Automation**: Gap analysis, performance, data factories, maintenance
5. **AI Integration**: Effective prompting for test automation tasks
6. **Best Practices**: Professional test framework structure

---

## 📚 Additional Resources

### Tools & Frameworks
- **Postman**: https://www.postman.com/
- **Newman**: https://learning.postman.com/docs/running-collections/using-newman-cli/
- **Pytest**: https://pytest.org/
- **Jest**: https://jestjs.io/
- **Behave**: https://behave.readthedocs.io/
- **GitHub Copilot**: https://github.com/features/copilot

### API Testing Concepts
- OpenAPI/Swagger Documentation
- REST API Principles
- HTTP Status Codes
- JSON Schema Validation
- Test Data Management

### Related Homework
- Part A: Postman & Postbot (Quick Test Generation)
- Part B: Framework Migration (Cross-Language Testing)
- Part C: BDD Implementation (Business-Driven Testing)
- Part D: Advanced AI Prompts (Test Automation Mastery)

---

## ✅ Homework Submission

All test files and documentation are organized in the `no_ci_cd/` folder:
- Ready for review and demonstration
- Can be executed locally for validation
- Includes examples for all 4 parts
- Contains comprehensive documentation

**Status: ✓ Complete and Ready for Submission**

---

Generated: November 13, 2025
Course: AI-Powered API Test Generation and Framework Setup
Instructor Materials: Complete test implementations with AI integration examples
