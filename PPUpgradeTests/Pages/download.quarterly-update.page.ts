import { Page } from '@playwright/test';
import { NAVIGATOR_SELECTORS } from '../Utilits/navigator.selectors';

export class DownloadQuarterlyUpdate {
    constructor(private page: Page) {}

    /**
     * Click Download DOCX button (Portrait)
     */
    async clickDownloadDOCXPortrait() {
        const downloadButton = this.page.locator('span.button-text:has-text("Download DOCX")').first();
        await downloadButton.click();
    }

    /**
     * Click Download DOCX (Landscape) button
     */
    async clickDownloadDOCXLandscape() {
        const downloadButton = this.page.locator('span.button-text:has-text("Download DOCX (Landscape)")');
        await downloadButton.click();
    }

    /**
     * Click Download PDF button
     */
    async clickDownloadPDF() {
        const downloadButton = this.page.locator('span.button-text:has-text("Download PDF")').first();
        await downloadButton.click();
    }

    /**
     * Verify download success message
     */
    async verifyDownloadSuccessMessage(fileType: 'DOCX' | 'PDF') {
        const successMessage = this.page.locator(`p:has-text("${fileType} file downloaded successfully.")`);
        return await successMessage.isVisible();
    }

    /**
     * Wait for file download and return download object
     */
    async waitForDownload() {
        const downloadPromise = this.page.waitForEvent('download');
        return downloadPromise;
    }

    /**
     * Download file and save to specified path
     */
    async downloadAndSaveFile(download: any, filePath: string) {
        await download.saveAs(filePath);
    }
}
