# Development Guide

## Standard Documentation Commands

Use the following commands for local documentation workflows:

```bash
# Install all dependencies (including docs)
uv sync

# Build docs statically
uv run mkdocs build

# Serve docs with live reload
uv run mkdocs serve
```

## Frontend Quality Gates

Run the following checks before opening a pull request:

```bash
npm run lint
npm run test:ci
npm run test:e2e
```

## Additional Checks

```bash
npm run format:check
npm run lint:markdown
npm run lint:json
npm run lint:yaml
npm run security:audit
```
