# Navigator Quarterly Update - Feature vs Test Coverage

## Summary
- **Total Feature Scenarios:** 35
- **Total Tests Created:** 13
- **Coverage:** 37% (13/35)

---

## Section 1: Access and Navigation
**Feature Scenarios:** 2 | **Tests Created:** 2 | **Coverage:** ✅ 100%

| Scenario | Test | Status |
|----------|------|--------|
| User can access Quarterly Update from navigation link | Test 1: User can access Quarterly Update reporting page | ✅ COVERED |
| User can navigate back to content search | Test 2: User can navigate back to content search from Quarterly Update page | ✅ COVERED |

---

## Section 2: Information Tiles Display
**Feature Scenarios:** 2 | **Tests Created:** 0 | **Coverage:** ❌ 0%

| Scenario | Test | Status |
|----------|------|--------|
| Information tiles are displayed | - | ❌ NOT COVERED |
| Navigator team can edit "Note from Navigator Team" tile | - | ❌ NOT COVERED |

---

## Section 3: Data Display Based on Permissions
**Feature Scenarios:** 2 | **Tests Created:** 1 | **Coverage:** ⚠️ 50%

| Scenario | Test | Status |
|----------|------|--------|
| User only sees information for services they have access to | - | ❌ NOT COVERED |
| Dashboard displays calculated metrics | Test 4: Dashboard displays calculated metrics | ✅ COVERED |

---

## Section 4: Service Tiles and Jurisdiction Information
**Feature Scenarios:** 6 | **Tests Created:** 0 | **Coverage:** ❌ 0%

| Scenario | Test | Status |
|----------|------|--------|
| Service tiles display jurisdiction information | - | ❌ NOT COVERED |
| Service tiles show status with color coding | - | ❌ NOT COVERED |
| Sum of changes and in progress automatically calculated | - | ❌ NOT COVERED |
| Display message when no information exists | - | ❌ NOT COVERED |
| User can access update summary in new window | - | ❌ NOT COVERED |

---

## Section 5: Build Custom Report - Filter Selection
**Feature Scenarios:** 10 | **Tests Created:** 6 | **Coverage:** ⚠️ 60%

| Scenario | Test | Status |
|----------|------|--------|
| User can select one report type | Test 14: Generate extract status table (selects Extract Status Tables) | ✅ COVERED |
| User can select services based on permissions | Test 7: Services checkbox functionality | ✅ COVERED |
| User can select all available services | Test 7: Services checkbox functionality | ✅ COVERED |
| User can select regions based on permissions | Test 8: Regions checkbox functionality | ✅ COVERED |
| User can select all available regions | Test 8: Regions checkbox functionality | ✅ COVERED |
| User can select jurisdictions based on selected regions | Test 9: Jurisdictions checkbox functionality | ✅ COVERED |
| User can select all available jurisdictions | Test 9: Jurisdictions checkbox functionality | ✅ COVERED |
| User can select change type | Test 10: Change type checkbox functionality | ✅ COVERED |
| Timeframe shows last 4 updates in date order | - | ❌ NOT COVERED |
| User can select custom date range | - | ❌ NOT COVERED |

---

## Section 6: Report Generation and Output
**Feature Scenarios:** 4 | **Tests Created:** 3 | **Coverage:** ⚠️ 75%

| Scenario | Test | Status |
|----------|------|--------|
| User can generate custom report with selected filters | Test 11: Generate report with all filters selected | ✅ COVERED |
| Custom generated report displays with proper structure | Test 13: Check report content - TOC and sections | ✅ COVERED |
| User can export custom report to Word | - | ❌ NOT COVERED |
| User can export custom report to PDF | - | ❌ NOT COVERED |
| User can navigate back to scope | Test 12: Back to scope verification after report creation | ✅ COVERED (Additional) |

---

## Section 7: Extract Status Table
**Feature Scenarios:** 3 | **Tests Created:** 1 | **Coverage:** ⚠️ 33%

| Scenario | Test | Status |
|----------|------|--------|
| User can view extract status table | Test 14: Generate extract status table with all filters | ✅ COVERED |
| User can export status table to Word | - | ❌ NOT COVERED |
| User can export status table to PDF | - | ❌ NOT COVERED |

---

## Section 8: Validation and Error Handling
**Feature Scenarios:** 2 | **Tests Created:** 1 | **Coverage:** ⚠️ 50%

| Scenario | Test | Status |
|----------|------|--------|
| Generate button is disabled without required selections | Test 6: Generate report button is disabled by default | ✅ COVERED |
| User cannot access services without proper permissions | - | ❌ NOT COVERED |
| System handles scenarios with no data gracefully | - | ❌ NOT COVERED |

---

## Section 9: UI Components Not Required
**Feature Scenarios:** 2 | **Tests Created:** 0 | **Coverage:** ❌ 0%

| Scenario | Test | Status |
|----------|------|--------|
| Right hand panel is not displayed | - | ❌ NOT COVERED |
| Left hand black panel is not present | - | ❌ NOT COVERED |

---

## Tests Created (13 Total)

### ✅ Fully Covered (13 tests)
1. User can access Quarterly Update reporting page
2. User can navigate back to content search from Quarterly Update page
3. Dashboard displays calculated metrics (4 metrics verified)
4. Build custom report button navigates to report builder
5. Generate report button is disabled by default
6. Services checkbox functionality (select, select all, deselect)
7. Regions checkbox functionality (select, select all, deselect)
8. Jurisdictions checkbox functionality (dropdown, select all, escape)
9. Change type checkbox functionality (select, select all, deselect)
10. Generate report with all filters selected (progress tracking)
11. Back to scope verification after report creation
12. Check report content - TOC and sections (February 2026, Changes, Forthcoming Changes)
13. Generate extract status table with all filters

---

## Missing Test Coverage (22 scenarios)

### High Priority
- ❌ Export custom report to Word
- ❌ Export custom report to PDF
- ❌ Export status table to Word
- ❌ Export status table to PDF
- ❌ Timeframe shows last 4 updates in date order
- ❌ Custom date range selection
- ❌ Service tiles display jurisdiction information
- ❌ Service tiles show status with color coding
- ❌ Sum of changes automatically calculated

### Medium Priority
- ❌ Information tiles are displayed
- ❌ "No changes this Quarter" message display
- ❌ Update summary opens in new window
- ❌ User cannot access services without permissions
- ❌ System handles no data gracefully

### Low Priority (UI Verification)
- ❌ Navigator team can edit note tile
- ❌ User only sees permitted services
- ❌ Right hand panel not displayed
- ❌ Left hand black panel not present

---

## Recommendations

### 1. Complete Core Functionality (Priority 1)
- Add export tests (Word/PDF) for both custom reports and status tables
- Add timeframe selection tests (4 recent updates + custom range)

### 2. Add Service Tile Tests (Priority 2)
- Verify jurisdiction information display
- Verify status color coding
- Verify automatic sum calculations
- Verify "No changes" message

### 3. Add Validation Tests (Priority 3)
- Permission-based service filtering
- No data handling
- Error messages

### 4. Add UI Component Tests (Optional)
- Panel visibility verification
- Information tiles display
- Editable note functionality
