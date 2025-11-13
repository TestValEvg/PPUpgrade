/**
 * Accessibility Page Object
 * 
 * Provides reusable accessibility scanning methods
 * integrated with Page Object Model pattern
 */

import { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { A11yReporter } from '../Utilits/a11y-reporter';

export interface ScanOptions {
  include?: string | string[];
  exclude?: string | string[];
  tags?: string[];
  skipReporting?: boolean;
}

export class AccessibilityPage {
  constructor(private page: Page) {}

  /**
   * Scan entire page with default WCAG 2.1 AA compliance
   */
  async scanPageDefault(): Promise<any> {
    return await this.scanPage({
      tags: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'],
      exclude: this.getDefaultExclusions()
    });
  }

  /**
   * Scan specific page component for accessibility issues
   */
  async scanComponent(selector: string, options: ScanOptions = {}): Promise<any> {
    const builder = new AxeBuilder({ page: this.page });

    builder.include(selector);

    if (options.exclude) {
      if (Array.isArray(options.exclude)) {
        options.exclude.forEach(ex => builder.exclude(ex));
      } else {
        builder.exclude(options.exclude);
      }
    }

    if (options.tags) {
      builder.withTags(options.tags);
    }

    return await builder.analyze();
  }

  /**
   * Scan with custom options
   */
  async scanPage(options: ScanOptions = {}): Promise<any> {
    const builder = new AxeBuilder({ page: this.page });

    // Set include scope if provided
    if (options.include) {
      if (Array.isArray(options.include)) {
        options.include.forEach(inc => builder.include(inc));
      } else {
        builder.include(options.include);
      }
    }

    // Set exclusions
    const excludeList = options.exclude || this.getDefaultExclusions();
    if (Array.isArray(excludeList)) {
      excludeList.forEach(ex => builder.exclude(ex));
    } else {
      builder.exclude(excludeList);
    }

    // Set WCAG tags
    if (options.tags) {
      builder.withTags(options.tags);
    }

    return await builder.analyze();
  }

  /**
   * Scan for WCAG 2.1 Level A compliance
   */
  async scanWCAG_A(): Promise<any> {
    return await this.scanPage({
      tags: ['wcag2a', 'wcag21a']
    });
  }

  /**
   * Scan for WCAG 2.1 Level AA compliance (recommended)
   */
  async scanWCAG_AA(): Promise<any> {
    return await this.scanPage({
      tags: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']
    });
  }

  /**
   * Scan for WCAG 2.1 Level AAA compliance (optimal)
   */
  async scanWCAG_AAA(): Promise<any> {
    return await this.scanPage({
      tags: ['wcag2a', 'wcag2aa', 'wcag2aaa', 'wcag21a', 'wcag21aa', 'wcag21aaa']
    });
  }

  /**
   * Scan specific page section
   */
  async scanSection(sectionName: string): Promise<any> {
    const sectionMap: { [key: string]: string } = {
      header: 'header',
      nav: 'nav',
      main: 'main',
      footer: 'footer',
      form: 'form'
    };

    const selector = sectionMap[sectionName.toLowerCase()];
    if (!selector) {
      throw new Error(`Unknown section: ${sectionName}`);
    }

    return await this.scanComponent(selector, {
      tags: ['wcag2a', 'wcag2aa', 'wcag21aa']
    });
  }

  /**
   * Check for keyboard navigation accessibility
   */
  async checkKeyboardNavigation(): Promise<any> {
    // Tab through page and check focus visibility
    const focusIndicators = await this.page.evaluate(() => {
      let focusableCount = 0;
      const focusableElements = document.querySelectorAll(
        'a, button, input, select, textarea, [tabindex]'
      );

      focusableElements.forEach(el => {
        const styles = window.getComputedStyle(el);
        if (styles.display !== 'none' && styles.visibility !== 'hidden') {
          focusableCount++;
        }
      });

      return {
        totalFocusable: focusableCount,
        hasVisibleFocus: focusableCount > 0
      };
    });

    return focusIndicators;
  }

  /**
   * Check color contrast ratios
   */
  async checkColorContrast(): Promise<any> {
    const results = await this.scanPage({
      tags: ['color-contrast']
    });

    return {
      violations: results.violations.filter((v: any) => v.id === 'color-contrast'),
      passes: results.passes.filter((p: any) => p.id === 'color-contrast')
    };
  }

  /**
   * Scan for missing ARIA labels
   */
  async checkAriaLabels(): Promise<any> {
    const results = await this.scanPage({
      tags: ['aria']
    });

    return {
      violations: results.violations.filter((v: any) => v.id.includes('aria')),
      passes: results.passes.filter((p: any) => p.id.includes('aria'))
    };
  }

  /**
   * Get default exclusions (third-party content, etc.)
   */
  private getDefaultExclusions(): string[] {
    return [
      '#cookie-banner',
      '[data-testid="cookie-notice"]',
      '.google-analytics',
      '[id^="reCAPTCHA"]',
      '.chat-widget',
      '#intercom-frame',
      '.notification-popup',
      '.temporary-overlay'
    ];
  }

  /**
   * Generate accessibility report
   */
  async generateReport(pageName: string, results: any): Promise<void> {
    A11yReporter.generateReport(results, pageName);
  }

  /**
   * Get violation summary
   */
  getViolationSummary(results: any): {
    critical: number;
    serious: number;
    moderate: number;
    minor: number;
  } {
    const summary = {
      critical: 0,
      serious: 0,
      moderate: 0,
      minor: 0
    };

    results.violations.forEach((violation: any) => {
      switch (violation.impact) {
        case 'critical':
          summary.critical++;
          break;
        case 'serious':
          summary.serious++;
          break;
        case 'moderate':
          summary.moderate++;
          break;
        case 'minor':
          summary.minor++;
          break;
      }
    });

    return summary;
  }

  /**
   * Filter violations by impact level
   */
  getViolationsByImpact(results: any, impact: 'critical' | 'serious' | 'moderate' | 'minor'): any[] {
    return results.violations.filter((v: any) => v.impact === impact);
  }

  /**
   * Get page URL for context
   */
  getPageUrl(): string {
    return this.page.url();
  }

  /**
   * Wait for page to fully load
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }
}
