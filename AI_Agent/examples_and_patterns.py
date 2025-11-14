"""
Practical Examples - Test Result Analyzer in Action
Shows real-world usage with PPUpgrade project failures
"""

from test_analyzer_tools import (
    ErrorPatternMatcher,
    TestContextAnalyzer,
    SeverityClassifier
)


def example_1_timeout_error():
    """Example 1: Timeout Error Analysis"""
    print("\n" + "="*80)
    print("📋 EXAMPLE 1: Timeout Error in Crypto Results Test")
    print("="*80)
    
    test_name = "crypto.results.spec.ts"
    error_message = "Timeout waiting for element '.crypto-tab-definitions' after 60000ms"
    
    print(f"\n🧪 Test: {test_name}")
    print(f"❌ Error: {error_message}\n")
    
    # Pattern matching
    pattern, config = ErrorPatternMatcher.match_pattern(error_message)
    print(f"🎯 Pattern Detected: {pattern}")
    print(f"🚨 Severity: {config['severity']}")
    print(f"\n✅ Recommended Solutions:")
    for solution in config['solutions']:
        print(f"   • {solution}")
    
    # Context analysis
    context = TestContextAnalyzer.analyze_context(test_name)
    print(f"\n📊 Test Context:")
    print(f"   Category: {context['category']}")
    print(f"   Module: {context['module']}")
    print(f"   Flakiness Rate: {context['flakiness']:.1%}")
    print(f"   Avg Duration: {context['avg_duration_ms']}ms")
    
    # Stability suggestions if flaky
    if TestContextAnalyzer.is_flaky_test(test_name):
        print(f"\n⚠️  Stability Concerns:")
        for suggestion in TestContextAnalyzer.suggest_stability_fixes(test_name):
            print(f"   {suggestion}")
    
    # Final severity assessment
    severity = SeverityClassifier.classify(error_message, context['category'], config['severity'])
    print(f"\n🎚️  Final Severity Assessment: {severity}")


def example_2_accessibility_violation():
    """Example 2: Accessibility Violation Analysis"""
    print("\n" + "="*80)
    print("📋 EXAMPLE 2: Accessibility Violation - Missing ARIA Role")
    print("="*80)
    
    test_name = "accessibility.spec.ts"
    error_message = "AssertionError: Dropdown component missing required ARIA role. Expected 'combobox' but got 'undefined'"
    
    print(f"\n🧪 Test: {test_name}")
    print(f"❌ Error: {error_message}\n")
    
    # Pattern matching
    pattern, config = ErrorPatternMatcher.match_pattern(error_message)
    print(f"🎯 Pattern Detected: {pattern}")
    print(f"🚨 Severity: {config['severity']}")
    print(f"\n✅ Recommended Solutions:")
    for i, solution in enumerate(config['solutions'][:3], 1):
        print(f"   {i}. {solution}")
    
    # Context analysis
    context = TestContextAnalyzer.analyze_context(test_name)
    print(f"\n📊 Test Context:")
    print(f"   Category: {context['category']}")
    print(f"   Module: {context['module']}")
    print(f"   Success Rate: {context.get('reliability_score', 0):.1f}%")
    print(f"   Known Issues: 9 accessibility violations documented")
    
    # Final assessment
    severity = SeverityClassifier.classify(error_message, context['category'], config['severity'])
    print(f"\n🎚️  Final Severity Assessment: {severity}")
    print(f"\n💡 Note: This is a KNOWN ISSUE documented in REPORTS/04_ACCESSIBILITY/")
    print(f"   See REMEDIATION_PLAN.md for 3-phase fix strategy (18.5-20 hours effort)")


def example_3_api_error():
    """Example 3: API Error Analysis"""
    print("\n" + "="*80)
    print("📋 EXAMPLE 3: API Server Error - Database Connection Timeout")
    print("="*80)
    
    test_name = "har.spec.ts"
    error_message = "API Response Status: 500 Internal Server Error from /api/crypto/results. Response: {error: 'Database connection timeout after 30000ms'}"
    
    print(f"\n🧪 Test: {test_name}")
    print(f"❌ Error: {error_message}\n")
    
    # Pattern matching
    pattern, config = ErrorPatternMatcher.match_pattern(error_message)
    print(f"🎯 Pattern Detected: {pattern}")
    print(f"🚨 Severity: {config['severity']}")
    print(f"\n✅ Backend Debugging Steps:")
    for i, solution in enumerate(config['solutions'], 1):
        print(f"   {i}. {solution}")
    
    # Context analysis
    context = TestContextAnalyzer.analyze_context(test_name)
    print(f"\n📊 Test Context:")
    print(f"   Category: {context['category']}")
    print(f"   Module: {context['module']}")
    print(f"   Success Rate: {context.get('reliability_score', 0):.1f}%")
    print(f"   Last Failure: {context.get('last_failure', 'Unknown')}")
    
    # Final assessment
    severity = SeverityClassifier.classify(error_message, context['category'], config['severity'])
    print(f"\n🎚️  Final Severity Assessment: {severity}")
    print(f"\n⚡ URGENT: This is a CRITICAL API failure affecting test results")
    print(f"   Action: Check API server logs and database status immediately")


def example_4_flaky_test():
    """Example 4: Flaky Test Analysis"""
    print("\n" + "="*80)
    print("📋 EXAMPLE 4: Flaky Test - Intermittent Selector Timeout")
    print("="*80)
    
    test_name = "cryptoStatus.spec.ts"
    error_message = "Timeout waiting for '.status-table' - sometimes passes, sometimes fails"
    
    print(f"\n🧪 Test: {test_name}")
    print(f"❌ Error: {error_message}\n")
    
    # Pattern matching
    pattern, config = ErrorPatternMatcher.match_pattern(error_message)
    print(f"🎯 Pattern Detected: {pattern}")
    print(f"🚨 Severity: {config['severity']}")
    
    # Context analysis
    context = TestContextAnalyzer.analyze_context(test_name)
    print(f"\n📊 Test Context:")
    print(f"   Category: {context['category']}")
    print(f"   Module: {context['module']}")
    print(f"   Flakiness Rate: {context['flakiness']:.1%} ⚠️")
    print(f"   Success Rate: {context.get('reliability_score', 0):.1f}%")
    
    # Flakiness solutions
    if TestContextAnalyzer.is_flaky_test(test_name):
        print(f"\n🔧 Flakiness Mitigation Strategies:")
        for suggestion in TestContextAnalyzer.suggest_stability_fixes(test_name):
            print(f"   {suggestion}")
    
    # Final assessment
    severity = SeverityClassifier.classify(error_message, context['category'], "HIGH")
    print(f"\n🎚️  Final Severity Assessment: {severity}")
    print(f"\n📌 Root Cause: Test has {context['flakiness']:.0%} flakiness rate")
    print(f"   This indicates timing or race condition issues")


def example_5_pattern_library():
    """Example 5: Available Error Patterns Reference"""
    print("\n" + "="*80)
    print("📋 EXAMPLE 5: Error Pattern Library - All Available Patterns")
    print("="*80)
    
    patterns = ErrorPatternMatcher.get_all_patterns()
    
    print(f"\n📚 Total Patterns Available: {len(patterns)}\n")
    
    for pattern_name, pattern_config in patterns.items():
        print(f"🔸 {pattern_name}")
        print(f"   Severity: {pattern_config['severity']}")
        print(f"   Keywords: {', '.join(pattern_config['keywords'][:3])}...")
        print(f"   Primary Solution: {pattern_config['solutions'][0]}")
        print()


def run_all_examples():
    """Run all examples"""
    print("\n🤖 TEST RESULT ANALYZER - PRACTICAL EXAMPLES")
    print("Real-world scenarios from PPUpgrade project\n")
    
    example_1_timeout_error()
    example_2_accessibility_violation()
    example_3_api_error()
    example_4_flaky_test()
    example_5_pattern_library()
    
    print("\n" + "="*80)
    print("✅ EXAMPLES COMPLETE")
    print("="*80)
    print("\n📌 Key Takeaways:")
    print("   1. Pattern matching identifies error type automatically")
    print("   2. Context analysis provides test history and reliability data")
    print("   3. Severity classification prioritizes actions")
    print("   4. Flakiness detection highlights stability concerns")
    print("   5. All analysis is actionable and specific to test context")
    print("\n💡 Next: Integrate with OpenAI API for intelligent analysis")
    print("   See main.py for LangChain agent implementation\n")


if __name__ == "__main__":
    run_all_examples()
