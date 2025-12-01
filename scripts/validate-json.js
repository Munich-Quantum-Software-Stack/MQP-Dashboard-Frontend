#!/usr/bin/env node

const fs = require('fs');

const files = process.argv.slice(2);

if (files.length === 0) {
  process.exit(0);
}

let hasError = false;

for (const filePath of files) {
  try {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const raw = fs.readFileSync(filePath, 'utf8');
    JSON.parse(raw);
  } catch (error) {
    hasError = true;
    const message = error && error.message ? error.message : 'Unknown JSON parse error.';
    console.error(`[lint:json] ${filePath} failed validation: ${message}`);
  }
}

if (hasError) {
  process.exit(1);
}

process.exit(0);
