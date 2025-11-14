"""
Real-World Test Analyzer for PPUpgrade Project
Analyzes actual test failures from your project using AI agent
"""

import json
from datetime import datetime
from test_analyzer_tools import ErrorPatternMatcher, TestContextAnalyzer, SeverityClassifier

# Real test failures from PPUpgrade project
ACTUAL_TEST_FAILURES = [
    {
        "test_file": "accessibility.spec.ts",
        "test_name": "Dashboard - WCAG 2.1 AA Compliance",
        "error": "AssertionError: Expected 0 violations but found 9 accessibility issues",
        "details": "Missing ARIA roles, improper semantic markup, color contrast issues",
        "context": "WCAG 2.1 AA compliance check on dashboard page"
    },
    {
        "test_file": "accessibility.spec.ts", 
        "test_name": "Crypto Results Page - WCAG 2.1 AA Compliance",
        "error": "WCAG violation: Dropdown component missing required ARIA role 'combobox'",
        "details": "Element has role 'button' but should have role 'combobox' for proper accessibility",
        "context": "Filter dropdown on crypto results page not properly announced to screen readers"
    },
    {
        "test_file": "accessibility.spec.ts",
        "test_name": "Status Tab - WCAG 2.1 AA Compliance",
        "error": "Color contrast ratio 3.5:1 does not meet AA standard of 4.5:1",
        "details": "Text on status table header fails contrast requirement",
        "context": "Status tab table headers have insufficient color contrast"
    },
    {
        "test_file": "crypto.results.spec.ts",
        "test_name": "Results page visual regression",
        "error": "Timeout: Timeout waiting for element '.crypto-tab-definitions' after 30000ms",
        "details": "Tab selector not appearing, possibly due to async loading or selector mismatch",
        "context": "Visual regression test for expanded items on results page"
    },
    {
        "test_file": "har.spec.ts",
        "test_name": "API Test - Crypto Results",
        "error": "Status 500: Internal Server Error from /api/crypto/results",
        "details": "Backend returned database connection error",
        "context": "HAR-based API test showing backend connectivity issue"
    }
]

def analyze_with_ai_agent(failure):
    """Analyze test failure using AI agent tools"""
    
    print("\n" + "="*80)
    print(f"🔍 ANALYZING: {failure['test_name']}")
    print("="*80)
    print(f"📄 File: {failure['test_file']}")
    print(f"❌ Error: {failure['error']}")
    print(f"📋 Details: {failure['details']}")
    print(f"🎯 Context: {failure['context']}")
    
    # Step 1: Pattern matching
    print("\n🤖 STEP 1: PATTERN MATCHING")
    print("-" * 80)
    matcher = ErrorPatternMatcher()
    pattern_name, pattern_config = matcher.match_pattern(failure['error'])
    print(f"✅ Pattern Identified: {pattern_name}")
    print(f"📊 Impact Level: {pattern_config.get('severity', 'UNKNOWN')}")
    keywords = pattern_config.get('keywords', [])
    if keywords:
        print(f"💡 Keywords: {', '.join(keywords[:3])}")
    else:
        print(f"💡 Likely related to: {pattern_name.lower()}")
    
    # Step 2: Test context analysis
    print("\n🎲 STEP 2: CONTEXT ANALYSIS")
    print("-" * 80)
    analyzer = TestContextAnalyzer()
    context = analyzer.analyze_context(failure['test_file'])
    print(f"📁 Test Module: {context['module']}")
    print(f"📊 Reliability: {context.get('reliability_score', 50):.0f}%")
    print(f"⚠️  Flakiness: {context.get('flakiness', 0):.0%}")
    
    # Step 3: Severity scoring
    print("\n⚡ STEP 3: SEVERITY ASSESSMENT")
    print("-" * 80)
    classifier = SeverityClassifier()
    severity_level = classifier.classify(failure['error'], context.get('category', 'Unknown'), pattern_config['severity'])
    severity_score = 8 if pattern_config['severity'] == 'CRITICAL' else 6 if pattern_config['severity'] == 'HIGH' else 4
    print(f"🎚️  Severity Level: {severity_level} (Score: {severity_score:.1f}/10)")
    print(f"📈 Risk: {pattern_config['severity']} - requires investigation")
    
    # Step 4: Recommendations
    print("\n💡 STEP 4: RECOMMENDATIONS")
    print("-" * 80)
    solutions = pattern_config['solutions']
    for i, solution in enumerate(solutions[:4], 1):
        print(f"   {i}. {solution}")
    
    # Step 5: Action items
    print("\n✅ STEP 5: ACTION ITEMS")
    print("-" * 80)
    if pattern_config['severity'] == 'CRITICAL':
        print("   🔴 URGENT - Fix immediately, blocking production")
    elif pattern_config['severity'] == 'HIGH':
        print("   🟠 HIGH - Fix before next release")
    elif pattern_config['severity'] == 'MEDIUM':
        print("   🟡 MEDIUM - Plan fix in next sprint")
    else:
        print("   🟢 LOW - Nice to fix when time permits")
    
    return {
        'test_name': failure['test_name'],
        'pattern': pattern_name,
        'severity': severity_level,
        'confidence': 0.8
    }

def main():
    """Main analysis runner"""
    print("\n" + "╔" + "="*78 + "╗")
    print("║" + " "*78 + "║")
    print("║" + "  🚀 AI TEST RESULT ANALYZER - PPUpgrade Real Failures".center(78) + "║")
    print("║" + "  Analyzing actual test failures from your project".center(78) + "║")
    print("║" + " "*78 + "║")
    print("╚" + "="*78 + "╝")
    
    results = []
    for i, failure in enumerate(ACTUAL_TEST_FAILURES, 1):
        print(f"\n\n📊 FAILURE {i}/{len(ACTUAL_TEST_FAILURES)}")
        result = analyze_with_ai_agent(failure)
        results.append(result)
    
    # Summary
    print("\n\n" + "="*80)
    print("📋 ANALYSIS SUMMARY")
    print("="*80)
    print(f"\n✅ Total Failures Analyzed: {len(results)}")
    
    critical = sum(1 for r in results if r['severity'] == 'CRITICAL')
    high = sum(1 for r in results if r['severity'] == 'HIGH')
    medium = sum(1 for r in results if r['severity'] == 'MEDIUM')
    
    print(f"\n🔴 CRITICAL: {critical}")
    print(f"🟠 HIGH: {high}")
    print(f"🟡 MEDIUM: {medium}")
    
    print("\n📊 Breakdown by Pattern:")
    patterns = {}
    for r in results:
        patterns[r['pattern']] = patterns.get(r['pattern'], 0) + 1
    for pattern, count in sorted(patterns.items(), key=lambda x: x[1], reverse=True):
        print(f"   • {pattern}: {count}")
    
    # Save results
    output_file = f"ai_analysis_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(output_file, 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n💾 Results saved to: {output_file}")
    print("\n✨ Analysis complete!")

if __name__ == "__main__":
    main()
