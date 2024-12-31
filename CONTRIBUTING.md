# Contributing to DevToolbox

First off, thank you for considering contributing to DevToolbox! It's people like you that make DevToolbox such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* Use a clear and descriptive title
* Describe the exact steps which reproduce the problem
* Provide specific examples to demonstrate the steps
* Describe the behavior you observed after following the steps
* Explain which behavior you expected to see instead and why
* Include screenshots if possible

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* Use a clear and descriptive title
* Provide a step-by-step description of the suggested enhancement
* Provide specific examples to demonstrate the steps
* Describe the current behavior and explain which behavior you expected to see instead
* Explain why this enhancement would be useful

### Pull Requests

* Fork the repo and create your branch from `main`
* If you've added code that should be tested, add tests
* Ensure the test suite passes
* Make sure your code lints
* Create a pull request

## Development Process

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Run tests: `npm test`
5. Commit your changes: `git commit -m 'Add some feature'`
6. Push to the branch: `git push origin feature/your-feature-name`
7. Submit a pull request

### Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification. This leads to more readable messages that are easy to follow when looking through the project history.

Examples:
* feat: add new JSON validation feature
* fix: resolve issue with text case converter
* docs: update README with new features
* style: format code with prettier
* refactor: restructure JSON formatter logic
* test: add tests for regex tester
* chore: update dependencies

### JavaScript/TypeScript Style Guide

* Use TypeScript for all new code
* Follow the ESLint configuration
* Use Prettier for code formatting
* Write JSDoc comments for functions and complex code blocks

### Testing

* Write unit tests for all new features
* Ensure all tests pass before submitting a PR
* Aim for high test coverage
* Use Jest for testing

### Documentation

* Update the README.md if needed
* Add JSDoc comments for new functions
* Update the CHANGELOG.md with your changes
* Create/update API documentation if needed

## Project Structure

```
devtools/
├── frontend/           # React frontend
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── contexts/   # React contexts
│   │   ├── hooks/     # Custom hooks
│   │   ├── lib/       # Utility functions
│   │   └── ui/        # UI components
│   └── tests/         # Frontend tests
├── backend/           # Node.js backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   └── middleware/
│   └── tests/         # Backend tests
└── docs/             # Documentation
```

## Getting Help

If you need help, you can:
* Check the documentation
* Create an issue
* Reach out to the maintainers

## Recognition

Contributors will be recognized in the README.md file and the project's contributors list.

Thank you for contributing to DevToolbox! 🚀 