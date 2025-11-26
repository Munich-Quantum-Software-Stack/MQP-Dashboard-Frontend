# 🤝 Contributing to MQP Dashboard Frontend

Thank you for your interest in contributing to our project!
We welcome any and all contributions.

## 📜 Code of Conduct

Please note that all participants are required to adhere to our
[Code of Conduct](./CODE_OF_CONDUCT.md).

## ❓ How Can I Contribute?

Using the following [Issue Tracker][issues] you can:

* Report bugs in the project.
* Propose new features or improvements.
* Write code and documentation.

[issues]: https://github.com/Munich-Quantum-Software-Stack/MQSS-Benchmarking-Framework/issues/new?template=contact_mqp_dashboard_frontend.yml

## 🐛 Submitting a Bug Report

Before submitting, please search the issues to see if your bug has been
reported.

1. **Check Environment:** Note your OS and browser version.
2. **Provide Steps:** Describe the exact, minimal steps to reproduce the bug.
3. **Expected vs. Actual:** Clearly state what you expected to happen and
   what actually happened.

## 💻 Code Contribution Workflow

1. **Fork** the repo and clone your fork.
2. **Run the app in development mode:** `npm start`. This will take care of
   installing all necessary dependencies and make the dashboard available
   at [http://localhost:3000](http://localhost:3000).
3. **Create a branch:**
   * when fixing a bug: `git switch -c fix/<BUG>`
   * when introducing a feature: `git switch -c feat/<FEATURE>`
4. **Make changes and commit:** Use clear, descriptive commit messages.
5. **Run tests and linting:** `npm test`
6. **Push your branch** and open a Pull Request.

## ✅ Pull Request Guidelines

* **Title:** Be descriptive (e.g., `FEAT: Add dark mode toggle`).
* **Reference Issues:** Add `Closes #XYZ` to the description if it fixes
  an issue.
* **Single Focus:** Keep the PR limited to one concern or feature.
* **Tests:** New features must have corresponding tests.
