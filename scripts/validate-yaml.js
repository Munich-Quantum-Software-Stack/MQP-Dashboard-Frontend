#!/usr/bin/env node

const fs = require('fs');
const yaml = require('js-yaml');

const files = process.argv.slice(2);

if (files.length === 0) {
  process.exit(0);
}

let hasError = false;

for (const filePath of files) {
  try {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const raw = fs.readFileSync(filePath, 'utf8');
    yaml.load(raw);
  } catch (error) {
    hasError = true;
    const message = error && error.message ? error.message : 'Unknown YAML parse error.';
    console.error(`[lint:yaml] ${filePath} failed validation: ${message}`);
  }
}

if (hasError) {
  process.exit(1);
}

process.exit(0);
