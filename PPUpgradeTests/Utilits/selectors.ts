export const SELECTORS = {
    //LogInPage
    signInButton: 'span.button-text:has-text("Sign In")',
    authenticateHeader: 'h2.u-center-text:has-text("Authenticate")',
    emailField: 'input#username[name="username"]',
    continueButton: 'button:has-text("CONTINUE")',
    passwordField: 'input[name="passwd"][id="i0118"]',
    //signInButton2: 'button:has-text("Sign in")',
    signInButton2: 'input[type="submit"][value="Sign in"]',
    checkButton: 'input[type="checkbox"]',
    submitButton2: 'input[type="submit"][value="Yes"]',
    platformTitle: 'span.app-header__title:has-text("Product Platform")',
    logoutButton: 'a[href="/logout"].menu-icon-link',
    //Menu items
    cryptoMenuLink: 'a[href="/crypto/content"].menu-icon-link',
    cryptoWelcomeHeader: 'h2:has-text("Welcome to the Crypto Reviewer")',
     // Crypto actions
     viewCryptoDataButton: 'span.menu-item__text:has-text("View Crypto data")',
     selectInfoText: 'div.s-question__text:has-text("Please select the specific information you would like to review")',
     // Search elements
     jurisdictionLabel:'div.s-input-dropdown__box >> span:text-is("Jurisdiction")',
    jurisdictionInput: 'input.s-input--clearable[placeholder="Search items"]',
    jurisdictionOptionCanada: 'p:has-text("Canada")',
    searchButton: 'span.button-text:has-text("Search")',
    searchResultItem: 'div.s-grid__item:has-text("Canada")',
    //Crypto Definitions 
    cryptoDefinitionsTab: 'span.s-tab__title:has-text("Definitions")',
    definitionsTermHeader: 'span.s-table__header-label:has-text("Term")',
    //Crypto Contacts
    cryptoContactsTab: 'span.s-tab__title:has-text("Contacts")',
    //Crypto Status 
    cryptoStatusTab: 'span.s-tab__title:has-text("Status")',

    // Status table headers
    statusJurisdictionHeader: 'th.s-table__header--flag-label span.s-table__header-label:has-text("Jurisdiction")',
    statusDateHeader: 'th.s-table__header--date span.s-table__header-label:has-text("Date")',
    statusChangesHeader: 'th.s-table__header--html span.s-table__header-label:has-text("Changes")',

    // Optional: general result row locator
    statusTableRow: 'tr.s-table__row',

    // Status messages and links
    statusMessage: 'text=Results displayed are effective from',
    multiJurisdictionStatusMessage: 'text=Please refer to the Status view for information on updates',
    statusViewLink: 'span.reference-link:has-text("Status view")',

    // Expand/Collapse buttons and icons
    expandAllButton: 'button:has-text("Expand All")',
    collapseAllButton: 'button:has-text("Collapse All")',
    expandIcon: 'svg[class*="icon-plus"]',
    collapseIcon: 'svg[class*="icon-minus"]',

    // Crypto Filters - Mandatory
    tokenTypeLabel: 'div.s-input-dropdown__box >> span:text-is("Token Type")',
    categoryLabel: 'div.s-input-dropdown__box >> span:text-is("Category")',
    subCategoryLabel: 'div.s-input-dropdown__box >> span:text-is("Sub Category")',
    methodLabel: 'div.s-input-dropdown__box >> span:text-is("Method")',

};