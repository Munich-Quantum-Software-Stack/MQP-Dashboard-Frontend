# Getting Started

## Prerequisites

- Node.js >=20 and <25
- npm
- Python 3.11+ (for documentation tooling)
- uv

## Install Dependencies

Install Node.js dependencies:

```bash
npm install
```

Install documentation dependencies:

```bash
uv sync
```

## Run the Frontend

```bash
npm start
```

The application runs at <http://localhost:3000>.

## Build Frontend

```bash
npm run build
```

## Build Documentation

```bash
uv run mkdocs build
```

The generated site is written to build/docs/site.

## Serve Documentation Locally

```bash
uv run mkdocs serve
```

The documentation site is served at <http://localhost:8000>.
