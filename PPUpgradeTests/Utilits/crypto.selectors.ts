/**
 * Crypto Product - Selector Definitions
 * 
 * These selectors target the Crypto Reviewer filter interface and data views
 */
export const CRYPTO_SELECTORS = {
    // Menu and Navigation
    cryptoMenuLink: 'a[href="/crypto/content"].menu-icon-link',
    cryptoWelcomeHeader: 'h2:has-text("Welcome to the Crypto Reviewer")',
    viewCryptoDataButton: 'span.menu-item__text:has-text("View Crypto data")',
    selectInfoText: 'div.s-question__text:has-text("Please select the specific information you would like to review")',
    
    // Tabs
    cryptoDefinitionsTab: 'span.s-tab__title:has-text("Definitions")',
    cryptoContactsTab: 'span.s-tab__title:has-text("Contacts")',
    cryptoStatusTab: 'span.s-tab__title:has-text("Status")',
    
    // Filter dropdowns - Mandatory
    jurisdictionLabel: 'div.s-input-dropdown__box >> span:text-is("Jurisdiction")',
    jurisdictionInput: 'input.s-input--clearable[placeholder="Search items"]',
    jurisdictionOptionCanada: 'p:has-text("Canada")',
    
    tokenTypeLabel: 'div.s-input-dropdown__box >> span:text-is("Token Type")',
    tokenTypeSelectAll: 'span.s-dropdown__select-all:has-text("All")',
    questionContainer: 'div.question-container.question-container--vertical',
    categoryLabel: 'div.s-input-dropdown__box >> span:text-is("Category")',
    subCategoryLabel: 'div.s-input-dropdown__box >> span:text-is("Sub Category")',
    methodLabel: 'div.s-input-dropdown__box >> span:text-is("Method")',
    
    // Action buttons
    searchButton: 'span.button-text:has-text("Search")',
    clearButton: 'button:has-text("Clear All")',
    
    // Search results
    searchResultItem: 'div.s-grid__item:has-text("Canada")',
    
    // Definitions table
    definitionsTermHeader: 'span.s-table__header-label:has-text("Term")',
    
    // Status table headers
    statusJurisdictionHeader: 'th.s-table__header--flag-label span.s-table__header-label:has-text("Jurisdiction")',
    statusDateHeader: 'th.s-table__header--date span.s-table__header-label:has-text("Date")',
    statusChangesHeader: 'th.s-table__header--html span.s-table__header-label:has-text("Changes")',
    statusTableRow: 'tr.s-table__row',
    
    // Status messages
    statusMessage: 'text=Results displayed are effective from',
    multiJurisdictionStatusMessage: 'text=Please refer to the Status view for information on updates',
    statusViewLink: 'span.reference-link:has-text("Status view")',
    
    // Expand/Collapse functionality
    expandAllButton: 'button:has-text("Expand All")',
    collapseAllButton: 'button:has-text("Collapse All")',
    expandIcon: 'svg[class*="icon-plus"]',
    collapseIcon: 'svg[class*="icon-minus"]',
};
