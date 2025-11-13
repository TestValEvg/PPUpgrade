# Visual Regression Testing Guide

**Framework:** Playwright Screenshot Testing + Percy (Optional)  
**Last Updated:** November 13, 2025

---

## Overview

Visual regression testing automatically captures and compares UI screenshots to detect unintended design changes. This guide covers both local Playwright-based visual testing and cloud-based Percy integration.

### Key Differences

| Aspect | Playwright Screenshots | Percy Cloud |
|--------|----------------------|--------------|
| **Storage** | Local repository (`__screenshots__`) | Cloud-based |
| **Diffing** | Pixel-by-pixel comparison | Intelligent perceptual diffing |
| **Team Collaboration** | Manual review needed | Dashboard with review workflow |
| **Cross-browser** | Configurable locally | Built-in across browsers |
| **Cost** | Free | Free tier + paid plans |

---

## Part 1: Playwright Native Visual Testing

### Setup

Visual tests are built into Playwright - no additional packages needed.

```bash
# Run all visual tests
npx playwright test visual.spec.ts

# Run only visual tests for specific browser
npx playwright test visual.spec.ts --project=chromium

# Run with headed mode to see browser
npx playwright test visual.spec.ts --headed
```

### Test File Location

**File:** `PPUpgradeTests/Tests/visual.spec.ts`

**What's Included:**
- Full-page screenshots (Results, Definitions, Contacts, Status)
- Component-level screenshots (tables, panels, buttons)
- UI state changes (Expand/Collapse, tab activation)
- Dynamic content masking (timestamps, live data)

### Baseline Screenshots

**First Run Behavior:**
```bash
npx playwright test visual.spec.ts
```

On first execution:
1. Visual tests capture screenshots
2. Baselines are created in: `PPUpgradeTests/Tests/__screenshots__/`
3. All tests "pass" (baseline creation is not a failure)
4. Screenshots are committed to git

**Baseline Storage:**
```
PPUpgradeTests/
└── Tests/
    └── __screenshots__/
        ├── visual.spec.ts-1/
        │   ├── visual-results-page-bahrain.png
        │   ├── visual-definitions-page.png
        │   ├── visual-filter-panel.png
        │   └── ... (more screenshots)
        ├── visual.spec.ts-2/
        └── visual.spec.ts-3/
```

### Comparing to Baselines

**Subsequent Runs:**
```bash
npx playwright test visual.spec.ts
```

1. New screenshots taken
2. Compared pixel-by-pixel to baselines
3. Differences highlighted in test results
4. Diffs saved in `test-results/`

### Handling Failures

**When Visual Test Fails:**

```
Error: Screenshot comparison failed for visual-results-page-bahrain.png
Received max diff pixels 250 exceeds threshold 150 (ratio 0.18)
```

**Three Images Generated:**
- `test-results/.../visual-results-page-bahrain-1.png` - Expected (baseline)
- `test-results/.../visual-results-page-bahrain-2.png` - Actual (current)
- `test-results/.../visual-results-page-bahrain-diff.png` - Differences highlighted

### Updating Baselines

Update baselines when **intentional UI changes** are made:

```bash
# Update ALL visual test baselines
npx playwright test visual.spec.ts -u

# Update baselines for specific file/test
npx playwright test visual.spec.ts --grep "Results tab" -u

# Update for specific browser
npx playwright test visual.spec.ts --project=chromium -u
```

**⚠️ Warning:** Always review diffs before updating! Unintended changes will be locked into baselines.

### Dynamic Content Masking

Tests handle dynamic/time-sensitive content by hiding it:

```typescript
// Hide elements before screenshot
await page.addStyleTag({
  content: `
    .timestamp { visibility: hidden !important; }
    .notification-badge { visibility: hidden !important; }
    [data-testid="live-price"] { display: none !important; }
  `
});

// Then capture screenshot
await expect(page).toHaveScreenshot('page.png');
```

**What to Mask:**
- ✅ Timestamps, dates, times
- ✅ User names, profile info
- ✅ Live data (prices, counts)
- ✅ Notification badges
- ✅ Live chat widgets
- ❌ Don't mask: layout, buttons, text content, colors

### Configuration Options

```typescript
await expect(page).toHaveScreenshot('page.png', {
  // Capture entire scrollable page
  fullPage: true,
  
  // Disable animations to prevent timing issues
  animations: 'disabled',
  
  // Allow up to X pixels to differ
  maxDiffPixels: 150,
  
  // Allow X% of pixels to differ
  threshold: 0.2,  // 20%
  
  // Hide specific elements
  mask: [
    page.locator('.timestamp'),
    page.locator('.user-info')
  ],
  
  // Capture specific region
  clip: { x: 0, y: 0, width: 1280, height: 720 }
});
```

### Element-Level vs Full-Page

**Full Page:**
```typescript
await expect(page).toHaveScreenshot('full-page.png', { 
  fullPage: true 
});
```

**Element Only:**
```typescript
const button = page.locator('button.submit');
await expect(button).toHaveScreenshot('button.png');
```

**Advantages:**
- Full page: Captures layout, spacing, overall design
- Element: More stable, less sensitive to unrelated changes

---

## Part 2: Visual Tests in This Project

### Test Coverage

**File:** `PPUpgradeTests/Tests/visual.spec.ts` (3 test suites)

#### Suite 1: Full Page Screenshots
- Results page (single jurisdiction)
- Results page (multiple jurisdictions)
- Definitions tab
- Contacts tab
- Status tab

#### Suite 2: Component-Level Screenshots
- Navigation and filter panel
- Results table (header + rows)
- Expanded result item
- Status table with columns

#### Suite 3: UI State Changes
- Button state comparison (Expand All → Collapse All)
- Tab state comparison (Results active → Definitions active)

### Running Visual Tests

```bash
# Run all visual tests
npx playwright test visual.spec.ts --project=chromium --workers=1

# Run specific test suite
npx playwright test visual.spec.ts --grep "Full Page Screenshots"

# Run and update baselines
npx playwright test visual.spec.ts -u --workers=1

# View HTML report with visual diffs
npx playwright show-report
```

### What Visual Tests Catch

✅ **Layout Issues:**
- Buttons misaligned
- Columns shifted
- Spacing changed

✅ **Styling Issues:**
- Color changes
- Border styles
- Font changes

✅ **Content Issues:**
- Text truncation
- Missing elements
- Overlapping content

❌ **Won't Catch:**
- Functionality bugs (use functional tests)
- Animation timing (disabled in visual tests)
- Random/dynamic content (use masking)

---

## Part 3: Advanced - Percy Cloud Integration

### Why Percy?

When Playwright native screenshots aren't enough:

- 🔄 **Smart Diffing** - Ignores intentional CSS changes, catches real issues
- 🌍 **Cross-browser** - Compare Chromium, Firefox, WebKit in one view
- 👥 **Team Review** - Dashboard for approving changes
- 📱 **Responsive** - Test multiple viewport sizes
- 🔍 **Smart Masks** - Advanced diff masking options

### Setup Percy

```bash
# Install Percy CLI and Playwright plugin
npm install --save-dev @percy/cli @percy/playwright

# Authenticate with Percy
npx percy auth
```

### Percy Configuration

**File:** `percy.config.json` (already created)

```json
{
  "version": 2,
  "discovery": {
    "allowed-hosts": [
      "localhost",
      "platform.test-simmons.com",
      "login.microsoftonline.com"
    ]
  },
  "comparison": {
    "threshold": 0.01,
    "include-all-browsers": true
  }
}
```

### Using Percy in Tests

```typescript
import { percySnapshot } from '@percy/playwright';

test('Results page visual regression with Percy', async ({ page }) => {
  await loginPage.navigate();
  await loginPage.login();
  await cryptoResults.navigateToCrypto();
  
  // Take Percy snapshot
  await percySnapshot(page, 'Crypto Results Page', {
    widths: [1280, 1920],              // Test multiple widths
    minHeight: 1024,
    percyCSS: `
      .timestamp { display: none; }
      .live-update { visibility: hidden; }
    `
  });
});
```

### Running with Percy

```bash
# Run tests with Percy capture
npx percy exec -- npx playwright test visual.spec.ts

# Percy will:
# 1. Run Playwright tests
# 2. Capture screenshots
# 3. Upload to Percy cloud
# 4. Compare to baselines
# 5. Generate review dashboard
```

### Percy Workflow

1. **First Run**: Creates baselines in Percy dashboard
2. **Subsequent Runs**: Compares new screenshots to baselines
3. **Review**: Team approves/rejects diffs in dashboard
4. **Approve**: Changes merged into new baseline

### Accessing Percy Results

1. After `npx percy exec -- npx playwright test` completes
2. Click link in terminal output
3. Navigate to Percy dashboard
4. Review diffs for each snapshot
5. Approve or reject changes

---

## Part 4: CI/CD Integration

### GitHub Actions with Visual Tests

Update `.github/workflows/playwright-tests.yml`:

```yaml
- name: Install Playwright browsers
  run: npx playwright install --with-deps

- name: Run visual tests
  run: npx playwright test visual.spec.ts --project=${{ matrix.browser }}

- name: Upload visual reports
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: visual-reports-${{ matrix.browser }}
    path: test-results/
    retention-days: 30
```

### Percy in CI (Advanced)

```yaml
- name: Run visual tests with Percy
  env:
    PERCY_TOKEN: ${{ secrets.PERCY_TOKEN }}
  run: npx percy exec -- npx playwright test visual.spec.ts --project=${{ matrix.browser }}
```

**Setup Percy Token:**
1. Create Percy account
2. Get project token
3. Add to GitHub Secrets as `PERCY_TOKEN`

---

## Part 5: Troubleshooting

### Visual Test Fails with Diff

**Scenario:** Design was intentionally changed, test captures new design

**Solution:**
```bash
# Review the diff
npx playwright show-report

# If change is intentional, update baseline
npx playwright test visual.spec.ts -u

# Re-run to confirm baseline updated
npx playwright test visual.spec.ts
```

### False Positives (Timing Issues)

**Scenario:** Test sometimes passes, sometimes fails (flaky)

**Causes:**
- Animations not disabled
- Dynamic content not masked
- Network delays
- Browser rendering differences

**Solution:**
```typescript
// Increase timeout for animations
await page.waitForTimeout(500);

// Disable animations
animations: 'disabled',

// Wait for network
await page.waitForLoadState('networkidle');

// Mask dynamic content
mask: [ page.locator('.live-data') ]
```

### Snapshots Bloat Repository Size

**Problem:** Baseline screenshots large, git repo grows

**Solution:** Use `.gitignore`
```
# In .gitignore - ONLY for temporary test artifacts
test-results/
```

**Keep Baselines:** Commit `__screenshots__/` to git
- Baselines should be in version control
- Only test artifacts are ignored

### Percy Won't Connect

**Scenario:** `npx percy exec` fails to authenticate

**Solution:**
```bash
# Check Percy token
npx percy auth

# Set token manually
export PERCY_TOKEN=<your-token>
npx percy exec -- npx playwright test visual.spec.ts

# Or add to GitHub Secrets for CI
```

---

## Part 6: Best Practices

### ✅ DO

- ✅ Mask **all** dynamic content (timestamps, user data)
- ✅ Use `fullPage: true` for comprehensive coverage
- ✅ Commit baselines to git (version control)
- ✅ Review diffs carefully before updating baselines
- ✅ Use meaningful test names ("results-page-filtered" not "screenshot1")
- ✅ Wait for `networkidle` before capturing
- ✅ Test component-level for stability
- ✅ Update baselines only for intentional changes

### ❌ DON'T

- ❌ Ignore visual test failures
- ❌ Update baselines without review
- ❌ Mask too much content (defeats purpose)
- ❌ Skip animations without reason (test real behavior)
- ❌ Commit test artifacts (only baselines)
- ❌ Test random/unstable elements
- ❌ Compare full pages every test (use components)

---

## Part 7: Useful Commands

### Local Playwright Visual Testing

```bash
# First run (create baselines)
npx playwright test visual.spec.ts

# Compare to baselines
npx playwright test visual.spec.ts

# Update baselines
npx playwright test visual.spec.ts -u

# Run specific test
npx playwright test visual.spec.ts --grep "Results tab"

# View HTML report with diffs
npx playwright show-report

# Debug mode with inspector
npx playwright test visual.spec.ts --debug

# Show trace for failed test
npx playwright show-trace test-results/.../trace.zip
```

### Percy Commands

```bash
# Authenticate
npx percy auth

# Run tests with Percy
npx percy exec -- npx playwright test visual.spec.ts

# Run specific browser with Percy
npx percy exec -- npx playwright test visual.spec.ts --project=chromium

# View Percy token
npx percy config:view
```

### Git Commands for Baselines

```bash
# Check baseline status
git status PPUpgradeTests/Tests/__screenshots__/

# Commit baselines
git add PPUpgradeTests/Tests/__screenshots__/
git commit -m "refactor: Update visual test baselines"

# View baseline changes
git diff PPUpgradeTests/Tests/__screenshots__/
```

---

## Summary

### Playwright Approach (What We're Using)
- ✅ **Free** - No external tools needed
- ✅ **Simple** - Built-in `toHaveScreenshot()`
- ✅ **Local** - Baselines in repository
- ⚠️ **Limited** - No team collaboration

### Percy Approach (Optional)
- ✅ **Smart** - Intelligent perceptual diffing
- ✅ **Collaborative** - Team review dashboard
- ✅ **Comprehensive** - Cross-browser, responsive
- ⚠️ **Paid** - Free tier has limits

---

## Next Steps

1. ✅ Run visual tests to create baselines
   ```bash
   npx playwright test visual.spec.ts --project=chromium --workers=1
   ```

2. ✅ Review baselines created in `PPUpgradeTests/Tests/__screenshots__/`

3. ✅ Commit baselines to git
   ```bash
   git add PPUpgradeTests/Tests/__screenshots__/
   git commit -m "test: Add visual regression test baselines"
   ```

4. ✅ Run tests in CI/CD pipeline (GitHub Actions)

5. (Optional) Set up Percy for advanced cross-browser testing

---

**Framework:** Playwright Visual Regression Testing  
**Coverage:** 13 visual tests across all major pages  
**Baselines:** Version controlled in repository  
**Status:** ✅ Ready for production
