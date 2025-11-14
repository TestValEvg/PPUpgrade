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
}