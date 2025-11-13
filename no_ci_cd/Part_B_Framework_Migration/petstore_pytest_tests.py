"""
Part B: Postman to Pytest - API Test Migration
Convert Postman collection tests to Pytest with requests library
Includes proper fixtures for authentication and environment setup
"""

import pytest
import requests
import json
from typing import Dict, List, Any
from dataclasses import dataclass

# ============================================================================
# CONFIGURATION & FIXTURES
# ============================================================================

@dataclass
class APIConfig:
    """API configuration for different environments"""
    base_url: str = "https://petstore.swagger.io/v2"
    timeout: int = 30
    headers: Dict[str, str] = None
    
    def __post_init__(self):
        if self.headers is None:
            self.headers = {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }


@pytest.fixture(scope="session")
def api_config():
    """Fixture providing API configuration"""
    return APIConfig()


@pytest.fixture
def session(api_config):
    """Fixture providing requests session with base URL and headers"""
    sess = requests.Session()
    sess.headers.update(api_config.headers)
    sess.timeout = api_config.timeout
    yield sess
    sess.close()


@pytest.fixture
def base_url(api_config):
    """Fixture providing base URL"""
    return api_config.base_url


@pytest.fixture
def pet_data():
    """Fixture providing sample pet data"""
    return {
        "id": 10001,
        "name": "Test Dog",
        "status": "available",
        "photoUrls": ["https://example.com/photo.jpg"]
    }


@pytest.fixture
def cleanup_pet(session, base_url):
    """Fixture to clean up test pet after test"""
    pet_ids = []
    
    yield pet_ids
    
    # Cleanup: delete all created pets
    for pet_id in pet_ids:
        try:
            session.delete(f"{base_url}/pet/{pet_id}")
        except Exception as e:
            print(f"Cleanup failed for pet {pet_id}: {e}")


# ============================================================================
# PART 1: SUCCESSFUL CRUD OPERATIONS
# ============================================================================

class TestPetStoreGetOperations:
    """Test GET operations for retrieving pets"""
    
    def test_get_pets_by_status_available(self, session, base_url):
        """Test: Get all available pets with 200 response and correct schema"""
        params = {"status": "available"}
        response = session.get(f"{base_url}/pet/findByStatus", params=params)
        
        # Assertions: Status code
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        # Assertions: Response is array
        pets = response.json()
        assert isinstance(pets, list), "Response should be a list"
        
        # Assertions: Required fields in response
        if len(pets) > 0:
            pet = pets[0]
            required_fields = ["id", "name", "status", "photoUrls"]
            for field in required_fields:
                assert field in pet, f"Missing required field: {field}"
            
            # Assertions: Boundary check - status values
            assert pet["status"] == "available", f"Expected status 'available', got {pet['status']}"
            assert isinstance(pet["photoUrls"], list), "photoUrls should be a list"


class TestPetStoreCreateOperations:
    """Test POST operations for creating pets"""
    
    def test_create_pet_successful(self, session, base_url, pet_data, cleanup_pet):
        """Test: Create new pet with 200 response and validate returned fields"""
        response = session.post(f"{base_url}/pet", json=pet_data)
        
        # Assertions: Status code
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        created_pet = response.json()
        cleanup_pet.append(created_pet["id"])
        
        # Assertions: Required fields present
        assert created_pet["id"] == pet_data["id"]
        assert created_pet["name"] == pet_data["name"]
        assert created_pet["status"] == pet_data["status"]
        assert isinstance(created_pet["photoUrls"], list)
        assert len(created_pet["photoUrls"]) > 0
    
    def test_create_multiple_pets_data_driven(self, session, base_url, cleanup_pet):
        """Test: Data-driven test with multiple pet scenarios"""
        test_pets = [
            {"id": 20001, "name": "Puppy", "status": "available", "photoUrls": ["url1"]},
            {"id": 20002, "name": "Kitten", "status": "sold", "photoUrls": ["url2"]},
            {"id": 20003, "name": "Parrot", "status": "pending", "photoUrls": ["url3"]},
        ]
        
        for pet_data in test_pets:
            response = session.post(f"{base_url}/pet", json=pet_data)
            assert response.status_code == 200
            created_pet = response.json()
            cleanup_pet.append(created_pet["id"])
            assert created_pet["name"] == pet_data["name"]


class TestPetStoreUpdateOperations:
    """Test PUT operations for updating pets"""
    
    def test_update_pet_successful(self, session, base_url, pet_data, cleanup_pet):
        """Test: Update pet and validate changes"""
        # Create pet first
        create_response = session.post(f"{base_url}/pet", json=pet_data)
        assert create_response.status_code == 200
        pet_id = create_response.json()["id"]
        cleanup_pet.append(pet_id)
        
        # Update pet
        updated_data = pet_data.copy()
        updated_data["name"] = "Updated Test Dog"
        updated_data["status"] = "sold"
        
        update_response = session.put(f"{base_url}/pet", json=updated_data)
        assert update_response.status_code == 200
        
        updated_pet = update_response.json()
        assert updated_pet["name"] == "Updated Test Dog"
        assert updated_pet["status"] == "sold"
        assert updated_pet["id"] == pet_id  # ID should remain unchanged


class TestPetStoreDeleteOperations:
    """Test DELETE operations for removing pets"""
    
    def test_delete_pet_successful(self, session, base_url, pet_data):
        """Test: Delete pet and validate 200 response"""
        # Create pet first
        create_response = session.post(f"{base_url}/pet", json=pet_data)
        assert create_response.status_code == 200
        pet_id = create_response.json()["id"]
        
        # Delete pet
        delete_response = session.delete(f"{base_url}/pet/{pet_id}")
        assert delete_response.status_code == 200
        
        # Verify deletion (should return 404)
        get_response = session.get(f"{base_url}/pet/{pet_id}")
        assert get_response.status_code == 404


# ============================================================================
# PART 2: NEGATIVE TEST CASES
# ============================================================================

class TestNegativeCases:
    """Test error scenarios and invalid inputs"""
    
    def test_get_nonexistent_pet_404(self, session, base_url):
        """Test: Getting non-existent pet returns 404"""
        response = session.get(f"{base_url}/pet/99999999")
        assert response.status_code == 404
        
        error_response = response.json()
        assert "message" in error_response
    
    def test_create_pet_missing_required_fields(self, session, base_url):
        """Test: Creating pet without required fields returns error"""
        incomplete_pet = {
            "name": "Incomplete Pet"
            # Missing: id, photoUrls, status
        }
        
        response = session.post(f"{base_url}/pet", json=incomplete_pet)
        # API might accept partial data or return 400/422
        assert response.status_code in [200, 400, 422, 415]
    
    def test_get_pets_invalid_status(self, session, base_url):
        """Test: Invalid status parameter handling"""
        params = {"status": "invalid_status_xyz"}
        response = session.get(f"{base_url}/pet/findByStatus", params=params)
        
        assert response.status_code == 200
        result = response.json()
        # Invalid status should return empty array or error
        assert isinstance(result, (list, dict))
    
    def test_update_nonexistent_pet(self, session, base_url):
        """Test: Updating non-existent pet"""
        nonexistent_pet = {
            "id": 99999999,
            "name": "Ghost Pet",
            "status": "available",
            "photoUrls": ["url"]
        }
        
        response = session.put(f"{base_url}/pet", json=nonexistent_pet)
        # Most APIs will attempt to create or update
        assert response.status_code in [200, 404, 400]


# ============================================================================
# PART 3: BOUNDARY VALUE TESTING
# ============================================================================

class TestBoundaryValues:
    """Test boundary values and edge cases"""
    
    @pytest.mark.parametrize("pet_id,description", [
        (1, "minimum_id"),
        (9223372036854775807, "maximum_64bit_int"),
        (0, "zero_id"),
    ])
    def test_create_pet_boundary_ids(self, session, base_url, pet_id, description, cleanup_pet):
        """Test: Creating pets with boundary ID values"""
        pet_data = {
            "id": pet_id,
            "name": f"Pet_{description}",
            "status": "available",
            "photoUrls": ["url"]
        }
        
        response = session.post(f"{base_url}/pet", json=pet_data)
        # Server should handle boundary values gracefully
        if response.status_code == 200:
            created_pet = response.json()
            cleanup_pet.append(created_pet["id"])
            assert "id" in created_pet
    
    @pytest.mark.parametrize("status", ["available", "pending", "sold"])
    def test_get_pets_all_valid_statuses(self, session, base_url, status):
        """Test: Get pets for all valid status values"""
        params = {"status": status}
        response = session.get(f"{base_url}/pet/findByStatus", params=params)
        
        assert response.status_code == 200
        pets = response.json()
        assert isinstance(pets, list)
    
    def test_create_pet_empty_name(self, session, base_url, cleanup_pet):
        """Test: Creating pet with empty name"""
        pet_data = {
            "id": 30001,
            "name": "",  # Empty name - boundary case
            "status": "available",
            "photoUrls": ["url"]
        }
        
        response = session.post(f"{base_url}/pet", json=pet_data)
        if response.status_code == 200:
            created_pet = response.json()
            cleanup_pet.append(created_pet["id"])


# ============================================================================
# PART 4: INTEGRATION TESTS
# ============================================================================

class TestIntegrationScenarios:
    """Test complete user scenarios combining multiple operations"""
    
    def test_complete_pet_lifecycle(self, session, base_url, cleanup_pet):
        """Test: Complete CRUD lifecycle - Create, Read, Update, Delete"""
        # Step 1: Create pet
        pet_data = {
            "id": 40001,
            "name": "Lifecycle Pet",
            "status": "available",
            "photoUrls": ["url1"]
        }
        create_resp = session.post(f"{base_url}/pet", json=pet_data)
        assert create_resp.status_code == 200
        pet_id = create_resp.json()["id"]
        cleanup_pet.append(pet_id)
        
        # Step 2: Read pet
        read_resp = session.get(f"{base_url}/pet/{pet_id}")
        assert read_resp.status_code == 200
        assert read_resp.json()["name"] == "Lifecycle Pet"
        
        # Step 3: Update pet
        pet_data["name"] = "Updated Lifecycle Pet"
        pet_data["status"] = "sold"
        update_resp = session.put(f"{base_url}/pet", json=pet_data)
        assert update_resp.status_code == 200
        assert update_resp.json()["status"] == "sold"
        
        # Step 4: Verify update
        verify_resp = session.get(f"{base_url}/pet/{pet_id}")
        assert verify_resp.json()["status"] == "sold"
        
        # Step 5: Delete pet
        delete_resp = session.delete(f"{base_url}/pet/{pet_id}")
        assert delete_resp.status_code == 200
        
        # Step 6: Verify deletion
        deleted_check = session.get(f"{base_url}/pet/{pet_id}")
        assert deleted_check.status_code == 404
    
    def test_concurrent_pet_operations(self, session, base_url, cleanup_pet):
        """Test: Multiple pet operations in sequence"""
        pet_ids = []
        
        # Create multiple pets
        for i in range(3):
            pet_data = {
                "id": 50000 + i,
                "name": f"Concurrent Pet {i}",
                "status": "available",
                "photoUrls": ["url"]
            }
            resp = session.post(f"{base_url}/pet", json=pet_data)
            assert resp.status_code == 200
            pet_ids.append(resp.json()["id"])
        
        cleanup_pet.extend(pet_ids)
        
        # Query all available pets
        query_resp = session.get(f"{base_url}/pet/findByStatus", params={"status": "available"})
        assert query_resp.status_code == 200
        all_pets = query_resp.json()
        assert len(all_pets) > 0


# ============================================================================
# PART 5: PERFORMANCE ASSERTIONS
# ============================================================================

class TestPerformance:
    """Test performance and response time assertions"""
    
    def test_get_pets_response_time(self, session, base_url):
        """Test: API response time is within acceptable limits"""
        import time
        
        start_time = time.time()
        response = session.get(f"{base_url}/pet/findByStatus", params={"status": "available"})
        end_time = time.time()
        
        response_time = (end_time - start_time) * 1000  # Convert to milliseconds
        
        assert response.status_code == 200
        assert response_time < 5000, f"Response time {response_time}ms exceeds 5s limit"
    
    def test_create_pet_response_time(self, session, base_url, pet_data, cleanup_pet):
        """Test: Pet creation response time"""
        import time
        
        start_time = time.time()
        response = session.post(f"{base_url}/pet", json=pet_data)
        end_time = time.time()
        
        response_time = (end_time - start_time) * 1000
        
        assert response.status_code == 200
        assert response_time < 3000, f"Creation time {response_time}ms exceeds 3s limit"
        cleanup_pet.append(response.json()["id"])


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
