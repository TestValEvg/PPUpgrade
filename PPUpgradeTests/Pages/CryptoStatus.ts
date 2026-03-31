import { Page, expect } from '@playwright/test';
import { SELECTORS } from '../Utilits/selectors';

export class CryptoStatus {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Open the Status tab and verify column headers
  public async openStatusTab() {
    // Wait for network to be idle before proceeding
    await this.page.waitForLoadState('networkidle');
    
    const statusTab = this.page.locator(SELECTORS.cryptoStatusTab);
    await statusTab.waitFor({ state: 'visible', timeout: 30000 });
    await statusTab.click();

    // Wait for page to stabilize after tab click
    await this.page.waitForLoadState('networkidle');

    // Wait for table headers to be visible
    const jurisdictionHeader = this.page.locator(SELECTORS.statusJurisdictionHeader);
    const dateHeader = this.page.locator(SELECTORS.statusDateHeader);
    const changesHeader = this.page.locator(SELECTORS.statusChangesHeader);

    await jurisdictionHeader.waitFor({ state: 'visible', timeout: 30000 });
    await dateHeader.waitFor({ state: 'visible', timeout: 30000 });
    await changesHeader.waitFor({ state: 'visible', timeout: 30000 });

    // Validate all expected headers are visible and correct
    await expect(jurisdictionHeader).toHaveText('Jurisdiction');
    await expect(dateHeader).toHaveText('Date');
    await expect(changesHeader).toHaveText('Changes');
  }

  // Verify the table displays data
  public async verifyStatusDataVisible() {
    const firstRow = this.page.locator(SELECTORS.statusTableRow).first();
    await firstRow.waitFor({ state: 'visible', timeout: 15000 });
    await expect(firstRow).toBeVisible();
  }

  // Verify Status tab is visible and selected
  public async verifyStatusTabIsVisible() {
    // Wait for page to load
    await this.page.waitForLoadState('networkidle');
    
    // Verify we're on the Status page/tab
    const statusTab = this.page.locator(SELECTORS.cryptoStatusTab);
    await statusTab.waitFor({ state: 'visible', timeout: 15000 });
    await expect(statusTab).toBeVisible();
    
    // Verify status table is visible
    const statusTable = this.page.locator(SELECTORS.statusTableRow).first();
    await statusTable.waitFor({ state: 'visible', timeout: 15000 });
    await expect(statusTable).toBeVisible();
  }

  // ============ EXPAND/COLLAPSE FUNCTIONALITY ============
  // Note: Status may not have expandable content in some cases
  
  // Check if Expand All button exists
  async isExpandAllButtonPresent(): Promise<boolean> {
    const expandAllButton = this.page.locator('span.button-text:has-text("Expand All")');
    try {
      await expandAllButton.waitFor({ state: 'visible', timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  // Click Expand All button if present
  async clickExpandAllIfPresent(): Promise<boolean> {
    const isPresent = await this.isExpandAllButtonPresent();
    if (isPresent) {
      const expandAllButton = this.page.locator('span.button-text:has-text("Expand All")');
      await expandAllButton.waitFor({ state: 'visible', timeout: 10000 });
      await expandAllButton.click();
      await this.page.waitForTimeout(2000);
      console.log('✓ Clicked Expand All button on Status tab');
      return true;
    } else {
      console.log('ℹ Expand All button not present - no expandable content');
      return false;
    }
  }

  // Verify Collapse All button is visible
  async verifyCollapseAllButtonVisible() {
    const collapseAllButton = this.page.locator('span.button-text:has-text("Collapse All")');
    await expect(collapseAllButton).toBeVisible({ timeout: 10000 });
    console.log('✓ Button changed to "Collapse All"');
  }

  // Verify content is expanded
  async verifyContentExpanded() {
    const toggleElements = this.page.locator('div.plus-minus-toggle');
    const count = await toggleElements.count();
    expect(count).toBeGreaterThan(0);
    console.log(`✓ Found ${count} expandable elements on Status tab`);
  }

  // Click Collapse All button
  async clickCollapseAll() {
    const collapseAllButton = this.page.locator('span.button-text:has-text("Collapse All")');
    await collapseAllButton.waitFor({ state: 'visible', timeout: 10000 });
    await collapseAllButton.click();
    await this.page.waitForTimeout(2000);
    console.log('✓ Clicked Collapse All button');
  }

  // Verify Expand All button is visible (after collapsing)
  async verifyExpandAllButtonVisible() {
    const expandAllButton = this.page.locator('span.button-text:has-text("Expand All")');
    await expect(expandAllButton).toBeVisible({ timeout: 10000 });
    console.log('✓ Button changed back to "Expand All"');
  }

  // Verify tab content is loaded
  async verifyTabContentLoaded() {
    await this.page.waitForLoadState('networkidle');
    const statusTable = this.page.locator(SELECTORS.statusTableRow).first();
    await expect(statusTable).toBeVisible({ timeout: 10000 });
    console.log('✓ Status tab content loaded');
  }
}