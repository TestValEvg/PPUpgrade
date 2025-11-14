# Web Accessibility Test Report

## Executive Summary

- **Pages Tested**: 1
- **Compliant Pages**: 0/1
- **Total Violations**: 5
  - Critical: 2
  - Serious: 3
- **WCAG 2.1 AA Compliance**: ❌ FAIL

---

## Results by Page

| Page | Status | Violations | Critical | Serious | Moderate | Minor |
|------|--------|-----------|----------|---------|----------|-------|
| Crypto Results Page | ❌ | 5 | 2 | 3 | 0 | 0 |

---

## Detailed Findings


### Crypto Results Page

#### 1. Certain ARIA roles must contain particular children

- **Impact**: CRITICAL
- **Rule ID**: aria-required-children
- **Affected Elements**: 1
- **Learn More**: [aria-required-children](https://dequeuniversity.com/rules/axe/4.11/aria-required-children?application=playwright)

#### 2. Certain ARIA roles must be contained by particular parents

- **Impact**: CRITICAL
- **Rule ID**: aria-required-parent
- **Affected Elements**: 9
- **Learn More**: [aria-required-parent](https://dequeuniversity.com/rules/axe/4.11/aria-required-parent?application=playwright)

#### 3. Elements must meet minimum color contrast ratio thresholds

- **Impact**: SERIOUS
- **Rule ID**: color-contrast
- **Affected Elements**: 2
- **Learn More**: [color-contrast](https://dequeuniversity.com/rules/axe/4.11/color-contrast?application=playwright)

#### 4. <ul> and <ol> must only directly contain <li>, <script> or <template> elements

- **Impact**: SERIOUS
- **Rule ID**: list
- **Affected Elements**: 1
- **Learn More**: [list](https://dequeuniversity.com/rules/axe/4.11/list?application=playwright)

#### 5. Interactive controls must not be nested

- **Impact**: SERIOUS
- **Rule ID**: nested-interactive
- **Affected Elements**: 4
- **Learn More**: [nested-interactive](https://dequeuniversity.com/rules/axe/4.11/nested-interactive?application=playwright)

