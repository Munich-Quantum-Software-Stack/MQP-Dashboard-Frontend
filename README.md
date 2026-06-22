# MQP Dashboard Frontend

[![CI/CD Pipeline](https://github.com/Munich-Quantum-Software-Stack/MQP-Dashboard-Frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/Munich-Quantum-Software-Stack/MQP-Dashboard-Frontend/actions/workflows/ci.yml)
![Coverage](./.github/badges/coverage.svg)
[![Documentation](https://img.shields.io/badge/DOCUMENTATION-0984CC?style=for-the-badge&logo=readthedocs&logoColor=white)](https://munich-quantum-software-stack.github.io/MQP-Dashboard-Frontend/)

The **MQP Dashboard Frontend** is the React-based web interface for the MQSS
Platform. It provides users with a unified view of quantum resources,
job execution status, budgets, and access tokens.

The frontend is connected to backend services through REST APIs configured via
`REACT_APP_API_ENDPOINT`. In the current codebase, the UI communicates with
endpoints such as `/login`, `/resources`, `/jobs`, and `/tokens` to
authenticate users, display available resources, submit and monitor jobs,
and manage API tokens.

The documentation page linked by the badge above is published from this
`README.md` on every push to `develop`.

## How to Use this Documentation

This documentation gives an implementation-oriented overview of how to run,
test, deploy, and contribute to MQP Dashboard Frontend.

### General Information

- Repository: [MQP Dashboard Frontend](https://github.com/Munich-Quantum-Software-Stack/MQP-Dashboard-Frontend)
- Contribution process: [CONTRIBUTING.md](./CONTRIBUTING.md)
- Community rules: [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)

### Hands-On

- Local development and scripts: [Getting Started](#-getting-started)
- Deployment variants: [Deployment](#-deployment)
- Testing and linting commands: [Quality Gates](#-quality-gates)

## 🎉 Getting Started

### Prerequisites

- Node.js `>=20 <25`
- npm

### Run locally

```sh
npm install
npm start
```

The dashboard will be available at [http://localhost:3000](http://localhost:3000).

Additional runtime modes:

- Test mode: `npm run start:test`
- Production-like mode: `npm run start:production`

## 🚀 Deployment

MQP Dashboard Frontend can be built in three configurations:

- test: `npm run build:test`
- stage: `npm run build:staging`
- production: `npm run build:production`

To serve a test build locally:

```sh
npm run build:test
npm run serve:test
```

## ✅ Quality Gates

Before opening a PR, run:

```sh
npm run lint
npm run test:ci
npm run test:e2e
```

Additional checks available in this repository:

- `npm run format:check`
- `npm run lint:markdown`
- `npm run lint:json`
- `npm run lint:yaml`
- `npm run security:audit`

## 📁 Project Structure (Overview)

- `src/components/Pages/`: main route pages (resources, jobs, tokens, FAQ, etc.)
- `src/components/utils/`: API integration helpers and route utilities
- `src/hooks/`: reusable hooks
- `src/store/`: Redux store slices
- `tests/e2e/`: Playwright end-to-end tests
- `tests/unit/`: unit tests
- `config/linting/`: ESLint, Prettier, Markdown lint, and commit lint
  configuration

## User Logos

If you want to test custom logos locally, place logo files in
`public/user_logos/` and reference them in `src/data/user_logos.json`.

Notes:

- `public/user_logos/` is ignored by the repository to avoid committing large
  or copyrighted files.
- If you need official logos added to the repo, please follow the project's
  contribution process.

### License

[License section](https://github.com/Munich-Quantum-Software-Stack/MQP-Dashboard-Frontend/blob/develop/LICENSE)

Licensed under the Apache License v2.0.

### Commit Message Guidelines

[Commit message guidelines](./CONTRIBUTING.md)

This repository uses Commitlint with `@commitlint/config-conventional`.
Use clear, structured commit messages.

Examples:

```text
<short_author_name>/feat: add JWT authentication
<short_author_name>/fix: resolve docker startup issue
<short_author_name>/docs: update API documentation
```

### Pull Request Process

[Pull request process](./CONTRIBUTING.md#-pull-request-guidelines)

Before submitting a PR:

- Ensure tests pass.
- Ensure lint checks pass.
- Add tests for new functionality.
- Update documentation where needed.

PRs should include:

- Summary of changes.
- Related issue references.
- Screenshots/examples if applicable.

### Coding Standards

[Coding standards](./config/linting/.eslintrc.js)

#### JavaScript / React

- Follow ESLint rules from `react-app`, `security/recommended`,
  and `prettier/recommended`.
- Prefer configured path aliases (`@components`, `@utils`, `@assets`,
  `@hooks`, `@store`, `@data`) over relative parent imports.
- Keep components focused and reusable.
- Keep API communication inside dedicated utilities/hooks.

#### Testing

- Add or update unit tests for behavior changes.
- Add or update Playwright E2E coverage for user-facing flows when relevant.

## 🤝 Contributing

Thank you for your interest in contributing to this project.

Please refer to [CONTRIBUTING.md](./CONTRIBUTING.md) for the full contribution workflow.

## 📚 Project Links

- Codebase: [MQP Dashboard Frontend](https://github.com/Munich-Quantum-Software-Stack/MQP-Dashboard-Frontend)
- Contributing: [CONTRIBUTING.md](./CONTRIBUTING.md)
- Code of Conduct: [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)

## 📬 Contact

[Contact section](https://github.com/Munich-Quantum-Software-Stack/MQSS-Client#-contact)

The development of this project is led by the QCT department at the LRZ and
the QSI department at MQV gGmbH. You can also always reach us at
[mqss@munich-quantum-valley.de](mailto:mqss@munich-quantum-valley.de).
