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

## Update User's logo

- There are two places need to be updated:
  - On Landing Page (or Login Page): the logo should have light background color
  - On Top sidebar: here should be a dark version of logo
- Replace draft logo files by your own logos in folder /public/user_logos
- Update information about these logos at /src/data/user_logos.json

## 🤝 Contributing

Thank you for your interest in contributing to our project!

Please refer to the [CONTRIBUTING](./CONTRIBUTING.md) guidelines.
