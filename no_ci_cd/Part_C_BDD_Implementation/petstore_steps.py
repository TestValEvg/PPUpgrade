"""
Part C: BDD Implementation with Behave
Python step definitions for Gherkin scenarios
Includes proper request handling, response validation, and error handling
"""

from behave import given, when, then, step
import requests
import json
from typing import Dict, List, Any
import time

# ============================================================================
# CONTEXT HELPERS
# ============================================================================

class APIContext:
    """Helper class to manage API state during test execution"""
    
    def __init__(self):
        self.base_url = "https://petstore.swagger.io/v2"
        self.response = None
        self.response_time = 0
        self.status_code = None
        self.pet_ids_to_cleanup = []
        self.headers = {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    
    def make_request(self, method, endpoint, data=None):
        """Make HTTP request and track timing"""
        url = f"{self.base_url}{endpoint}"
        start_time = time.time()
        
        try:
            if method.upper() == 'GET':
                self.response = requests.get(url, headers=self.headers)
            elif method.upper() == 'POST':
                self.response = requests.post(url, json=data, headers=self.headers)
            elif method.upper() == 'PUT':
                self.response = requests.put(url, json=data, headers=self.headers)
            elif method.upper() == 'DELETE':
                self.response = requests.delete(url, headers=self.headers)
            
            self.response_time = (time.time() - start_time) * 1000  # milliseconds
            self.status_code = self.response.status_code
        except Exception as e:
            print(f"Request failed: {e}")
            raise
    
    def cleanup_pets(self):
        """Delete all created pets"""
        for pet_id in self.pet_ids_to_cleanup:
            try:
                self.make_request('DELETE', f'/pet/{pet_id}')
            except Exception as e:
                print(f"Cleanup failed for pet {pet_id}: {e}")
    
    def get_json_response(self):
        """Safely get JSON response"""
        try:
            return self.response.json()
        except:
            return self.response.text


# ============================================================================
# CONTEXT INITIALIZATION
# ============================================================================

def before_scenario(context, scenario):
    """Initialize test context before each scenario"""
    context.api = APIContext()
    context.pet_data = {}
    context.created_pets = []


def after_scenario(context, scenario):
    """Cleanup after each scenario"""
    if hasattr(context, 'api'):
        context.api.cleanup_pets()


# ============================================================================
# GIVEN STEPS - Setup and Preconditions
# ============================================================================

@given('the Petstore API is available')
def step_api_available(context):
    """Verify API is available"""
    try:
        response = requests.get(f"{context.api.base_url}/pet/findByStatus", 
                               params={"status": "available"},
                               headers=context.api.headers,
                               timeout=10)
        assert response.status_code in [200, 400], "API not available"
        print(f"✓ API is available (status: {response.status_code})")
    except Exception as e:
        raise AssertionError(f"API not available: {e}")


@given('the base URL is "{base_url}"')
def step_set_base_url(context, base_url):
    """Set the base URL for API calls"""
    context.api.base_url = base_url
    print(f"✓ Base URL set to: {base_url}")


@given('I want to retrieve pets with status "{status}"')
def step_set_pet_status_query(context, status):
    """Store the status parameter for retrieval"""
    context.current_status = status
    print(f"✓ Status filter set to: {status}")


@given('a pet with ID {pet_id:d} exists')
def step_pet_exists(context, pet_id):
    """Create or assume a pet exists"""
    context.current_pet_id = pet_id
    # Try to get the pet, if it doesn't exist, create it
    context.api.make_request('GET', f'/pet/{pet_id}')
    
    if context.api.status_code == 404:
        # Pet doesn't exist, create it
        pet_data = {
            "id": pet_id,
            "name": "Test Pet",
            "status": "available",
            "photoUrls": ["https://example.com/photo.jpg"]
        }
        context.api.make_request('POST', '/pet', pet_data)
        assert context.api.status_code == 200, f"Failed to create pet: {context.api.status_code}"
        context.api.pet_ids_to_cleanup.append(pet_id)
    
    print(f"✓ Pet {pet_id} is ready for testing")


@given('a pet with ID {pet_id:d} exists with name "{pet_name}"')
def step_pet_exists_with_name(context, pet_id, pet_name):
    """Create or verify pet with specific name"""
    context.current_pet_id = pet_id
    
    pet_data = {
        "id": pet_id,
        "name": pet_name,
        "status": "available",
        "photoUrls": ["https://example.com/photo.jpg"]
    }
    
    context.api.make_request('POST', '/pet', pet_data)
    if context.api.status_code == 200:
        context.api.pet_ids_to_cleanup.append(pet_id)
    
    print(f"✓ Pet {pet_id} with name '{pet_name}' is ready")


@given('I have pet data')
def step_have_pet_data(context):
    """Parse pet data from table"""
    pet_data = {}
    for row in context.table:
        field = row['field']
        value = row['value']
        
        # Try to parse as JSON, else use as string
        try:
            pet_data[field] = json.loads(value)
        except:
            # Try to parse as number
            try:
                pet_data[field] = int(value)
            except:
                pet_data[field] = value
    
    context.pet_data = pet_data
    print(f"✓ Pet data loaded: {pet_data}")


@given('I have valid pet data')
def step_have_valid_pet_data(context):
    """Create valid pet data"""
    import random
    pet_id = random.randint(30000, 99999)
    
    context.pet_data = {
        "id": pet_id,
        "name": "Valid Test Pet",
        "status": "available",
        "photoUrls": ["https://example.com/photo.jpg"]
    }
    print(f"✓ Valid pet data created with ID: {pet_id}")


@given('I have new pet data')
def step_have_new_pet_data(context):
    """Create new pet data for lifecycle test"""
    import random
    pet_id = random.randint(40000, 99999)
    
    context.pet_data = {
        "id": pet_id,
        "name": "Lifecycle Test Pet",
        "status": "available",
        "photoUrls": ["https://example.com/photo.jpg"]
    }
    context.test_pet_id = pet_id
    print(f"✓ New pet data created with ID: {pet_id}")


@given('I have a new "{pet_type}" with status "{status}"')
def step_have_pet_with_type(context, pet_type, status):
    """Create pet data for specific type"""
    import random
    pet_id = random.randint(50000, 99999)
    
    context.pet_data = {
        "id": pet_id,
        "name": f"{pet_type} Pet",
        "status": status,
        "photoUrls": ["https://example.com/photo.jpg"]
    }
    context.current_pet_id = pet_id
    print(f"✓ Pet data created: {pet_type} with status {status}")


@given('I have incomplete pet data without "{fields}"')
def step_have_incomplete_pet_data(context, fields):
    """Create incomplete pet data (missing specific fields)"""
    missing_fields = [f.strip() for f in fields.split(',')]
    
    pet_data = {
        "id": 60000,
        "name": "Incomplete Pet",
        "status": "available",
        "photoUrls": ["https://example.com/photo.jpg"]
    }
    
    # Remove specified fields
    for field in missing_fields:
        pet_data.pop(field, None)
    
    context.pet_data = pet_data
    print(f"✓ Incomplete pet data created (missing: {fields})")


@given('I have the following pets to create')
def step_have_multiple_pets(context):
    """Parse multiple pets from table"""
    context.multiple_pets = []
    
    for row in context.table:
        pet = {
            "id": int(row['id']),
            "name": row['name'],
            "status": row['status'],
            "photoUrls": ["https://example.com/photo.jpg"]
        }
        context.multiple_pets.append(pet)
    
    print(f"✓ {len(context.multiple_pets)} pets loaded for creation")


@given('the following pet statuses exist')
def step_pet_statuses_exist(context):
    """Store pet statuses for querying"""
    context.pet_statuses = [row['status'] for row in context.table]
    print(f"✓ Pet statuses for testing: {context.pet_statuses}")


# ============================================================================
# WHEN STEPS - Actions
# ============================================================================

@when('I send a GET request to "{endpoint}"')
def step_send_get_request(context, endpoint):
    """Send GET request to endpoint"""
    context.api.make_request('GET', endpoint)
    print(f"✓ GET {endpoint} - Status: {context.api.status_code} (Response time: {context.api.response_time:.2f}ms)")


@when('I send a GET request to "{endpoint}" with status "{status}"')
def step_send_get_request_with_status(context, endpoint, status):
    """Send GET request with status parameter"""
    url = f"{context.api.base_url}{endpoint}"
    params = {"status": status}
    
    start_time = time.time()
    context.api.response = requests.get(url, params=params, headers=context.api.headers)
    context.api.response_time = (time.time() - start_time) * 1000
    context.api.status_code = context.api.response.status_code
    
    print(f"✓ GET {endpoint}?status={status} - Status: {context.api.status_code}")


@when('I send a POST request to "{endpoint}" with the pet data')
def step_send_post_request_with_pet(context, endpoint):
    """Send POST request with pet data"""
    context.api.make_request('POST', endpoint, context.pet_data)
    
    if context.api.status_code == 200:
        created_pet = context.api.get_json_response()
        context.api.pet_ids_to_cleanup.append(created_pet.get('id', context.pet_data['id']))
        context.last_created_pet = created_pet
    
    print(f"✓ POST {endpoint} - Status: {context.api.status_code}")


@when('I send a PUT request to "{endpoint}" with updated data')
def step_send_put_request(context, endpoint):
    """Send PUT request with updated data"""
    context.api.make_request('PUT', endpoint, context.pet_data)
    print(f"✓ PUT {endpoint} - Status: {context.api.status_code}")


@when('I send a DELETE request to "{endpoint}"')
def step_send_delete_request(context, endpoint):
    """Send DELETE request"""
    context.api.make_request('DELETE', endpoint)
    print(f"✓ DELETE {endpoint} - Status: {context.api.status_code}")


@when('I create the pet')
def step_create_pet(context):
    """Create a pet using pet_data"""
    context.api.make_request('POST', '/pet', context.pet_data)
    
    if context.api.status_code == 200:
        context.api.pet_ids_to_cleanup.append(context.pet_data['id'])
        context.last_created_pet = context.api.get_json_response()
    
    print(f"✓ Pet created - Status: {context.api.status_code}")


@when('I retrieve the pet')
def step_retrieve_pet(context):
    """Retrieve a pet"""
    pet_id = context.test_pet_id if hasattr(context, 'test_pet_id') else context.current_pet_id
    context.api.make_request('GET', f'/pet/{pet_id}')
    print(f"✓ Pet {pet_id} retrieved - Status: {context.api.status_code}")


@when('I update the pet with new name "{new_name}" and status "{new_status}"')
def step_update_pet_name_status(context, new_name, new_status):
    """Update pet with new name and status"""
    context.pet_data['name'] = new_name
    context.pet_data['status'] = new_status
    print(f"✓ Pet data updated: name='{new_name}', status='{new_status}'")


@when('I update the pet status to "{new_status}"')
def step_update_pet_status(context, new_status):
    """Update pet status"""
    context.pet_data['status'] = new_status
    context.api.make_request('PUT', '/pet', context.pet_data)
    print(f"✓ Pet status updated to: {new_status}")


@when('I delete the pet')
def step_delete_pet(context):
    """Delete a pet"""
    pet_id = context.test_pet_id if hasattr(context, 'test_pet_id') else context.current_pet_id
    context.api.make_request('DELETE', f'/pet/{pet_id}')
    print(f"✓ Pet {pet_id} deleted - Status: {context.api.status_code}")


@when('I create each pet')
def step_create_multiple_pets(context):
    """Create multiple pets"""
    context.created_pet_ids = []
    
    for pet in context.multiple_pets:
        context.api.make_request('POST', '/pet', pet)
        if context.api.status_code == 200:
            context.api.pet_ids_to_cleanup.append(pet['id'])
            context.created_pet_ids.append(pet['id'])
    
    print(f"✓ Created {len(context.created_pet_ids)} pets")


@when('I query pets for each status')
def step_query_pets_each_status(context):
    """Query pets for each status"""
    context.status_queries = {}
    
    for status in context.pet_statuses:
        context.api.make_request('GET', '/pet/findByStatus', data={"status": status})
        context.status_queries[status] = context.api.response
    
    print(f"✓ Queried {len(context.pet_statuses)} status values")


# ============================================================================
# THEN STEPS - Assertions
# ============================================================================

@then('the response code should be {status_code:d}')
def step_assert_status_code(context, status_code):
    """Assert response status code"""
    assert context.api.status_code == status_code, \
        f"Expected status {status_code}, got {context.api.status_code}"
    print(f"✓ Status code is {status_code}")


@then('the response code should be one of {codes}')
def step_assert_status_code_one_of(context, codes):
    """Assert response is one of multiple status codes"""
    valid_codes = [int(c.strip()) for c in codes.split(',')]
    assert context.api.status_code in valid_codes, \
        f"Status {context.api.status_code} not in {valid_codes}"
    print(f"✓ Status code is one of {valid_codes}")


@then('the response should contain a list of pets')
def step_assert_response_is_list(context):
    """Assert response is a list"""
    response = context.api.get_json_response()
    assert isinstance(response, list), f"Response is not a list: {type(response)}"
    print(f"✓ Response contains {len(response)} pets")


@then('each pet should have required fields: {fields}')
def step_assert_required_fields(context, fields):
    """Assert each pet has required fields"""
    required_fields = [f.strip() for f in fields.split(',')]
    response = context.api.get_json_response()
    
    for pet in response:
        for field in required_fields:
            assert field in pet, f"Missing required field: {field}"
    
    print(f"✓ All pets have required fields: {fields}")


@then('all pets should have status "{status}"')
def step_assert_all_pets_have_status(context, status):
    """Assert all pets have specific status"""
    response = context.api.get_json_response()
    
    for pet in response:
        assert pet.get('status') == status, \
            f"Pet {pet.get('id')} has status {pet.get('status')}, expected {status}"
    
    print(f"✓ All pets have status '{status}'")


@then('the response should contain the pet with name "{pet_name}"')
def step_assert_pet_name(context, pet_name):
    """Assert response contains specific pet name"""
    response = context.api.get_json_response()
    assert response.get('name') == pet_name, \
        f"Expected pet name '{pet_name}', got {response.get('name')}"
    print(f"✓ Pet name is '{pet_name}'")


@then('the response should contain the status "{status}"')
def step_assert_response_status(context, status):
    """Assert response contains specific status"""
    response = context.api.get_json_response()
    assert response.get('status') == status, \
        f"Expected status '{status}', got {response.get('status')}"
    print(f"✓ Response status is '{status}'")


@then('the created pet ID should be stored for cleanup')
def step_store_pet_for_cleanup(context):
    """Store created pet ID for cleanup"""
    if hasattr(context, 'last_created_pet'):
        pet_id = context.last_created_pet.get('id')
        context.api.pet_ids_to_cleanup.append(pet_id)
        print(f"✓ Pet {pet_id} stored for cleanup")


@then('the response time should be less than {ms:d} milliseconds')
def step_assert_response_time(context, ms):
    """Assert response time is within limit"""
    assert context.api.response_time < ms, \
        f"Response time {context.api.response_time:.2f}ms exceeds {ms}ms limit"
    print(f"✓ Response time {context.api.response_time:.2f}ms < {ms}ms")


@then('the response should contain an error message')
def step_assert_error_message(context):
    """Assert response contains error message"""
    response = context.api.get_json_response()
    assert 'message' in response or 'error' in response, \
        "Response missing error message"
    print(f"✓ Response contains error message")


@then('each pet should be created successfully with 200 response')
def step_assert_all_pets_created(context):
    """Assert all pets created successfully"""
    for pet_id in context.created_pet_ids:
        context.api.make_request('GET', f'/pet/{pet_id}')
        assert context.api.status_code == 200, f"Pet {pet_id} not found"
    print(f"✓ All {len(context.created_pet_ids)} pets created successfully")


@then('results should contain only pets with matching status')
def step_assert_status_filtering(context):
    """Assert query results contain only matching status"""
    for status, response in context.status_queries.items():
        pets = response.json()
        for pet in pets:
            assert pet.get('status') == status, \
                f"Pet has mismatched status: {pet.get('status')} != {status}"
    print(f"✓ All query results contain only matching status")
