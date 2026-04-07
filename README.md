# MQP Dashboard Frontend

[![CI/CD Pipeline](https://github.com/Munich-Quantum-Software-Stack/MQP-Dashboard-Frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/Munich-Quantum-Software-Stack/MQP-Dashboard-Frontend/actions/workflows/ci.yml)
![Coverage](./.github/badges/coverage.svg)

This is the repository for MQP Dashboard Frontend MQSS Component, developed in React.

## 🎉 Getting started

To get started in development mode run

```sh
npm start
```

This will install all dependencies and will make available the dashboard at [http://localhost:3000](http://localhost:3000)

## 🚀 Deployment

MQP Dashboard Frontend can be deployed in three configurations:

- test: `npm run build:test`
- stage: `npm run build:stage`
- production: `npm run build`

Deployment scripts are provided to ease this action in a non-development environment.

## User logos

If you want to test custom logos locally, copy the example config and add
your images locally. Do not commit binary logo files.

1. Copy the example config:

    ```sh
    cp src/data/user_logos.example.json \
       src/data/user_logos.json
    ```

2. Place your logo files in `public/user_logos/`.

Notes:
- `public/user_logos/` is ignored by the repository to avoid committing
   large or copyrighted files.
- If you need official logos added to the repo, please follow the
   project's contribution process.

## 🤝 Contributing

Thank you for your interest in contributing to our project!

Please refer to the [CONTRIBUTING](./CONTRIBUTING.md) guidelines.
