#!/usr/bin/env node

const { execSync, spawnSync } = require('child_process');

const ALLOWLIST = new Set([
  'GHSA-pxg6-pf52-xh8x', // cookie <0.7.0 pulled via msw 1.x
  'GHSA-5j98-mcp5-4vw2', // glob CLI flag parsing in markdownlint-cli
  'GHSA-rp65-9cf3-cjxr', // nth-check nested in react-scripts chain
  'GHSA-7fh5-64p2-3v2j', // postcss transient dependency
  'GHSA-pqhp-25j4-6hq9', // smol-toml used by markdownlint-cli
  'GHSA-9jgg-88mc-972h', // webpack-dev-server leakage warning
  'GHSA-4v9v-hfq4-rm2v', // webpack-dev-server leakage warning
]);

function getStagedFiles() {
  try {
    const output = execSync('git diff --cached --name-only --diff-filter=ACM', {
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim();

    if (!output) {
      return [];
    }

    return output
      .split('\n')
      .map((file) => file.trim())
      .filter(Boolean);
  } catch (error) {
    console.error('[security:audit] Unable to determine staged files.');
    console.error(error.message || error);
    process.exit(1);
  }
}

function main() {
  const staged = getStagedFiles();
  if (staged.length === 0) {
    process.exit(0);
  }

  const requiresAudit = staged.some((file) =>
    ['package.json', 'package-lock.json'].includes(file.replace(/.*\//, '')),
  );

  if (!requiresAudit) {
    process.exit(0);
  }

  console.info('[security:audit] Dependency changes detected — running npm audit (high severity).');
  const audit = spawnSync('npm', ['audit', '--audit-level=high', '--json'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  if (audit.error) {
    console.error('[security:audit] Failed to execute npm audit.');
    console.error(audit.error.message || audit.error);
    process.exit(1);
  }

  if (audit.status === 0) {
    if (audit.stdout?.trim()) {
      console.info('[security:audit] npm audit completed with no high severity findings.');
    }
    process.exit(0);
  }

  let report;
  try {
    report = JSON.parse(audit.stdout || '{}');
  } catch (error) {
    console.error('[security:audit] Unable to parse npm audit JSON output.');
    console.error(error.message || error);
    process.exit(1);
  }

  const vulnerabilities = report.vulnerabilities || {};
  const blockingFindings = [];

  for (const [name, details] of Object.entries(vulnerabilities)) {
    const severity = (details.severity || '').toLowerCase();
    if (severity !== 'high' && severity !== 'critical') {
      continue;
    }

    const viaEntries = Array.isArray(details.via) ? details.via : [];
    const advisories = new Set();

    for (const item of viaEntries) {
      if (!item) {
        continue;
      }
      if (typeof item === 'string') {
        if (/^GHSA-/.test(item)) {
          advisories.add(item);
        }
        continue;
      }

      if (typeof item === 'object') {
        const urlId = typeof item.url === 'string' ? item.url.split('/').pop() : '';
        if (urlId) {
          advisories.add(urlId);
          continue;
        }

        const source = item.source;
        if (typeof source === 'string' && /^GHSA-/.test(source)) {
          advisories.add(source);
          continue;
        }

        if (typeof source === 'number') {
          advisories.add(`npm-advisory-${source}`);
        }
      }
    }

    const unapproved = [...advisories].filter((id) => id && !ALLOWLIST.has(id));

    if (unapproved.length > 0) {
      blockingFindings.push({ name, severity, advisories: unapproved });
    }
  }

  if (blockingFindings.length === 0) {
    console.info('[security:audit] npm audit reported only allowlisted advisories.');
    process.exit(0);
  }

  console.error('\n[security:audit] Blocking vulnerabilities detected:');
  for (const finding of blockingFindings) {
    console.error(`- ${finding.name} (${finding.severity}) → ${finding.advisories.join(', ')}`);
  }
  console.error(
    '\n[security:audit] npm audit reported vulnerabilities. Resolve them before committing.',
  );
  process.exit(audit.status || 1);
}

main();
