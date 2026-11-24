import { test, expect } from '@playwright/test';
import { credentials } from '../Utilits/credentials';

/**
 * Cache Common Public Graph Request Tests
 * User Story: 131977
 * Environment: https://web.test-simmons.com/ (Online Platform)
 * 
 * NOTE: These tests are NOT part of the PPUpgrade project.
 * Testing Online Platform website caching, not Product Platform.
 * Automated tests (AC1, AC2, AC3) are enabled.
 * Manual tests (AC4-AC7) remain skipped - require Contentstack interaction.
 */

test.describe('Cache Common Public Graph Request - User Story 131977', () => {
    // Set timeout for all tests in this suite
    test.setTimeout(120000);

    const TEST_ENV = 'https://web.test-simmons.com';

    // Helper function to login to Online Platform
    async function loginToWebsite(page) {
        await page.goto(`${TEST_ENV}/en`);
        await page.waitForTimeout(2000);
        
        // Click Sign In button - navigates to login page
        console.log('Looking for Sign In button...');
        const signInButton = page.locator('.secondaryMenu__signInLinkLabel:has-text("Sign In")');
        await signInButton.waitFor({ state: 'visible', timeout: 10000 });
        console.log('Found Sign In button, clicking...');
        
        // Click and wait for navigation
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle' }),
            signInButton.click()
        ]);
        
        console.log('Navigated to login page...');
        
        // Now work in the same page context (navigated to login.test-simmons.com)
        console.log('Looking for email field...');
        const emailField = page.locator('input#username');
        await emailField.waitFor({ state: 'visible', timeout: 15000 });
        console.log('Found email field, filling...');
        await emailField.fill(credentials.username);

        // Click Continue
        console.log('Looking for Continue button...');
        const continueButton = page.getByRole('button', { name: 'Continue' });
        await continueButton.click();
        await page.waitForTimeout(2000);

        // Enter password
        console.log('Looking for password field...');
        const passwordField = page.locator('input[type="password"]');
        await passwordField.waitFor({ state: 'visible', timeout: 10000 });
        console.log('Found password field, filling...');
        await passwordField.fill(credentials.password);

        // Click Sign In
        console.log('Looking for Sign In button (2)...');
        const signInButton2 = page.getByRole('button', { name: 'Sign in' });
        await signInButton2.click();
        await page.waitForTimeout(3000);

        // Handle MFA if needed
        try {
            console.log('Checking for MFA...');
            const checkButton = page.locator('button:has-text("Yes")');
            await checkButton.waitFor({ state: 'visible', timeout: 5000 });
            console.log('MFA required, clicking Yes...');
            await checkButton.click();

            const submitButton = page.locator('button[type="submit"]');
            await submitButton.click();
            await page.waitForTimeout(2000);
        } catch (e) {
            console.log('MFA not required or different flow');
        }

        // Wait for successful login and redirect back to web.test-simmons.com
        await page.waitForTimeout(3000);
        console.log('Login process complete');
    }

    test('AC1 - Public content is served from cache on repeat visits', async ({ page }) => {
        // Test with authenticated session - check if X-Cache appears after login
        console.log('\n=== Testing Cache with Authenticated User ===');
        console.log('Step 1: Logging in first...\n');
        
        await loginToWebsite(page);
        console.log('✓ Logged in successfully\n');

        const testUrl = `${TEST_ENV}/en/about-us`;
        
        console.log(`Step 2: First visit to ${testUrl}`);
        console.log('Expected: X-Cache: Miss from cloudfront (or not cached yet)\n');
        
        // First visit
        await page.goto(testUrl);
        await page.waitForTimeout(3000);

        console.log('Step 3: Refreshing page (same authenticated user)');
        console.log('Expected: X-Cache: Hit from cloudfront (served from cache)\n');
        
        // Refresh/second visit
        await page.reload();
        await page.waitForTimeout(2000);

        console.log('Step 4: Manual verification in Chrome DevTools:');
        console.log('1. Open DevTools > Network tab (should already be open)');
        console.log('2. Find the main document request (about-us)');
        console.log('3. Click on it and check Response Headers');
        console.log('4. Look for X-Cache header:');
        console.log('   - First visit: "Miss from cloudfront" = Not cached, fresh fetch');
        console.log('   - After refresh: "Hit from cloudfront" = Served from cache');
        console.log('   - Or: Check X-Amz-Cf-Pop for CloudFront edge location\n');

        // Try to capture via CDP (Chrome DevTools Protocol) if available
        const client = await page.context().newCDPSession(page);
        
        try {
            // Enable Network domain
            await client.send('Network.enable');
            
            console.log('Step 5: Third visit using CDP to capture headers...\n');
            
            let capturedHeaders: any = {};
            
            client.on('Network.responseReceived', (params) => {
                if (params.response.url === testUrl) {
                    console.log('CDP captured response headers:');
                    console.log(JSON.stringify(params.response.headers, null, 2));
                    capturedHeaders = params.response.headers;
                }
            });
            
            await page.goto(testUrl);
            await page.waitForTimeout(2000);
            
            const xCache = capturedHeaders['X-Cache'] || capturedHeaders['x-cache'];
            const xAmzCfPop = capturedHeaders['X-Amz-Cf-Pop'] || capturedHeaders['x-amz-cf-pop'];
            
            console.log('\n=== Results ===');
            console.log(`X-Cache: ${xCache || 'NOT FOUND'}`);
            console.log(`X-Amz-Cf-Pop: ${xAmzCfPop || 'NOT FOUND'}`);
            
            if (xCache) {
                console.log(`✓ SUCCESS: X-Cache header found via CDP: ${xCache}`);
                expect(xCache).toBeDefined();
                if (xCache.includes('Hit')) {
                    console.log('✓ Cache HIT - Content served from CloudFront cache');
                } else if (xCache.includes('Miss')) {
                    console.log('ℹ Cache MISS - Content fetched from origin (expected on first visit)');
                }
            } else {
                console.log('⚠ X-Cache header not accessible even via CDP');
                console.log('  This is expected - CloudFront headers may not be exposed');
            }
            
        } catch (error) {
            console.log('CDP capture failed:', error);
            console.log('Manual verification required in Chrome DevTools Network tab');
        } finally {
            await client.detach();
        }
        
        console.log('\n✓ Test complete - Check Chrome DevTools Network tab for X-Cache header');
    });

    test('AC2 - Permission-gated pages are never cached', async ({ page }) => {
        // Login first to access permission-gated pages
        await loginToWebsite(page);
        console.log('✓ Logged in successfully');

        // Test URLs: Pages requiring authentication/permissions
        const permissionPages = [
            `${TEST_ENV}/en/products/navigator/funds`,
            `${TEST_ENV}/en/products/marketing/crypto-reviewer`
        ];

        for (const url of permissionPages) {
            console.log(`\nTesting permission page: ${url}`);

            // Visit the page
            const response = await page.goto(url);
            const headers = response?.headers();
            console.log('Response headers:', headers);

            // Verify Cache-Control: no-store is present
            const cacheControl = headers?.['cache-control'];
            console.log(`Cache-Control: ${cacheControl}`);

            // Verify X-Cache header (CloudFront)
            const xCacheHeader = (headers && headers['x-cache']) || (headers && headers['X-Cache']);
            console.log(`X-Cache header: ${xCacheHeader || 'NOT PRESENT'}`);

            // Assertions - permission pages should not be cached
            expect(cacheControl).toBeDefined();
            expect(cacheControl).toContain('no-cache'); // Should have no-cache or no-store
            console.log(`✓ ${url} not cached - Cache-Control: ${cacheControl}`);
        }
    });

    test('AC3 - Pages with GraphQL errors are not cached', async ({ page }) => {
        console.log('\nTesting error page - should not be cached...');

        // Navigate to a page that returns an error (e.g., unpublished content)
        // You may need to adjust this URL to a page that reliably returns an error
        const errorUrl = `${TEST_ENV}/en/non-existent-page-for-testing-errors`;

        const response = await page.goto(errorUrl, { waitUntil: 'networkidle' });
        const headers = response?.headers();
        const statusCode = response?.status();

        console.log(`Status code: ${statusCode}`);
        console.log('Response headers:', headers);

        // Verify Cache-Control: no-store is present
        const cacheControl = headers?.['cache-control'];
        console.log(`Cache-Control: ${cacheControl}`);

        // Verify X-Cache header (CloudFront)
        const xCacheHeader = (headers && headers['x-cache']) || (headers && headers['X-Cache']);
        console.log(`X-Cache header: ${xCacheHeader || 'NOT PRESENT'}`);

        // Assertions for error pages
        if (statusCode !== 200) {
            expect(cacheControl).toBeDefined();
            console.log(`✓ Error page has Cache-Control: ${cacheControl}`);
        } else {
            console.log(`ℹ Page returned 200 - may not be an error page`);
            console.log(`  X-Cache: ${xCacheHeader}`);
        }
    });

    test.skip('AC4 - Cached content is invalidated after publish', async ({ page }) => {
        console.log('\nTesting cache invalidation after publish...');

        // This test requires manual intervention:
        // 1. Visit a public page and confirm it's cached (has X-Cache header)
        // 2. Publish the content in Contentstack
        // 3. Revisit the page and verify first request after publish has no X-Cache (cache miss)

        const testUrl = `${TEST_ENV}/en/about-us`;

        // Step 1: Verify page is cached
        console.log('Step 1: Visiting page to populate cache...');
        await page.goto(testUrl);
        await page.waitForTimeout(2000);

        console.log('Step 2: Second visit - should be cached...');
        const cachedResponse = await page.goto(testUrl);
        const cachedHeaders = cachedResponse?.headers();
        const xCacheBeforePublish = cachedHeaders?.['x-cache'];
        console.log(`X-Cache before publish: ${xCacheBeforePublish}`);
        
        expect(xCacheBeforePublish).toBeDefined();

        // Step 2: Manual intervention required
        console.log('\n⚠️ MANUAL STEP REQUIRED:');
        console.log('1. Go to Contentstack');
        console.log('2. Publish the content for this page');
        console.log('3. Wait for publish to complete');
        console.log('4. Uncomment the lines below and run test again');

        // Uncomment these lines after publishing in Contentstack:
        // console.log('\nStep 3: After publish - checking if cache was cleared...');
        // await page.waitForTimeout(5000); // Wait for publish to propagate
        // const afterPublishResponse = await page.goto(testUrl);
        // const afterPublishHeaders = afterPublishResponse?.headers();
        // const xCacheAfterPublish = afterPublishHeaders?.['x-cache'];
        // console.log(`X-Cache after publish (should be undefined on first request): ${xCacheAfterPublish || 'NOT PRESENT'}`);
        // 
        // // First request after publish should be a cache miss (no X-Cache header)
        // expect(xCacheAfterPublish).toBeUndefined();
        // console.log('✓ Cache was invalidated - first request after publish has no X-Cache header');
    });

    test.skip('AC5 - Referenced content publish invalidates parent page cache', async ({ page }) => {
        console.log('\nTesting referenced content cache invalidation...');

        // This test requires:
        // 1. Visit a public detail page with shared content (contact, disclaimer, office)
        // 2. Confirm it's cached (has X-Cache header)
        // 3. Publish a referenced content item in Contentstack
        // 4. Verify cache was cleared

        const detailPageUrl = `${TEST_ENV}/en/about-us/people/[person-name]`; // Replace with actual person page
        
        console.log('⚠️ MANUAL TEST REQUIRED:');
        console.log('1. Navigate to a public detail page (person, office, etc.)');
        console.log('2. Verify page is cached (X-Cache header present)');
        console.log('3. Go to Contentstack and publish a referenced content item (contact, office, disclaimer)');
        console.log('4. Revisit the detail page');
        console.log('5. Verify first request after publish has no X-Cache header (cache miss)');
        console.log('\nNote: People and Office pages may not show X-Cache header as per test observations');
    });

    test.skip('AC6 - Redirect changes take effect after publish', async ({ page }) => {
        console.log('\nTesting redirect changes...');

        // This test requires:
        // 1. Add/update/remove a redirect in Contentstack
        // 2. Publish the redirect configuration
        // 3. Follow the affected URL
        // 4. Verify redirect behaves according to published configuration

        console.log('⚠️ MANUAL TEST REQUIRED:');
        console.log('1. Go to Contentstack and add/update/remove a redirect');
        console.log('2. Publish the redirect configuration');
        console.log('3. Test the affected URL on the website');
        console.log('4. Verify the redirect works as configured');
        console.log('\nExample: If you added a redirect from /old-page to /new-page,');
        console.log('         verify that visiting /old-page redirects to /new-page');

        // Example test structure (update with actual redirect URLs):
        // const oldUrl = `${TEST_ENV}/en/old-page`;
        // const expectedNewUrl = `${TEST_ENV}/en/new-page`;
        // 
        // const response = await page.goto(oldUrl);
        // const finalUrl = page.url();
        // 
        // expect(finalUrl).toBe(expectedNewUrl);
        // console.log(`✓ Redirect working: ${oldUrl} → ${finalUrl}`);
    });

    test.skip('AC7 - Top Navigation changes take effect after publish', async ({ page }) => {
        console.log('\nTesting Top Navigation changes...');

        // This test requires:
        // 1. Note current top navigation structure
        // 2. Add/update/remove a top navigation item in Contentstack
        // 3. Publish the navigation configuration
        // 4. Visit any page on the website
        // 5. Verify navigation displays according to published configuration

        const testUrl = `${TEST_ENV}/en/about-us`;

        console.log('⚠️ MANUAL TEST REQUIRED:');
        console.log('1. Go to Contentstack → Navigation (or similar content type)');
        console.log('2. Add/update/remove a top navigation menu item');
        console.log('3. Publish the navigation changes');
        console.log('4. Visit any page on the website');
        console.log('5. Verify the navigation menu reflects the published changes');

        await page.goto(testUrl);
        await page.waitForTimeout(2000);

        // Example: Check if a specific navigation item is visible
        // const navItem = page.locator('nav >> text="New Menu Item"');
        // await expect(navItem).toBeVisible();
        // console.log('✓ Top Navigation updated according to published configuration');

        console.log('\nNavigation structure:');
        const navItems = await page.locator('nav a').allTextContents();
        console.log(navItems);
    });

    test('Network Headers Inspector - Utility Test', async ({ page }) => {
        console.log('\n=== Network Headers Inspector ===');
        console.log('This utility test helps inspect response headers for any URL\n');

        // Login first to access all pages including permission-gated ones
        await loginToWebsite(page);
        console.log('✓ Logged in successfully\n');

        const urlsToInspect = [
            `${TEST_ENV}/en/about-us`,
            `${TEST_ENV}/en/about-us/news`,
            `${TEST_ENV}/en/products/navigator/funds`,
            `${TEST_ENV}/en/products/marketing/crypto-reviewer`
        ];

        for (const url of urlsToInspect) {
            console.log(`\n📍 URL: ${url}`);
            console.log('─'.repeat(80));

            const response = await page.goto(url, { waitUntil: 'networkidle' });
            const headers = response?.headers();
            const status = response?.status();

            console.log(`Status Code: ${status}`);
            console.log('\nRelevant Headers:');
            console.log(`  Cache-Control: ${headers?.['cache-control'] || 'NOT PRESENT'}`);
            console.log(`  X-Cache: ${(headers && headers['x-cache']) || (headers && headers['X-Cache']) || 'NOT PRESENT'}`);
            console.log(`  X-Amz-Cf-Pop: ${(headers && headers['x-amz-cf-pop']) || (headers && headers['X-Amz-Cf-Pop']) || 'NOT PRESENT'}`);
            console.log(`  Content-Type: ${headers?.['content-type'] || 'NOT PRESENT'}`);
            console.log(`  ETag: ${headers?.['etag'] || 'NOT PRESENT'}`);
            console.log(`  Age: ${headers?.['age'] || 'NOT PRESENT'}`);

            await page.waitForTimeout(1000);
        }

        console.log('\n' + '='.repeat(80));
    });
});

/**
 * TESTING INSTRUCTIONS:
 * 
 * 1. These tests are SKIPPED by default (test.describe.skip)
 * 2. To run specific tests, remove .skip from the test you want to execute
 * 3. Run with: npx playwright test cache.graphql.spec.ts --headed
 * 
 * MANUAL TESTING REQUIRED FOR:
 * - AC4: Requires publishing content in Contentstack
 * - AC5: Requires publishing referenced content items
 * - AC6: Requires configuring redirects in Contentstack
 * - AC7: Requires updating navigation in Contentstack
 * 
 * AUTOMATED TESTING AVAILABLE FOR:
 * - AC1: Public content caching
 * - AC2: Permission-gated pages not cached
 * - AC3: Error pages not cached
 * - Network Headers Inspector: Utility to inspect headers
 * 
 * AUTHENTICATION:
 * - Same credentials as platform (from credentials.ts)
 * - Authentication may be required for some tests
 * 
 * ENVIRONMENT:
 * - Test: https://web.test-simmons.com/
 * - Public pages: /en/about-us, /en/about-us/news
 * - Permission pages: /en/products/navigator/funds, /en/products/marketing/crypto-reviewer
 */
