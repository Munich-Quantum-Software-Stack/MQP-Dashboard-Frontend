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
  'GHSA-7h2j-956f-4vf2', // @isaacs/brace-expansion - transitive dependency
  'GHSA-2w69-qvjg-hvjx', // @remix-run/router - react-router dependency
  'GHSA-6rw7-vpxm-498p', // qs - transitive dependency
  // Pre-existing transitive dependency vulnerabilities (not introduced by project changes)
  'GHSA-fv7c-fp4j-7gwp', // @babel/plugin-transform-modules-systemjs - transitive
  'GHSA-wh4c-j3r5-mjhp', // @xmldom/xmldom - transitive
  'GHSA-2v35-w6hq-6mfw', // @xmldom/xmldom - transitive
  'GHSA-f6ww-3ggp-fr8h', // @xmldom/xmldom - transitive
  'GHSA-x6wf-f3px-wcqx', // @xmldom/xmldom - transitive
  'GHSA-j759-j44w-7fr8', // @xmldom/xmldom - transitive
  'GHSA-q3j6-qgpj-74h6', // fast-uri - transitive
  'GHSA-v39h-62p7-jpjc', // fast-uri - transitive
  'GHSA-25h7-pfq9-p65f', // flatted - transitive
  'GHSA-rf6f-7fwh-wjgh', // flatted - transitive
  'GHSA-wf6x-7x77-mvgw', // immutable - transitive
  'GHSA-6c59-mwgh-r2x6', // jsonpath - transitive
  'GHSA-87r5-mp6g-5w5j', // jsonpath - transitive
  'GHSA-r5fr-rjxr-66jc', // lodash - transitive
  'GHSA-f23m-r3pf-42rh', // lodash - transitive
  'GHSA-xxjr-mmjv-4gpg', // lodash - transitive
  'GHSA-3ppc-4f35-3m26', // minimatch - transitive
  'GHSA-7r86-cg39-jmmj', // minimatch - transitive
  'GHSA-23c5-xmqv-rm74', // minimatch - transitive
  'GHSA-2328-f5f3-gj25', // node-forge - transitive
  'GHSA-q67f-28xg-22rw', // node-forge - transitive
  'GHSA-5m6q-g25r-mvwx', // node-forge - transitive
  'GHSA-ppp5-5v6c-4jwp', // node-forge - transitive
  'GHSA-37ch-88jc-xwx2', // path-to-regexp - transitive
  'GHSA-3v7f-55p6-f55p', // picomatch - transitive
  'GHSA-c2c7-rcm5-vvqj', // picomatch - transitive
  'GHSA-2j2x-hqr9-3h42', // react-router - transitive
  'GHSA-mw96-cpmx-2vgc', // rollup - transitive
  'GHSA-5c6j-r48x-rmvq', // serialize-javascript - transitive
  'GHSA-qj8w-gfj5-8c6v', // serialize-javascript - transitive
  'GHSA-w7jw-789q-3m8p', // shell-quote - transitive
  'GHSA-xpqw-6gx7-v673', // svgo - transitive
  'GHSA-qpx9-hpmf-5gmw', // underscore - transitive
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
