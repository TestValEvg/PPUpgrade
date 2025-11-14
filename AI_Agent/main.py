"""
Test Result Analyzer - Main Entry Point
Uses OpenAI API with LangChain for intelligent test failure analysis
"""

import os
import sys
import json
from typing import Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Try to import dependencies, with helpful error messages
try:
    from langchain_openai import ChatOpenAI
    from langchain.agents import Tool, initialize_agent, AgentType
    from langchain.chains import LLMChain
    from langchain.prompts import PromptTemplate
    from pydantic import BaseModel, Field
except ImportError as e:
    print("❌ Missing dependencies. Install with:")
    print("   pip install -r requirements.txt")
    sys.exit(1)


# ============================================================================
# 1. STRUCTURED OUTPUT SCHEMAS
# ============================================================================

class RootCauseAnalysis(BaseModel):
    """Structured output for root cause analysis"""
    
    test_name: str = Field(..., description="Name of the failed test")
    error_message: str = Field(..., description="Error message from test")
    
    root_causes: list[str] = Field(
        ..., 
        description="List of likely root causes (primary to secondary)"
    )
    
    severity: str = Field(
        ..., 
        description="Severity level: CRITICAL, HIGH, MEDIUM, LOW"
    )
    
    affected_areas: list[str] = Field(
        ..., 
        description="Code areas/modules likely affected"
    )
    
    recommended_actions: list[str] = Field(
        ..., 
        description="Step-by-step debugging suggestions"
    )
    
    similar_issues: Optional[list[str]] = Field(
        default=None,
        description="References to similar past issues if applicable"
    )
    
    confidence_score: float = Field(
        ..., 
        ge=0.0, 
        le=1.0,
        description="Confidence in root cause analysis (0-1)"
    )


# ============================================================================
# 2. CUSTOM TOOLS FOR ANALYSIS
# ============================================================================

def analyze_error_pattern(error_message: str) -> dict:
    """
    Categorize error patterns to help guide analysis
    """
    patterns = {
        "TIMEOUT": ["timeout", "timed out", "wait", "slow"],
        "SELECTOR": ["selector", "element not found", "not found", "no such element"],
        "ASSERTION": ["assertion", "expected", "actual", "equals"],
        "API": ["api", "response", "status code", "endpoint", "request"],
        "NAVIGATION": ["navigation", "url", "redirect", "page load"],
        "ASYNC": ["async", "promise", "callback", "await"],
        "PERMISSION": ["permission", "access", "unauthorized", "403", "401"],
        "DATA": ["data", "parsing", "json", "null", "undefined"],
    }
    
    error_lower = error_message.lower()
    detected_patterns = []
    
    for pattern_type, keywords in patterns.items():
        if any(keyword in error_lower for keyword in keywords):
            detected_patterns.append(pattern_type)
    
    return {
        "error_patterns": detected_patterns if detected_patterns else ["UNKNOWN"],
        "error_length": len(error_message),
        "has_stack_trace": "at " in error_message or "File" in error_message,
    }


def get_test_context(test_name: str) -> dict:
    """
    Return contextual information about test
    In real implementation, this would query test database
    """
    # Simulated test database
    test_db = {
        "auth.spec.ts": {
            "category": "Functional",
            "module": "Authentication",
            "flakiness_history": "STABLE",
            "last_passed": "2025-11-14",
            "related_tests": ["login", "logout", "session"]
        },
        "crypto.results.spec.ts": {
            "category": "Functional",
            "module": "Crypto Platform",
            "flakiness_history": "FLAKY",
            "last_passed": "2025-11-13",
            "related_tests": ["results", "filter", "search"]
        },
        "accessibility.spec.ts": {
            "category": "Accessibility",
            "module": "WCAG Compliance",
            "flakiness_history": "KNOWN_ISSUES",
            "last_passed": "2025-11-14",
            "related_tests": ["wcag", "aria", "contrast"]
        },
        "har.spec.ts": {
            "category": "API",
            "module": "API Testing",
            "flakiness_history": "STABLE",
            "last_passed": "2025-11-14",
            "related_tests": ["api", "endpoints", "responses"]
        }
    }
    
    return test_db.get(test_name, {
        "category": "Unknown",
        "module": "Unclassified",
        "flakiness_history": "UNKNOWN",
        "related_tests": []
    })


def suggest_debugging_steps(test_type: str, error_pattern: str) -> list[str]:
    """
    Generate debugging steps based on error type and test category
    """
    debugging_guides = {
        "TIMEOUT_FUNCTIONAL": [
            "1. Increase test timeout in playwright.config.ts",
            "2. Check if page is loading slowly (network tab)",
            "3. Add waitForLoadState('networkidle') before assertions",
            "4. Check if element exists before waiting",
            "5. Review recent changes to timing logic",
        ],
        "SELECTOR_FUNCTIONAL": [
            "1. Verify selector in browser DevTools",
            "2. Run test in headed mode: npx playwright test --headed",
            "3. Check if element is in iframe or shadow DOM",
            "4. Use page.locator() instead of querySelector",
            "5. Add explicit waits with waitFor()",
        ],
        "ASSERTION_API": [
            "1. Log actual vs expected values",
            "2. Check API response structure",
            "3. Verify test data setup",
            "4. Check for data type mismatches",
            "5. Add console output in test",
        ],
        "ASYNC_FUNCTIONAL": [
            "1. Check for unhandled promise rejections",
            "2. Add proper await statements",
            "3. Use waitFor() for dynamic content",
            "4. Check browser console for errors",
            "5. Review event handlers and callbacks",
        ],
        "DEFAULT": [
            "1. Run test in verbose mode for detailed output",
            "2. Check recent code changes",
            "3. Review test logs and screenshots",
            "4. Try running test in isolation",
            "5. Check test environment setup",
        ]
    }
    
    key = f"{error_pattern}_{test_type}"
    return debugging_guides.get(key, debugging_guides["DEFAULT"])


# ============================================================================
# 3. LANGCHAIN AGENT SETUP
# ============================================================================

def create_test_analyzer_agent():
    """
    Create and configure the Test Result Analyzer agent
    """
    
    # Initialize OpenAI LLM
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("❌ OPENAI_API_KEY not found. Set it in .env or environment.")
    
    llm = ChatOpenAI(
        model="gpt-4o-mini",  # Use gpt-4o-mini for faster responses
        temperature=0.2,  # Low temp for consistent analysis
        api_key=api_key
    )
    
    # Define tools for the agent
    tools = [
        Tool(
            name="analyze_error_pattern",
            func=analyze_error_pattern,
            description="Analyzes error message to detect pattern types (TIMEOUT, SELECTOR, etc.)"
        ),
        Tool(
            name="get_test_context",
            func=get_test_context,
            description="Retrieves context about a test including category, module, and history"
        ),
        Tool(
            name="suggest_debugging_steps",
            func=lambda test_type, error_pattern: json.dumps(
                suggest_debugging_steps(test_type, error_pattern)
            ),
            description="Suggests debugging steps based on error type and test category"
        ),
    ]
    
    # System prompt for the agent
    system_prompt = """You are an expert QA Test Analyzer AI Agent. Your job is to analyze failed test results 
and provide intelligent root cause suggestions.

When analyzing a test failure:
1. First, use analyze_error_pattern tool to categorize the error
2. Then, use get_test_context tool to understand the test
3. Finally, use suggest_debugging_steps tool to get recommendations

Provide analysis in a structured format with:
- Root causes (primary to secondary, most likely first)
- Severity level (CRITICAL, HIGH, MEDIUM, LOW)
- Affected areas (code modules/functions)
- Recommended debugging actions
- Confidence score (0-1)

Be specific, actionable, and reference the actual error and test type."""
    
    return llm, tools, system_prompt


# ============================================================================
# 4. ANALYSIS ENGINE
# ============================================================================

def analyze_test_failure(
    test_name: str,
    error_message: str,
    test_output: Optional[str] = None
) -> RootCauseAnalysis:
    """
    Main analysis function using LangChain agent
    """
    
    try:
        llm, tools, system_prompt = create_test_analyzer_agent()
        
        # Create analysis prompt
        analysis_prompt = f"""
Analyze this test failure and provide root cause suggestions:

TEST NAME: {test_name}
ERROR MESSAGE: {error_message}
TEST OUTPUT: {test_output if test_output else "No additional output"}

Provide analysis as JSON matching this structure:
{{
    "test_name": "...",
    "error_message": "...",
    "root_causes": ["cause1", "cause2", ...],
    "severity": "HIGH|CRITICAL|MEDIUM|LOW",
    "affected_areas": ["area1", "area2"],
    "recommended_actions": ["step1", "step2", ...],
    "similar_issues": [...],
    "confidence_score": 0.85
}}
"""
        
        # Run LLM analysis
        response = llm.invoke(analysis_prompt)
        
        # Parse response
        response_text = response.content
        
        # Extract JSON from response
        try:
            # Try to find JSON in response
            start_idx = response_text.find('{')
            end_idx = response_text.rfind('}') + 1
            if start_idx != -1 and end_idx > start_idx:
                json_str = response_text[start_idx:end_idx]
                analysis_dict = json.loads(json_str)
            else:
                analysis_dict = {
                    "test_name": test_name,
                    "error_message": error_message,
                    "root_causes": ["Unable to parse AI response - check error details"],
                    "severity": "MEDIUM",
                    "affected_areas": [],
                    "recommended_actions": ["Review error message manually"],
                    "confidence_score": 0.3
                }
        except json.JSONDecodeError:
            analysis_dict = {
                "test_name": test_name,
                "error_message": error_message,
                "root_causes": ["Parse error - using pattern analysis"],
                "severity": "MEDIUM",
                "affected_areas": [],
                "recommended_actions": ["Check test logs manually"],
                "confidence_score": 0.4
            }
        
        # Create structured result
        result = RootCauseAnalysis(
            test_name=analysis_dict.get("test_name", test_name),
            error_message=analysis_dict.get("error_message", error_message),
            root_causes=analysis_dict.get("root_causes", ["Unable to determine"]),
            severity=analysis_dict.get("severity", "MEDIUM"),
            affected_areas=analysis_dict.get("affected_areas", []),
            recommended_actions=analysis_dict.get("recommended_actions", []),
            similar_issues=analysis_dict.get("similar_issues", None),
            confidence_score=float(analysis_dict.get("confidence_score", 0.5))
        )
        
        return result
        
    except Exception as e:
        print(f"❌ Analysis error: {e}")
        # Return fallback analysis
        return RootCauseAnalysis(
            test_name=test_name,
            error_message=error_message,
            root_causes=["Analysis service unavailable"],
            severity="MEDIUM",
            affected_areas=[],
            recommended_actions=["Check error manually", "Review recent changes"],
            confidence_score=0.0
        )


# ============================================================================
# 5. MAIN RUNNER
# ============================================================================

def print_analysis(analysis: RootCauseAnalysis):
    """Pretty print analysis results"""
    print("\n" + "="*80)
    print(f"🔍 TEST ANALYSIS: {analysis.test_name}")
    print("="*80)
    
    print(f"\n📌 Error: {analysis.error_message[:100]}...")
    
    print(f"\n🚨 Severity: {analysis.severity}")
    print(f"📊 Confidence: {analysis.confidence_score:.0%}")
    
    print(f"\n🎯 Root Causes:")
    for i, cause in enumerate(analysis.root_causes, 1):
        print(f"   {i}. {cause}")
    
    print(f"\n📍 Affected Areas:")
    for area in analysis.affected_areas:
        print(f"   • {area}")
    
    print(f"\n✅ Recommended Actions:")
    for i, action in enumerate(analysis.recommended_actions, 1):
        print(f"   {i}. {action}")
    
    if analysis.similar_issues:
        print(f"\n🔗 Similar Issues:")
        for issue in analysis.similar_issues:
            print(f"   • {issue}")
    
    print("\n" + "="*80 + "\n")


def main():
    """Main entry point"""
    print("🤖 Test Result Analyzer - AI-Powered Root Cause Detection\n")
    
    # Example: Real failures from PPUpgrade project
    test_failures = [
        {
            "test_name": "crypto.results.spec.ts",
            "error": "Timeout waiting for element with selector '.crypto-tab'"
        },
        {
            "test_name": "accessibility.spec.ts",
            "error": "AssertionError: Dropdown ARIA role missing, expected 'combobox' but got undefined"
        },
        {
            "test_name": "har.spec.ts",
            "error": "API Response validation failed: Status 500 from /api/crypto/results endpoint"
        },
    ]
    
    print("Analyzing test failures...\n")
    
    for failure in test_failures:
        analysis = analyze_test_failure(
            test_name=failure["test_name"],
            error_message=failure["error"]
        )
        print_analysis(analysis)
    
    print("✅ Analysis complete!")


if __name__ == "__main__":
    main()
