"""
Advanced Test Analyzer Tools
Provides sophisticated error analysis and debugging tools
"""

import json
from typing import List, Dict, Tuple


class ErrorPatternMatcher:
    """Matches errors to known patterns and suggests solutions"""
    
    PATTERNS = {
        "TIMEOUT_SELECTOR": {
            "keywords": ["timeout", "selector", "element", "wait"],
            "severity": "HIGH",
            "solutions": [
                "Increase timeout in playwright.config.ts to 90s+",
                "Use waitForLoadState('networkidle') before interactions",
                "Verify selector exists in DevTools before test runs",
                "Check if element is in iframe or shadow DOM",
                "Add explicit wait with page.locator().waitFor()"
            ]
        },
        "ASSERTION_MISMATCH": {
            "keywords": ["assertion", "expected", "actual", "equal", "match"],
            "severity": "MEDIUM",
            "solutions": [
                "Log actual vs expected values with console.log",
                "Check for data type mismatch (string vs number)",
                "Verify test data setup and initialization",
                "Use toStrictEqual() instead of toEqual() for precision",
                "Check for whitespace or formatting differences"
            ]
        },
        "API_500": {
            "keywords": ["500", "internal server error", "backend"],
            "severity": "CRITICAL",
            "solutions": [
                "Check server logs for exception traces",
                "Verify database is accessible and not overloaded",
                "Review API endpoint code for null pointer errors",
                "Check for timeout in downstream services",
                "Verify test data exists in database"
            ]
        },
        "API_VALIDATION": {
            "keywords": ["response", "validation", "schema", "parse"],
            "severity": "MEDIUM",
            "solutions": [
                "Verify API response structure matches schema",
                "Check for null/undefined fields in response",
                "Validate JSON parsing - check for malformed JSON",
                "Review API contract documentation",
                "Test with actual API response data"
            ]
        },
        "ASYNC_PROMISE": {
            "keywords": ["async", "promise", "await", "callback", "async operation"],
            "severity": "HIGH",
            "solutions": [
                "Ensure all async operations have await statements",
                "Check for unhandled promise rejections",
                "Use Promise.all() for parallel operations",
                "Add catch blocks for error handling",
                "Review event listener cleanup"
            ]
        },
        "NULL_REFERENCE": {
            "keywords": ["cannot read property", "null", "undefined", "no property"],
            "severity": "MEDIUM",
            "solutions": [
                "Add null/undefined checks before accessing properties",
                "Use optional chaining (?.) operator",
                "Log object structure before accessing properties",
                "Check if DOM element exists before manipulation",
                "Verify data initialization before use"
            ]
        },
        "NAVIGATION": {
            "keywords": ["navigation", "url", "redirect", "page not found", "404"],
            "severity": "HIGH",
            "solutions": [
                "Verify base URL is correct for test environment",
                "Check if page redirects happened before assertion",
                "Use page.goto() with proper timeout",
                "Verify user has permission to access page",
                "Check authentication token validity"
            ]
        },
        "PERMISSION": {
            "keywords": ["permission", "unauthorized", "403", "401", "access denied"],
            "severity": "CRITICAL",
            "solutions": [
                "Verify test user credentials are correct",
                "Check if user role has required permissions",
                "Verify authentication token is not expired",
                "Check if feature flag is enabled for user",
                "Review access control rules in backend"
            ]
        },
        "FLAKINESS": {
            "keywords": ["intermittent", "sometimes passes", "race condition", "timing"],
            "severity": "HIGH",
            "solutions": [
                "Increase wait times for dynamic content",
                "Ensure proper test isolation and cleanup",
                "Check for race conditions in async operations",
                "Use deterministic selectors instead of position-based",
                "Reduce test parallelization if causing conflicts"
            ]
        }
    }
    
    @classmethod
    def match_pattern(cls, error_message: str) -> Tuple[str, Dict]:
        """
        Match error message to known patterns
        Returns tuple of (pattern_name, pattern_config)
        """
        error_lower = error_message.lower()
        
        best_match = ("UNKNOWN", {"severity": "MEDIUM", "solutions": [
            "1. Check error message carefully",
            "2. Review test code and assertions",
            "3. Run test in --headed mode for debugging",
            "4. Check recent code changes",
            "5. Review test environment setup"
        ]})
        best_score = 0
        
        for pattern_name, pattern_config in cls.PATTERNS.items():
            keywords = pattern_config["keywords"]
            match_score = sum(1 for kw in keywords if kw in error_lower)
            
            if match_score > best_score:
                best_score = match_score
                best_match = (pattern_name, pattern_config)
        
        return best_match
    
    @classmethod
    def get_all_patterns(cls) -> Dict:
        """Return all available patterns"""
        return cls.PATTERNS


class TestContextAnalyzer:
    """Analyzes test context and history"""
    
    # Simulated test database
    TEST_DATABASE = {
        "crypto.results.spec.ts": {
            "category": "Functional",
            "module": "Crypto Results",
            "flakiness": 0.15,  # 15% flakiness rate
            "avg_duration_ms": 8500,
            "last_failure": "2025-11-14",
            "failure_count": 5,
            "success_count": 85,
            "related_modules": ["crypto.definitions", "selectors", "page objects"]
        },
        "accessibility.spec.ts": {
            "category": "Compliance",
            "module": "WCAG 2.1 AA",
            "flakiness": 0.0,
            "avg_duration_ms": 12000,
            "last_failure": "2025-11-14",
            "failure_count": 9,
            "success_count": 3,
            "related_modules": ["axe-core", "ARIA", "semantic HTML"]
        },
        "har.spec.ts": {
            "category": "API",
            "module": "HAR Testing",
            "flakiness": 0.02,
            "avg_duration_ms": 5000,
            "last_failure": "2025-11-13",
            "failure_count": 1,
            "success_count": 99,
            "related_modules": ["API endpoints", "HAR files", "responses"]
        },
        "cryptoStatus.spec.ts": {
            "category": "Functional",
            "module": "Crypto Status",
            "flakiness": 0.20,
            "avg_duration_ms": 9000,
            "last_failure": "2025-11-14",
            "failure_count": 4,
            "success_count": 16,
            "related_modules": ["status table", "pagination", "filters"]
        }
    }
    
    @classmethod
    def analyze_context(cls, test_name: str) -> Dict:
        """Get context for a specific test"""
        test_info = cls.TEST_DATABASE.get(test_name, {
            "category": "Unknown",
            "module": "Unclassified",
            "flakiness": 0.0,
            "avg_duration_ms": 0,
            "related_modules": []
        })
        
        # Calculate reliability indicator
        if "failure_count" in test_info and "success_count" in test_info:
            total = test_info["failure_count"] + test_info["success_count"]
            success_rate = (test_info["success_count"] / total * 100) if total > 0 else 0
            test_info["reliability_score"] = success_rate
        
        return test_info
    
    @classmethod
    def is_flaky_test(cls, test_name: str) -> bool:
        """Check if test is known to be flaky"""
        test_info = cls.TEST_DATABASE.get(test_name, {})
        return test_info.get("flakiness", 0) > 0.10  # >10% flakiness
    
    @classmethod
    def suggest_stability_fixes(cls, test_name: str) -> List[str]:
        """Suggest fixes for flaky tests"""
        if not cls.is_flaky_test(test_name):
            return []
        
        return [
            "Test shows signs of flakiness. Consider:",
            "1. Add longer waits for dynamic content",
            "2. Use deterministic selectors instead of CSS classes",
            "3. Ensure proper test data isolation",
            "4. Reduce parallel execution to 1 worker",
            "5. Add retry logic for intermittent failures"
        ]


class SeverityClassifier:
    """Classifies error severity based on impact"""
    
    @staticmethod
    def classify(error_message: str, test_category: str, pattern_severity: str) -> str:
        """
        Classify error severity considering multiple factors
        Returns: CRITICAL, HIGH, MEDIUM, LOW
        """
        
        # Base severity from pattern
        severity_score = {
            "CRITICAL": 4,
            "HIGH": 3,
            "MEDIUM": 2,
            "LOW": 1
        }.get(pattern_severity, 2)
        
        # Adjust based on keywords
        critical_keywords = ["500", "crash", "broken", "not working", "permission denied"]
        high_keywords = ["timeout", "assertion", "failed", "error"]
        
        error_lower = error_message.lower()
        
        if any(kw in error_lower for kw in critical_keywords):
            severity_score = 4
        elif any(kw in error_lower for kw in high_keywords):
            severity_score = max(severity_score, 3)
        
        # Adjust based on test category impact
        critical_categories = ["API", "Authentication", "Payment"]
        if test_category in critical_categories and severity_score < 3:
            severity_score = 3
        
        # Map back to string
        severity_map = {4: "CRITICAL", 3: "HIGH", 2: "MEDIUM", 1: "LOW"}
        return severity_map.get(severity_score, "MEDIUM")


# Example usage demonstration
if __name__ == "__main__":
    print("🔧 Advanced Test Analysis Tools\n")
    
    # Test pattern matching
    print("1️⃣  Pattern Matching:")
    test_error = "Timeout waiting for element '.crypto-tab' after 60000ms"
    pattern, config = ErrorPatternMatcher.match_pattern(test_error)
    print(f"   Pattern: {pattern}")
    print(f"   Severity: {config['severity']}")
    print(f"   Solutions: {config['solutions'][0]}\n")
    
    # Test context analysis
    print("2️⃣  Test Context Analysis:")
    context = TestContextAnalyzer.analyze_context("crypto.results.spec.ts")
    print(f"   Category: {context['category']}")
    print(f"   Module: {context['module']}")
    print(f"   Flakiness: {context['flakiness']:.1%}")
    print(f"   Reliability: {context.get('reliability_score', 0):.1f}%\n")
    
    # Test severity classification
    print("3️⃣  Severity Classification:")
    severity = SeverityClassifier.classify(test_error, "Functional", "HIGH")
    print(f"   Classified as: {severity}\n")
    
    print("✅ Tools ready for integration!")
