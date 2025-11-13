# ✅ CI/CD Configuration Update - Accessibility Tests Excluded

## Summary

Accessibility tests have been **excluded from the main CI/CD pipeline** and are now available **on-demand only** via manual GitHub Actions trigger.

---

## Changes Made

### 1️⃣ Updated Main CI/CD Workflow

**File**: `.github/workflows/playwright-tests.yml`

**Change**: Added exclusion for accessibility tests

```yaml
# Before
run: npx playwright test --project=${{ matrix.browser }} --workers=1 --retries=1 --ignore=**/visual.spec.ts

# After
run: npx playwright test --project=${{ matrix.browser }} --workers=1 --retries=1 --ignore=**/visual.spec.ts --ignore=**/accessibility.spec.ts
```

**Effect**: Functional tests only run on every push/PR

---

### 2️⃣ Created New Accessibility Tests Workflow

**File**: `.github/workflows/accessibility-tests-manual.yml` (NEW)

**Features**:
- ✅ Manual trigger via `workflow_dispatch`
- ✅ WCAG level selection (A, AA, AAA)
- ✅ Cross-browser testing (Chromium, Firefox, WebKit)
- ✅ Automatic report generation
- ✅ Artifact uploads for download

**Trigger**: 
```
GitHub Actions → Run workflow → Select WCAG Level → Run
```

---

## CI/CD Pipeline Overview

### Main Workflow (Automatic - Every Push/PR)
```
✅ RUNS: Functional Tests Only
✅ BROWSERS: Chromium, Firefox, WebKit
✅ RETRIES: 1 (for flaky tests)
❌ EXCLUDES: visual.spec.ts
❌ EXCLUDES: accessibility.spec.ts
⏱️ DURATION: 5-10 minutes
```

### Visual Tests Workflow (Manual - On Demand)
```
🔲 TRIGGER: Manual via GitHub Actions
✅ TESTS: Visual regression (visual.spec.ts)
✅ REPORTS: Screenshot comparisons
⏱️ DURATION: 10-15 minutes
```

### Accessibility Tests Workflow (Manual - On Demand)
```
🔲 TRIGGER: Manual via GitHub Actions
✅ TESTS: WCAG 2.1 compliance (accessibility.spec.ts)
✅ WCAG LEVELS: A, AA, AAA (user selectable)
✅ BROWSERS: Chromium, Firefox, WebKit
✅ REPORTS: Console, HTML, Markdown
⏱️ DURATION: 15-20 minutes per browser
```

---

## How to Run Accessibility Tests

### Local Execution
```bash
# Run all tests
npx playwright test accessibility.spec.ts --project=chromium

# Run specific test
npx playwright test accessibility.spec.ts --grep "Dashboard" --project=chromium

# View report
npx playwright show-report
```

### GitHub Actions Execution
```
1. Go to: https://github.com/TestValEvg/PPUpgrade
2. Click: Actions tab
3. Select: Accessibility Tests (Manual)
4. Click: Run workflow
5. Select: WCAG Level (A, AA, or AAA)
6. Click: Run workflow
7. Wait: 15-20 minutes for completion
8. Download: Artifacts with reports
```

---

## Benefits of This Configuration

### ✅ Faster Main CI/CD
- Functional tests only: 5-10 minutes
- No accessibility tests blocking PR merges
- Faster feedback on functional issues

### ✅ Flexibility for Accessibility Testing
- Run when needed (before release, major changes)
- Choose WCAG compliance level
- Test across all browsers on demand
- Generate detailed reports

### ✅ Scalability
- Easy to add more test types as on-demand workflows
- Main pipeline stays focused
- Performance and accessibility independently managed

### ✅ Cost Optimization
- GitHub Actions minutes used efficiently
- Tests only run when explicitly needed
- Reduced CI/CD overhead

---

## Current CI/CD Structure

```
.github/workflows/
├── playwright-tests.yml
│   ├── Trigger: push, pull_request
│   ├── Tests: Functional (auth, crypto tests)
│   ├── Browsers: Chromium, Firefox, WebKit
│   └── Status: ✅ ACTIVE (automatic)
│
├── visual-tests.yml
│   ├── Trigger: workflow_dispatch (manual)
│   ├── Tests: Visual regression
│   └── Status: ✅ ACTIVE (on-demand)
│
└── accessibility-tests-manual.yml (NEW)
    ├── Trigger: workflow_dispatch (manual)
    ├── Tests: WCAG 2.1 compliance
    ├── WCAG Levels: A, AA, AAA selectable
    └── Status: ✅ ACTIVE (on-demand)
```

---

## Test Files Organization

```
PPUpgradeTests/Tests/
├── auth.spec.ts               → Runs in main CI/CD ✅
├── crypto.results.spec.ts     → Runs in main CI/CD ✅
├── crypto.definitions.spec.ts → Runs in main CI/CD ✅
├── cryptoStatus.spec.ts       → Runs in main CI/CD ✅
├── visual.spec.ts             → Manual workflow only
└── accessibility.spec.ts      → Manual workflow only
```

---

## Command Reference

### Quick Local Commands
```bash
# Run functional tests only (like main CI/CD)
npx playwright test --ignore=**/visual.spec.ts --ignore=**/accessibility.spec.ts

# Run accessibility tests only
npx playwright test accessibility.spec.ts

# Run visual tests only
npx playwright test visual.spec.ts

# Run all tests
npx playwright test
```

### GitHub CLI Trigger
```bash
# Trigger accessibility tests manually
gh workflow run "Accessibility Tests (Manual)" -f wcag_level=AA
```

---

## Verification

### Main Pipeline Still Works ✅
```bash
# This command matches what CI/CD runs
npx playwright test \
  --ignore=**/visual.spec.ts \
  --ignore=**/accessibility.spec.ts \
  --project=chromium \
  --workers=1 \
  --retries=1
```

### Accessibility Tests Ready ✅
```bash
# Accessibility tests can still be run manually
npx playwright test accessibility.spec.ts --project=chromium
```

### Visual Tests Ready ✅
```bash
# Visual tests can still be run manually
npx playwright test visual.spec.ts --project=chromium
```

---

## Files Changed

| File | Change | Status |
|------|--------|--------|
| `.github/workflows/playwright-tests.yml` | Updated: Added accessibility.spec.ts to ignore list | ✅ |
| `.github/workflows/accessibility-tests-manual.yml` | NEW: Manual trigger workflow for accessibility tests | ✅ |
| `RUNNING_ACCESSIBILITY_TESTS.md` | NEW: Execution guide for manual accessibility tests | ✅ |

---

## GitHub Commits

```
Commit: d79249c
Message: ci: Exclude accessibility tests from main CI/CD pipeline
Changes:
  - Updated playwright-tests.yml
  - Created accessibility-tests-manual.yml
  - 76 insertions

Commit: 997aef2
Message: docs: Add accessibility tests manual execution guide
Changes:
  - Added RUNNING_ACCESSIBILITY_TESTS.md
```

---

## Status Summary

✅ **Main CI/CD**: Functional tests only (5-10 min)
✅ **Visual Tests**: Manual trigger available
✅ **Accessibility Tests**: Manual trigger available (NEW)
✅ **Documentation**: Complete with execution guide
✅ **GitHub**: All changes pushed and ready

---

## Next Steps

### When You Want to Run Accessibility Tests

1. **Option A: Local**
   ```bash
   npx playwright test accessibility.spec.ts --project=chromium
   ```

2. **Option B: GitHub Actions**
   - Go to Actions → Accessibility Tests (Manual)
   - Click "Run workflow"
   - Select WCAG level
   - Wait for results

---

**Status**: ✅ **COMPLETE**

Accessibility tests are now properly configured as an on-demand workflow, keeping the main CI/CD pipeline focused on functional testing.

