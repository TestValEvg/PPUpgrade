/**
 * Navigator Licensing Restrictions - Selector Definitions
 * Based on filters-1-Combined-JMeter-and-Selenium.yaml
 */
export const NAVIGATOR_SELECTORS = {
    // Filter buttons - from YAML file
    jurisdictionButton: 'div:nth-of-type(2) > .small span:nth-of-type(2)',
    serviceButton: 'div:nth-of-type(2) > .small button > span',
    
    // Search button
    searchButton: 'span.button-text',
    
    // Dropdown options (list items)
    dropdownListItem: 'li > [role="button"]',
    dropdownOption: 'li p',
    
    // Generic selectors that work
    smallButtonSpan: '.small button > span',
    contentSpan: 'span.content',
    
    // Results section
    resultsContainer: 'div[role="tabpanel"]',
    collapseSection: '[data-trigger="collapse"]',
    serviceHeading: 'h4',
};
