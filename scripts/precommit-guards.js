#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const LARGE_FILE_THRESHOLD_BYTES = 1024 * 1024; // 1 MB
const TEXT_EXTENSIONS = new Set([
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.json',
  '.md',
  '.scss',
  '.css',
  '.yml',
  '.yaml',
]);
const SCRIPT_EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx']);
const CONSOLE_LOG_PATTERN = /console\.(log|debug)\s*\(/;
const DEBUGGER_PATTERN = /\bdebugger\b/;
const CONFLICT_MARKER_PATTERN = /(<{7}|={7}|>{7})/;
const SELF_PATH = path.normalize('scripts/precommit-guards.js');

function getStagedFiles() {
  try {
    const result = execSync('git diff --cached --name-only --diff-filter=ACM', {
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim();

    if (!result) {
      return [];
    }

    return result
      .split('\n')
      .map((file) => file.trim())
      .filter(Boolean);
  } catch (error) {
    console.error('[precommit-guards] Failed to read staged files.');
    console.error(error.message || error);
    process.exit(1);
  }
}

function hasTextExtension(filePath) {
  return TEXT_EXTENSIONS.has(path.extname(filePath).toLowerCase());
}

function shouldInspectSource(filePath) {
  if (!SCRIPT_EXTENSIONS.has(path.extname(filePath).toLowerCase())) {
    return false;
  }

  const lowerPath = filePath.toLowerCase();
  if (lowerPath.includes('__tests__') || lowerPath.includes('/test/')) {
    return false;
  }

  if (/(\.test|\.spec)\./.test(lowerPath)) {
    return false;
  }

  return true;
}

function inspectFile(filePath) {
  const violations = [];

  if (path.normalize(filePath) === SELF_PATH) {
    return violations;
  }

  let stats;
  try {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    stats = fs.statSync(filePath);
  } catch (error) {
    // File might have been deleted or moved; skip.
    return violations;
  }

  if (!stats.isFile()) {
    return violations;
  }

  if (stats.size > LARGE_FILE_THRESHOLD_BYTES) {
    violations.push(`- ${filePath} exceeds ${Math.round(LARGE_FILE_THRESHOLD_BYTES / 1024)} KB.`);
  }

  const shouldRead = stats.size <= 1024 * 1024 && hasTextExtension(filePath);
  if (!shouldRead) {
    return violations;
  }

  let content;
  try {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    content = fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    violations.push(`- Unable to read ${filePath}: ${error.message}`);
    return violations;
  }

  if (CONFLICT_MARKER_PATTERN.test(content)) {
    violations.push(`- Merge conflict markers detected in ${filePath}.`);
  }

  if (shouldInspectSource(filePath)) {
    if (CONSOLE_LOG_PATTERN.test(content)) {
      violations.push(`- Remove console.log/debug statements from ${filePath}.`);
    }
    if (DEBUGGER_PATTERN.test(content)) {
      violations.push(`- Remove debugger statements from ${filePath}.`);
    }
  }

  return violations;
}

function main() {
  const stagedFiles = getStagedFiles();
  if (stagedFiles.length === 0) {
    process.exit(0);
  }

  const allViolations = stagedFiles.flatMap(inspectFile);

  if (allViolations.length > 0) {
    console.error('\n[precommit-guards] Commit blocked by the following issues:');
    for (const issue of allViolations) {
      console.error(issue);
    }
    console.error('\nPlease address the reported problems and recommit.');
    process.exit(1);
  }

  process.exit(0);
}

main();
