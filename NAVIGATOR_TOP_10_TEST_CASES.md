# Navigator Top 10 Critical Test Cases
## High-Level Test Coverage for Comprehensive Filter Rules

**Last Updated:** November 25, 2025  
**Feature:** Navigator Licensing Restrictions Filter Rules  
**Work Item:** 108651 (General Service Suppression)

---

## Test Case Selection Strategy

These 10 test cases provide maximum coverage of all filter rules with minimal redundancy. Each test covers multiple scenarios and validates critical business rules.

---

## ✅ Test Case 1: Filter Validation - Search Button State Management
**Priority:** CRITICAL  
**Tags:** `@filter-validation` `@smoke`  
**Coverage Areas:**
- Initial disabled state
- Jurisdiction-only selection (still disabled)
- Service-only selection (still disabled)
- Both selections (enabled)
- Clear filters (returns to disabled)

**Test Steps:**
1. Load Navigator Compare Licensing page
2. Verify Search button is disabled initially
3. Select "Argentina" → Verify Search still disabled
4. Select "Banking" → Verify Search becomes enabled
5. Clear all filters → Verify Search returns to disabled

**Expected Result:** Search button state correctly reflects filter validation rules

**Business Impact:** Prevents invalid searches, ensures data integrity

---

## ✅ Test Case 2: General Suppression - Banking Service
**Priority:** CRITICAL  
**Tags:** `@general-suppression` `@banking-suppresses` `@smoke`  
**Coverage Areas:**
- General suppression rule (Work Item 108651)
- Activities and subactivities cascading suppression
- Service heading validation in results

**Test Steps:**
1. Select "Argentina" jurisdiction
2. Select "Banking" service
3. Click Search button
4. Inspect results section

**Expected Result:**
- ✅ "Banking" service heading appears
- ❌ "General" service heading does NOT appear
- ❌ All General activities/subactivities are suppressed
- Only Banking-related questions displayed

**Business Impact:** Correct implementation of General suppression business rule

---

## ✅ Test Case 3: General Display - Derivatives & FX Service
**Priority:** CRITICAL  
**Tags:** `@general-suppression` `@derivatives-shows-general` `@smoke`  
**Coverage Areas:**
- General display rule (non-suppressing service)
- Activities and subactivities display
- Multiple service headings in results

**Test Steps:**
1. Select "Argentina" jurisdiction
2. Select "Derivatives & FX" service
3. Click Search button
4. Inspect results section

**Expected Result:**
- ✅ "Derivatives & FX" service heading appears
- ✅ "General" service heading DOES appear
- ✅ All General activities/subactivities are visible
- Both service categories visible side-by-side

**Business Impact:** Validates General appears when appropriate (non-suppressing services)

---

## ✅ Test Case 4: General Suppression Precedence - Mixed Services
**Priority:** HIGH  
**Tags:** `@general-suppression` `@mixed-services`  
**Coverage Areas:**
- Suppression rule precedence
- Multiple service selections
- Business rule priority logic

**Test Steps:**
1. Select "Argentina" jurisdiction
2. Select "Banking" service (suppresses General)
3. Select "Derivatives & FX" service (normally shows General)
4. Click Search button
5. Inspect results section

**Expected Result:**
- ✅ "Banking" service heading appears
- ✅ "Derivatives & FX" service heading appears
- ❌ "General" service heading does NOT appear (suppression wins)
- ❌ All General activities/subactivities are suppressed

**Business Impact:** Confirms suppression rule takes precedence over display rule

---

## ✅ Test Case 5: Multiple Jurisdiction Comparison
**Priority:** HIGH  
**Tags:** `@filter-validation` `@multiple-jurisdictions` `@results-display`  
**Coverage Areas:**
- Multiple jurisdiction selection
- Results comparison display
- Jurisdiction count validation

**Test Steps:**
1. Select 3 jurisdictions: "Argentina", "Austria", "Belgium"
2. Select "Banking" service
3. Click Search button
4. Verify results display

**Expected Result:**
- ✅ Search button enabled with 3 jurisdictions
- ✅ Results show comparison table/view
- ✅ All 3 jurisdictions appear as columns
- ✅ Licensing restrictions compared side-by-side

**Business Impact:** Validates core comparison functionality

---

## ✅ Test Case 6: Jurisdiction Selection Limit (5 Max)
**Priority:** MEDIUM  
**Tags:** `@filter-validation` `@jurisdiction-limit` `@edge-cases`  
**Coverage Areas:**
- Business rule enforcement
- Maximum selection limit
- User feedback/error handling

**Test Steps:**
1. Select 5 jurisdictions successfully
2. Attempt to select a 6th jurisdiction
3. Verify system response

**Expected Result:**
- ✅ First 5 jurisdictions selected successfully
- ❌ 6th jurisdiction selection prevented
- ℹ️ User receives clear message about 5 jurisdiction limit
- Search button remains enabled with 5 selections

**Business Impact:** Enforces business rule, prevents system overload

---

## ✅ Test Case 7: Service Dropdown - General Not Visible
**Priority:** HIGH  
**Tags:** `@filter-defaults` `@service-dropdown` `@general-suppression`  
**Coverage Areas:**
- General never appears in filter dropdown
- Service dropdown content validation
- Results-only vs filter option distinction

**Test Steps:**
1. Open Service filter dropdown
2. Inspect all available service options
3. Execute search with Derivatives & FX
4. Verify General in results

**Expected Result:**
- ❌ "General" NOT visible in Service dropdown
- ✅ Banking, Corporate Finance, Derivatives & FX, Lending visible in dropdown
- ✅ "General" appears in results (after search with Derivatives & FX)
- Confirms General is results-only, not a filter option

**Business Impact:** Validates General visibility business rule

---

## ✅ Test Case 8: All Suppressing Services - Complete Suppression
**Priority:** HIGH  
**Tags:** `@general-suppression` `@multiple-suppressors`  
**Coverage Areas:**
- Multiple suppressing services together
- Banking, Corporate Finance, Lending all suppress General
- Comprehensive suppression validation

**Test Steps:**
1. Select "Argentina" jurisdiction
2. Select all 3 suppressing services:
   - Banking
   - Corporate Finance
   - Lending
3. Click Search button
4. Inspect results section

**Expected Result:**
- ✅ "Banking" service heading appears
- ✅ "Corporate Finance" service heading appears
- ✅ "Lending" service heading appears
- ❌ "General" service heading does NOT appear
- ❌ All General activities/subactivities suppressed

**Business Impact:** Validates suppression with maximum service selections

---

## ✅ Test Case 9: Filter Interaction - Clear and Re-select
**Priority:** MEDIUM  
**Tags:** `@filter-interaction` `@clear-filters` `@usability`  
**Coverage Areas:**
- Filter state management
- Clear all filters functionality
- Re-selection workflow

**Test Steps:**
1. Select "Argentina" and "Austria" jurisdictions
2. Select "Banking" and "Corporate Finance" services
3. Click Search button (results appear)
4. Click "Clear All Filters" button
5. Verify filter reset
6. Re-select different filters and search

**Expected Result:**
- ✅ Clear button resets all selections
- ✅ Search button returns to disabled state
- ✅ Filters return to initial empty state
- ✅ Can successfully select new filters and search again
- Previous results cleared

**Business Impact:** Validates filter lifecycle and state management

---

## ✅ Test Case 10: Jurisdiction Search and Selection
**Priority:** MEDIUM  
**Tags:** `@filter-interaction` `@jurisdiction-search` `@usability`  
**Coverage Areas:**
- Jurisdiction filter search functionality
- Filtered results display
- Selection from filtered list

**Test Steps:**
1. Open Jurisdiction filter dropdown
2. Type "Arg" in search box
3. Verify filtered results
4. Select "Argentina" from filtered list
5. Add "Banking" service
6. Execute search

**Expected Result:**
- ✅ Typing "Arg" filters jurisdiction list
- ✅ Only matching jurisdictions displayed (Argentina)
- ✅ Can select from filtered list
- ✅ Search executes successfully with selected filters
- Search functionality improves usability with many jurisdictions

**Business Impact:** Validates enhanced UX for jurisdiction selection

---

## Test Coverage Summary

| **Category** | **Test Cases** | **Critical Rules Validated** |
|--------------|----------------|------------------------------|
| Filter Validation | TC1, TC5, TC6 | Required selections, limits, button states |
| General Suppression | TC2, TC4, TC8 | Banking/CF/Lending suppress, precedence |
| General Display | TC3, TC7 | Non-suppressing services, results-only |
| Filter Interaction | TC9, TC10 | Clear filters, search, state management |
| Results Display | TC2-TC5, TC8 | Service headings, activities/subactivities |
| Edge Cases | TC6 | Jurisdiction limit enforcement |

---

## Automation Priority

**P0 (Smoke Tests - Must Run Every Build):**
- TC1: Filter Validation
- TC2: General Suppression - Banking
- TC3: General Display - Derivatives & FX

**P1 (Regression Tests - Run Before Release):**
- TC4: Mixed Services Precedence
- TC5: Multiple Jurisdictions
- TC7: Service Dropdown Content
- TC8: All Suppressing Services

**P2 (Full Suite - Run Weekly):**
- TC6: Jurisdiction Limit
- TC9: Clear Filters
- TC10: Jurisdiction Search

---

## Test Execution Notes

1. **Pre-requisites:** Valid test credentials, access to test environment
2. **Test Data:** Use stable jurisdictions (Argentina, Austria, Belgium)
3. **Environment:** https://platform.test-simmons.com
4. **Browser:** Chrome (primary), cross-browser validation optional
5. **Execution Time:** ~15-20 minutes for all 10 tests
6. **Automation Framework:** Playwright with Page Object Model

---

## Key Business Rules Validated

✅ **Search Validation:** Jurisdiction + Service required  
✅ **General Suppression:** Banking, Corporate Finance, Lending suppress General  
✅ **General Display:** Derivatives & FX shows General  
✅ **Suppression Precedence:** Suppression rule wins over display rule  
✅ **Cascading Suppression:** Activities/subactivities suppressed with General  
✅ **Jurisdiction Limit:** Maximum 5 jurisdictions enforced  
✅ **General Not in Filter:** Never appears in Service dropdown  
✅ **Filter State:** Clear/reset functionality works correctly  

---

**End of Document**
