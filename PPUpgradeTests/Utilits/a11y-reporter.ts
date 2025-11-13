/**
 * Accessibility Reporter Utility
 * 
 * Provides detailed logging and reporting for accessibility violations
 * from Axe-core accessibility scans
 */

export interface A11yViolation {
  id: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  help: string;
  helpUrl: string;
  nodes: Array<{
    html: string;
    target: string[];
  }>;
}

export interface A11yScanResults {
  violations: A11yViolation[];
  passes: any[];
  inapplicable: any[];
  incomplete: any[];
}

export class A11yReporter {
  /**
   * Log violations to console with formatted output
   */
  static logViolations(violations: A11yViolation[], pageName: string): void {
    if (violations.length === 0) {
      console.log(`✅ No accessibility violations found on ${pageName}`);
      return;
    }

    console.log(`\n🚨 Accessibility Issues Found on ${pageName}:\n`);
    console.log(`Total Violations: ${violations.length}\n`);

    // Group by impact level
    const byCritical = violations.filter(v => v.impact === 'critical');
    const bySerious = violations.filter(v => v.impact === 'serious');
    const byModerate = violations.filter(v => v.impact === 'moderate');
    const byMinor = violations.filter(v => v.impact === 'minor');

    if (byCritical.length > 0) {
      console.log(`\n⛔ CRITICAL (${byCritical.length} issues):`);
      this.logViolationGroup(byCritical);
    }

    if (bySerious.length > 0) {
      console.log(`\n❌ SERIOUS (${bySerious.length} issues):`);
      this.logViolationGroup(bySerious);
    }

    if (byModerate.length > 0) {
      console.log(`\n⚠️  MODERATE (${byModerate.length} issues):`);
      this.logViolationGroup(byModerate);
    }

    if (byMinor.length > 0) {
      console.log(`\n💡 MINOR (${byMinor.length} issues):`);
      this.logViolationGroup(byMinor);
    }
  }

  /**
   * Log a group of violations
   */
  private static logViolationGroup(violations: A11yViolation[]): void {
    violations.forEach((violation, index) => {
      console.log(`\n  ${index + 1}. ${violation.help}`);
      console.log(`     Rule ID: ${violation.id}`);
      console.log(`     Elements Affected: ${violation.nodes.length}`);
      console.log(`     Learn More: ${violation.helpUrl}`);

      // Show first affected element
      if (violation.nodes.length > 0) {
        console.log(`     First Element: ${violation.nodes[0].html.substring(0, 80)}...`);
      }
    });
  }

  /**
   * Generate comprehensive accessibility report
   */
  static generateReport(results: A11yScanResults, pageName: string): A11yReportSummary {
    const summary = {
      pageName,
      scanDate: new Date().toISOString(),
      totalViolations: results.violations.length,
      byImpact: {
        critical: results.violations.filter(v => v.impact === 'critical').length,
        serious: results.violations.filter(v => v.impact === 'serious').length,
        moderate: results.violations.filter(v => v.impact === 'moderate').length,
        minor: results.violations.filter(v => v.impact === 'minor').length
      },
      totalPasses: results.passes.length,
      inapplicable: results.inapplicable.length,
      incomplete: results.incomplete.length,
      wcagCompliance: results.violations.length === 0,
      violations: results.violations
    };

    this.logViolations(results.violations, pageName);

    return summary;
  }

  /**
   * Create HTML report of violations
   */
  static createHtmlReport(reports: A11yReportSummary[]): string {
    const totalViolations = reports.reduce((sum, r) => sum + r.totalViolations, 0);
    const passedPages = reports.filter(r => r.wcagCompliance).length;

    let html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Accessibility Test Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f5f5f5;
    }
    .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
    header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px 20px;
      border-radius: 8px;
      margin-bottom: 30px;
      text-align: center;
    }
    h1 { font-size: 2.5em; margin-bottom: 10px; }
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }
    .summary-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      text-align: center;
    }
    .summary-card h3 { font-size: 2em; margin: 10px 0; }
    .summary-card p { color: #666; font-size: 0.9em; }
    .status-passed { color: #28a745; }
    .status-failed { color: #dc3545; }
    .status-partial { color: #ffc107; }
    .report-section {
      background: white;
      padding: 25px;
      margin-bottom: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .report-section h2 {
      border-bottom: 3px solid #667eea;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }
    .page-status {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      border-left: 4px solid #667eea;
      background: #f9f9f9;
      margin-bottom: 15px;
      border-radius: 4px;
    }
    .page-status.passed { border-left-color: #28a745; background: #f0f9f5; }
    .page-status.failed { border-left-color: #dc3545; background: #fff5f5; }
    .violation {
      padding: 15px;
      margin-bottom: 15px;
      border-left: 4px solid #dc3545;
      background: #fff5f5;
      border-radius: 4px;
    }
    .violation.serious { border-left-color: #ff6b6b; }
    .violation.moderate { border-left-color: #ffc107; }
    .violation.minor { border-left-color: #17a2b8; }
    .violation h4 { margin-bottom: 8px; color: #333; }
    .violation p { font-size: 0.9em; color: #666; margin: 5px 0; }
    .impact-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-weight: bold;
      font-size: 0.8em;
    }
    .impact-badge.critical { background: #dc3545; color: white; }
    .impact-badge.serious { background: #ff6b6b; color: white; }
    .impact-badge.moderate { background: #ffc107; color: black; }
    .impact-badge.minor { background: #17a2b8; color: white; }
    .stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-top: 10px;
    }
    .stat-item {
      text-align: center;
      padding: 10px;
      background: #f9f9f9;
      border-radius: 4px;
    }
    .stat-item strong { display: block; font-size: 1.5em; }
    .stat-item span { font-size: 0.8em; color: #666; }
    footer {
      text-align: center;
      padding: 20px;
      color: #666;
      font-size: 0.9em;
      margin-top: 40px;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>♿ Accessibility Test Report</h1>
      <p>WCAG 2.1 Compliance Analysis</p>
    </header>

    <div class="summary">
      <div class="summary-card">
        <p>Total Violations</p>
        <h3 class="${totalViolations === 0 ? 'status-passed' : 'status-failed'}">${totalViolations}</h3>
      </div>
      <div class="summary-card">
        <p>Pages Tested</p>
        <h3>${reports.length}</h3>
      </div>
      <div class="summary-card">
        <p>Compliant Pages</p>
        <h3 class="${passedPages === reports.length ? 'status-passed' : 'status-partial'}">${passedPages}/${reports.length}</h3>
      </div>
      <div class="summary-card">
        <p>WCAG 2.1 AA</p>
        <h3 class="${passedPages === reports.length ? 'status-passed' : 'status-failed'}">
          ${passedPages === reports.length ? '✅ PASS' : '❌ FAIL'}
        </h3>
      </div>
    </div>

    <div class="report-section">
      <h2>📋 Page-by-Page Results</h2>
      ${reports.map(report => `
        <div class="page-status ${report.wcagCompliance ? 'passed' : 'failed'}">
          <div>
            <strong>${report.pageName}</strong>
            <p style="font-size: 0.9em; color: #666; margin-top: 5px;">
              Violations: ${report.totalViolations} | Passed: ${report.totalPasses}
            </p>
          </div>
          <span>${report.wcagCompliance ? '✅ COMPLIANT' : '❌ ISSUES FOUND'}</span>
        </div>
      `).join('')}
    </div>

    <div class="report-section">
      <h2>🔍 Detailed Violations</h2>
      ${reports.map(report => report.totalViolations > 0 ? `
        <div style="margin-bottom: 30px;">
          <h3 style="color: #667eea; margin-bottom: 15px;">${report.pageName}</h3>
          ${report.violations.map(v => `
            <div class="violation ${v.impact}">
              <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                <h4>${v.help}</h4>
                <span class="impact-badge ${v.impact}">${v.impact.toUpperCase()}</span>
              </div>
              <p><strong>Rule:</strong> ${v.id}</p>
              <p><strong>Affected Elements:</strong> ${v.nodes.length}</p>
              <p><strong>More Info:</strong> <a href="${v.helpUrl}" target="_blank">${v.helpUrl}</a></p>
            </div>
          `).join('')}
        </div>
      ` : '').join('')}
    </div>

    <footer>
      <p>Report generated on ${new Date().toLocaleString()}</p>
      <p>Using Axe-core accessibility testing framework with Playwright</p>
    </footer>
  </div>
</body>
</html>`;

    return html;
  }

  /**
   * Create Markdown report summary
   */
  static createMarkdownReport(reports: A11yReportSummary[]): string {
    const totalViolations = reports.reduce((sum, r) => sum + r.totalViolations, 0);
    const passedPages = reports.filter(r => r.wcagCompliance).length;
    const totalCritical = reports.reduce((sum, r) => sum + r.byImpact.critical, 0);
    const totalSerious = reports.reduce((sum, r) => sum + r.byImpact.serious, 0);

    let markdown = `# Web Accessibility Test Report

## Executive Summary

- **Pages Tested**: ${reports.length}
- **Compliant Pages**: ${passedPages}/${reports.length}
- **Total Violations**: ${totalViolations}
  - Critical: ${totalCritical}
  - Serious: ${totalSerious}
- **WCAG 2.1 AA Compliance**: ${passedPages === reports.length ? '✅ PASS' : '❌ FAIL'}

---

## Results by Page

| Page | Status | Violations | Critical | Serious | Moderate | Minor |
|------|--------|-----------|----------|---------|----------|-------|
${reports.map(r => `| ${r.pageName} | ${r.wcagCompliance ? '✅' : '❌'} | ${r.totalViolations} | ${r.byImpact.critical} | ${r.byImpact.serious} | ${r.byImpact.moderate} | ${r.byImpact.minor} |`).join('\n')}

---

## Detailed Findings

`;

    reports.forEach(report => {
      if (report.violations.length > 0) {
        markdown += `\n### ${report.pageName}\n\n`;
        report.violations.forEach((v, idx) => {
          markdown += `#### ${idx + 1}. ${v.help}\n\n`;
          markdown += `- **Impact**: ${v.impact.toUpperCase()}\n`;
          markdown += `- **Rule ID**: ${v.id}\n`;
          markdown += `- **Affected Elements**: ${v.nodes.length}\n`;
          markdown += `- **Learn More**: [${v.id}](${v.helpUrl})\n\n`;
        });
      }
    });

    return markdown;
  }
}

export interface A11yReportSummary {
  pageName: string;
  scanDate: string;
  totalViolations: number;
  byImpact: {
    critical: number;
    serious: number;
    moderate: number;
    minor: number;
  };
  totalPasses: number;
  inapplicable: number;
  incomplete: number;
  wcagCompliance: boolean;
  violations: A11yViolation[];
}
