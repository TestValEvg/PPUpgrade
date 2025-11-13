# 🎯 Running Accessibility Tests - Manual Execution Guide

## Overview

Accessibility tests have been **excluded from the main CI/CD pipeline** and are now **run on-demand only**. This keeps the main CI/CD fast and focused on functional tests.

---

## 🔧 How to Run Accessibility Tests

### Option 1: Local Execution (Recommended for Development)

Run all accessibility tests locally:
```bash
npx playwright test accessibility.spec.ts --project=chromium
```

Run with specific WCAG level:
```bash
npx playwright test accessibility.spec.ts --grep "WCAG 2.1 AA" --project=chromium
```

Run specific test:
```bash
npx playwright test accessibility.spec.ts --grep "Dashboard" --project=chromium
```

Run across all browsers:
```bash
npx playwright test accessibility.spec.ts
```

View HTML report:
```bash
npx playwright show-report
```

---

### Option 2: GitHub Actions Manual Trigger

Run accessibility tests via GitHub Actions:

1. **Navigate to GitHub Repository**
   - Go to: https://github.com/TestValEvg/PPUpgrade
   - Click on **"Actions"** tab

2. **Select Workflow**
   - Find **"Accessibility Tests (Manual)"** workflow
   - Click on it

3. **Trigger Manual Run**
   - Click **"Run workflow"** button
   - Select **WCAG Level**:
     - **A** - Basic accessibility
     - **AA** - Standard/Recommended
     - **AAA** - Optimal
   - Click **"Run workflow"**

4. **Monitor Execution**
   - Tests run across 3 browsers: Chromium, Firefox, WebKit
   - Watch progress in real-time
   - Takes approximately 15-20 minutes

5. **Download Reports**
   - After completion, download artifacts:
     - `accessibility-report-{browser}-wcag{level}`
     - `accessibility-test-results-{browser}`
   - Extract and view HTML reports

---

## 📊 What Gets Tested

### Pages Tested (5)
1. ✅ Dashboard/Home Page
2. ✅ Crypto Results Page
3. ✅ Crypto Results with Filters
4. ✅ Definitions Tab
5. ✅ Status Tab

### Test Suites (12 Tests)
- **5 Main Tests** - Full page compliance scanning
- **4 Analysis Tests** - Color contrast, ARIA, keyboard, Level A
- **3 Component Tests** - Header, navigation, main content

### Reports Generated
1. **Console Output** - Violations grouped by impact
2. **HTML Report** - `accessibility-report.html`
3. **Markdown Report** - `ACCESSIBILITY_TEST_REPORT.md`

---

## 🔍 Understanding the Workflow

### Main CI/CD Pipeline (Automatic)
```
✅ RUNS ON: push, pull_request
✅ RUNS: Functional tests only
❌ EXCLUDES: Visual tests (visual.spec.ts)
❌ EXCLUDES: Accessibility tests (accessibility.spec.ts)
⏱️ DURATION: ~5-10 minutes
```

### Accessibility Tests (Manual)
```
🔲 RUNS ON: Workflow dispatch (manual trigger)
✅ RUNS: All accessibility tests
✅ INCLUDES: All WCAG levels (A, AA, AAA)
✅ INCLUDES: All browsers (Chromium, Firefox, WebKit)
⏱️ DURATION: ~15-20 minutes per browser
```

### Visual Tests (Manual)
```
🔲 RUNS ON: Workflow dispatch (manual trigger)
✅ RUNS: Visual regression tests
✅ INCLUDES: Screenshot comparison
⏱️ DURATION: ~10-15 minutes
```

---

## 📋 CI/CD Configuration

### Main Pipeline Exclusions
```yaml
# .github/workflows/playwright-tests.yml
run: npx playwright test \
  --project=${{ matrix.browser }} \
  --workers=1 \
  --retries=1 \
  --ignore=**/visual.spec.ts \
  --ignore=**/accessibility.spec.ts
```

**Result**: Functional tests run automatically on every push/PR

### Accessibility Tests Trigger
```yaml
# .github/workflows/accessibility-tests-manual.yml
on:
  workflow_dispatch:
    inputs:
      wcag_level:
        options: [A, AA, AAA]
```

**Result**: Accessibility tests run only when manually triggered

---

## ⚡ Quick Commands

### Local Testing
```bash
# Run all accessibility tests (Chromium)
npx playwright test accessibility.spec.ts --project=chromium

# Run with detailed output
npx playwright test accessibility.spec.ts --project=chromium --reporter=verbose

# Run single test
npx playwright test accessibility.spec.ts --grep "Dashboard"

# Run and view HTML report
npx playwright test accessibility.spec.ts && npx playwright show-report

# Run multiple browsers
npx playwright test accessibility.spec.ts --project=chromium --project=firefox
```

### GitHub Actions Trigger
```bash
# Via GitHub CLI
gh workflow run "Accessibility Tests (Manual)" -f wcag_level=AA

# Via GitHub Web UI
1. Actions → Accessibility Tests (Manual) → Run workflow → Select WCAG Level → Run
```

---

## 📊 Test Results

### Expected Outputs

#### Console Output
```
🔍 Scanning: Dashboard/Home Page
✅ Dashboard is WCAG 2.1 AA compliant

🔍 Scanning: Crypto Results Page
✅ Crypto Results Page is WCAG 2.1 AA compliant

... (for all 5 pages)
```

#### HTML Report
- Professional styled report
- Summary statistics
- Page-by-page results
- Violation breakdown by impact level

#### Markdown Report
- Executive summary
- Results table
- Detailed findings
- WCAG rule references

---

## 🎯 When to Run Accessibility Tests

### Run Locally During Development
```
Before: Making UI changes
After: Updating components
Goal: Ensure no new accessibility issues introduced
```

### Run Before Release
```
Trigger: Manual GitHub Actions run
WCAG Level: AA (standard)
Browsers: All 3 (Chromium, Firefox, WebKit)
Goal: Full accessibility verification
```

### Run After Major Changes
```
Changes: Navigation redesign, form updates, etc.
Frequency: As needed
Goal: Verify compliance with new design
```

### Schedule Regular Audits (Optional)
```
Frequency: Monthly
Purpose: Proactive accessibility monitoring
Level: AA (recommended baseline)
```

---

## 🔄 Workflow Trigger Locations

### Option 1: GitHub Actions Tab
```
1. Go to: https://github.com/TestValEvg/PPUpgrade
2. Click: Actions
3. Select: Accessibility Tests (Manual)
4. Click: Run workflow
```

### Option 2: GitHub CLI
```bash
gh workflow run "Accessibility Tests (Manual)" \
  -f wcag_level=AA
```

### Option 3: Using curl (API)
```bash
curl -X POST \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/TestValEvg/PPUpgrade/actions/workflows/accessibility-tests-manual.yml/dispatches \
  -d '{"ref":"main","inputs":{"wcag_level":"AA"}}'
```

---

## 📈 Artifacts and Reports

### Generated Files
- `accessibility-report.html` - Styled HTML report
- `ACCESSIBILITY_TEST_REPORT.md` - Markdown summary
- `playwright-report/` - Full Playwright report
- `test-results/` - Detailed test results

### Download from GitHub
1. Action run completed → Artifacts section
2. Download relevant artifact
3. Extract and open HTML report in browser

---

## 🚨 Troubleshooting

### Tests Fail Locally
```bash
# Ensure dependencies installed
npm install

# Ensure browser installed
npx playwright install chromium

# Run with verbose output
npx playwright test accessibility.spec.ts --reporter=verbose
```

### GitHub Actions Fails
```
1. Check credentials in secrets (TEST_EMAIL, TEST_PASSWORD)
2. Review workflow logs for errors
3. Try running locally first to isolate issue
4. Check internet connectivity for test environment
```

### Reports Not Generated
```bash
# Manually generate report after test run
npx playwright show-report

# Check if accessibility-report.html exists
ls -la accessibility-report.html
```

---

## 📚 Related Documentation

- **ACCESSIBILITY_QUICK_REFERENCE.md** - Quick reference guide
- **ACCESSIBILITY_IMPLEMENTATION_COMPLETE.md** - Implementation details
- **FINAL_STATUS_REPORT.md** - Complete project status

---

## ✅ Summary

- ✅ Accessibility tests **excluded from main CI/CD**
- ✅ Run **locally** with: `npx playwright test accessibility.spec.ts`
- ✅ Run **via GitHub Actions** with manual trigger
- ✅ Select **WCAG level** (A, AA, AAA) when triggering
- ✅ Tests run **across 3 browsers** automatically
- ✅ **Reports generated** in 3 formats
- ✅ **Artifacts uploaded** for download

**Status**: ✅ Accessibility tests ready for on-demand execution

