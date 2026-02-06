/**
 * Login and Authentication - Selector Definitions
 * 
 * These selectors target the login flow and authentication pages
 */
export const LOGIN_SELECTORS = {
    // Login page
    signInButton: 'span.button-text:has-text("Sign In")',
    authenticateHeader: 'h2.u-center-text:has-text("Authenticate")',
    
    // Microsoft Azure AD authentication
    emailField: 'input#username[name="username"]',
    continueButton: 'button:has-text("CONTINUE")',
    passwordField: 'input[name="passwd"][id="i0118"]',
    signInButton2: 'input[type="submit"][value="Sign in"]',
    checkButton: 'input[type="checkbox"]',
    submitButton2: 'input[type="submit"][value="Yes"]',
    
    // Post-login verification
    platformTitle: 'span.app-header__title:has-text("Product Platform")',
    logoutButton: 'a[href="/logout"].menu-icon-link',
};
