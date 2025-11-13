# GitHub Actions CI/CD Setup Guide

## Quick Start

### 1. Add Test Credentials as GitHub Secrets

The CI/CD pipeline requires your test credentials stored as **GitHub Secrets** (encrypted and never exposed).

**Steps:**

1. Go to your GitHub repository: https://github.com/TestValEvg/PPUpgrade
2. Click **Settings** (top right)
3. Left sidebar → **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Add `TEST_EMAIL`:
   - Name: `TEST_EMAIL`
   - Value: Your test email (e.g., `evghenia.valicova@amdaris.com`)
   - Click **Add secret**
6. Click **New repository secret** again
7. Add `TEST_PASSWORD`:
   - Name: `TEST_PASSWORD`
   - Value: Your test password
   - Click **Add secret**

✅ Secrets are now encrypted and will only be passed to CI jobs, never logged or exposed.

### 2. Verify Workflow Activation

GitHub automatically detects and activates the workflow when you push commits.

**Check Status:**

1. Go to **Actions** tab in your GitHub repository
2. You should see "Playwright Tests" workflow
3. Click on it to view pipeline runs

### 3. First Pipeline Run

The pipeline **automatically runs** when:
- ✅ You push to `main` branch
- ✅ You push to `develop` branch
- ✅ You open a pull request against `main` or `develop`

**Manual Trigger (Optional):**

1. Go to **Actions** tab
2. Click **Playwright Tests** workflow
3. Click **Run workflow** button
4. Select branch
5. Click **Run workflow**

---

## Pipeline Flow

```
Repository Event (push/PR)
    ↓
GitHub Actions Triggered
    ↓
Matrix Strategy (3 parallel jobs):
    ├→ Job 1: Test on Chromium
    ├→ Job 2: Test on Firefox
    └→ Job 3: Test on WebKit
    ↓
Each job:
    1. Checks out code
    2. Sets up Node.js 18
    3. Installs dependencies
    4. Installs Playwright
    5. Runs 8 tests
    6. Uploads artifacts
    ↓
Summary job runs after all complete
    ↓
Pipeline complete (success/failure status on PR)
```

---

## Configuration Details

### Triggers

**Push Events:**
```yaml
on:
  push:
    branches: [ main, develop ]
```
Runs on every push to `main` or `develop`.

**Pull Request Events:**
```yaml
on:
  pull_request:
    branches: [ main, develop ]
```
Runs on every PR opened/updated against `main` or `develop`.

### Matrix Strategy

```yaml
strategy:
  fail-fast: false  # Don't stop other jobs if one fails
  matrix:
    browser: [chromium, firefox, webkit]
```

- **3 parallel jobs** created (one per browser)
- **fail-fast: false** means all browsers test even if one fails
- Each job is isolated with its own environment

### Performance

- **Total Duration:** ~30-40 minutes (all 3 browsers run in parallel)
- **Per Browser:** ~12-15 minutes
- **8 tests per browser**
- **Single worker mode** for CI stability

### Test Configuration

```yaml
- name: Run Playwright tests
  run: npx playwright test --project=${{ matrix.browser }} --workers=1 --retries=1
  env:
    CI: 'true'
    TEST_EMAIL: ${{ secrets.TEST_EMAIL }}
    TEST_PASSWORD: ${{ secrets.TEST_PASSWORD }}
```

- **`--project`** - Run only specified browser
- **`--workers=1`** - Single worker for stability
- **`--retries=1`** - Auto-retry failed tests once
- **`CI=true`** - Activates CI mode in `playwright.config.ts`
- **Secrets injected** as environment variables

---

## Artifacts

### What Gets Saved

After each run, artifacts are preserved for 30 days:

| Artifact | Contents | Use Case |
|----------|----------|----------|
| `playwright-report-chromium/` | HTML report + screenshots | View test results |
| `playwright-report-firefox/` | HTML report + screenshots | View test results |
| `playwright-report-webkit/` | HTML report + screenshots | View test results |
| `test-videos-chromium/` | Failure videos + traces | Debug failed tests |
| `test-videos-firefox/` | Failure videos + traces | Debug failed tests |
| `test-videos-webkit/` | Failure videos + traces | Debug failed tests |

### Download Artifacts

1. Go to GitHub Actions workflow run
2. Scroll down to **Artifacts** section
3. Click to download

---

## Status Checks on PRs

When you create a pull request:

```
✅ Playwright Tests (Chromium) — Passed
✅ Playwright Tests (Firefox) — Passed
✅ Playwright Tests (WebKit) — Passed
✅ Test Summary — Passed
```

**All 4 checks must pass** before merging (if branch protection enabled).

---

## Troubleshooting

### Pipeline Doesn't Run

**Check:**
1. Workflow file exists: `.github/workflows/playwright-tests.yml`
2. Go to **Actions** tab → should see "Playwright Tests"
3. If not visible, try pushing another commit

### Tests Fail with "Secret not found"

**Fix:**
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Verify both secrets exist:
   - `TEST_EMAIL`
   - `TEST_PASSWORD`
3. Values match your credentials exactly
4. Retry pipeline run

### One Browser Fails, Others Pass

This is normal (non-flaky behavior):
1. Check the failed browser's report
2. Can be platform/timing issue
3. GitHub Actions will auto-retry once
4. If still fails, check test logs

### Long Pipeline Duration

**Normal:**
- Each job: ~12-15 minutes
- Total (parallel): ~30-40 minutes
- Can be reduced by:
  - Removing browsers (comment in `playwright.config.ts`)
  - Using `--workers=2` (less stable)
  - Sharding tests across more jobs

---

## Advanced: Custom Configurations

### Add Email Notifications

Add to workflow after `Test Summary` job:

```yaml
- name: Send Email on Failure
  if: failure()
  uses: davisben/action-send-email@main
  with:
    server_address: ${{ secrets.EMAIL_SERVER }}
    server_port: ${{ secrets.EMAIL_PORT }}
    username: ${{ secrets.EMAIL_USERNAME }}
    password: ${{ secrets.EMAIL_PASSWORD }}
    subject: 'Playwright Tests Failed'
    to: your-email@example.com
    from: 'GitHub Actions <noreply@github.com>'
```

### Run Specific Tests Only

Modify workflow:

```yaml
- name: Run Specific Tests
  run: npx playwright test crypto.results.spec.ts --project=${{ matrix.browser }}
```

### Add Scheduled Runs

Add to `on:` section:

```yaml
on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM UTC
```

---

## Best Practices

✅ **Always use GitHub Secrets** for credentials  
✅ **Keep workflow YAML in version control**  
✅ **Review artifact reports after failures**  
✅ **Enable branch protection** requiring CI to pass  
✅ **Monitor pipeline duration** for optimization  
✅ **Archive important reports** (30 days auto-delete)  
✅ **Document any customizations** in README  

---

## Next Steps

1. ✅ Add secrets (TEST_EMAIL, TEST_PASSWORD)
2. ✅ Push a commit to trigger workflow
3. ✅ Check **Actions** tab for running pipeline
4. ✅ Download artifacts when complete
5. ✅ Review HTML reports in browser

---

## Support

- **Workflow Status:** Check **Actions** tab
- **Logs:** Click workflow run → click job → view logs
- **Documentation:** [Playwright CI Guide](https://playwright.dev/docs/ci)
- **GitHub Actions Docs:** [Actions Documentation](https://docs.github.com/en/actions)

---

**Setup Complete! 🎉 Your CI/CD pipeline is ready.**
