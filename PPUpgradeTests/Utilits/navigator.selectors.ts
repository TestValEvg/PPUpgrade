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
    resultsContainer: '.s-card__content',
    collapseSection: '[data-trigger="collapse"]',
    serviceHeading: 'h4',
    
    // Print button - multiple selectors to try
    printButton: 'button[aria-label*="print" i]',
    printButtonAlt: 'button:has-text("Print")',
    printButtonIcon: 'button svg[class*="print"]',
    
    // Favorite button - empty heart icon (not saved)
    favoriteButton: 'svg.s-icon-favourite',
    favoriteButtonEmpty: 'svg.s-icon-favourite path[d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"]',
    
    // Favorite button - filled heart icon (saved)
    favoriteButtonFilled: 'svg.s-icon-favourite path[d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z"]',
    
    // Save Search Modal
    saveSearchModalTitle: 'h3:has-text("Save Search")',
    favoriteNameInput: 'input.s-input[placeholder="Enter favourite name"]',
    saveButton: 'span.button-text:has-text("Save")',
    successMessage: 'p:has-text("Search saved successfully")',
    
    // Favorites Dropdown
    // Favorites dropdown button - click the chevron SVG itself
    favoritesDropdownButton: 'div.s-button-dropdown__buttons > svg[title="Chevron down icon"]',
    favoritesDropdownContainer: '.s-dropdown__container',
    favoritesDropdownList: '.s-dropdown__list',
    favoriteDropdownItem: '.s-dropdown-item',
    searchButtonSpan: 'span.button-text:has-text("Search")',
};
