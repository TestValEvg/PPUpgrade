/**
 * Accessibility Testing Configuration
 * 
 * Defines all pages to be tested for WCAG 2.1 AA compliance
 * and elements to be excluded from scanning (third-party content, etc.)
 */

export const baseURL = 'https://crypto-demo.testvaluation.com';

/**
 * Test pages for accessibility scanning
 * Each page will be scanned for WCAG 2.1 A, AA, and best practices
 */
export const testPages = [
  {
    url: '/',
    name: 'Dashboard/Home Page',
    description: 'Main dashboard landing page',
    tags: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'],
    excludeElements: []
  },
  {
    url: '/crypto-results',
    name: 'Crypto Results Page',
    description: 'Cryptocurrency results with filters and search',
    tags: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'],
    excludeElements: [
      '.notification-popup',
      '.temporary-overlay',
      '[data-testid="live-feed"]'
    ]
  },
  {
    url: '/crypto-definitions',
    name: 'Definitions Tab',
    description: 'Cryptocurrency term definitions and glossary',
    tags: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'],
    excludeElements: [
      '.advertisement',
      '.third-party-widget'
    ]
  },
  {
    url: '/crypto-status',
    name: 'Crypto Status Page',
    description: 'Regulatory status and compliance information',
    tags: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'],
    excludeElements: []
  },
  {
    url: '/crypto-contacts',
    name: 'Contacts Directory',
    description: 'Regulatory contacts and authority information',
    tags: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'],
    excludeElements: [
      '.external-link-icon',
      '.tooltip'
    ]
  }
];

/**
 * Authenticated pages (after login)
 * These require session setup before accessibility scanning
 */
export const authenticatedPages = [
  {
    url: '/dashboard',
    name: 'Authenticated Dashboard',
    description: 'User dashboard with personalized content',
    tags: ['wcag2a', 'wcag2aa', 'wcag21aa'],
    excludeElements: [
      '.user-profile-menu',
      '.notification-badge',
      '[class*="live-update"]'
    ]
  },
  {
    url: '/my-reports',
    name: 'User Reports Section',
    description: 'Saved reports and custom queries',
    tags: ['wcag2a', 'wcag2aa', 'wcag21aa'],
    excludeElements: [
      '.loading-skeleton',
      '.pagination-dropdown'
    ]
  }
];

/**
 * Global elements to always exclude (third-party content, etc.)
 */
export const globalExclusions = [
  '#cookie-banner',
  '[data-testid="cookie-notice"]',
  '.google-analytics',
  '[id^="reCAPTCHA"]',
  '.chat-widget',
  '#intercom-frame'
];

/**
 * WCAG 2.1 Level definitions
 */
export const wcagLevels = {
  A: ['wcag2a', 'wcag21a'],
  AA: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
  AAA: ['wcag2a', 'wcag2aa', 'wcag2aaa', 'wcag21a', 'wcag21aa', 'wcag21aaa']
};

/**
 * Impact levels for accessibility violations
 */
export const impactLevels = {
  CRITICAL: 'critical',  // Complete blocker
  SERIOUS: 'serious',    // Major issue
  MODERATE: 'moderate',  // Should fix
  MINOR: 'minor'         // Nice to fix
};

/**
 * Test configuration
 */
export const testConfig = {
  timeout: 30000,
  networkIdle: true,
  screenshotOnFailure: true,
  detailedReporting: true,
  failOnIssues: {
    critical: true,
    serious: true,
    moderate: false,
    minor: false
  }
};
