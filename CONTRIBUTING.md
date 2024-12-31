# Contributing to DevToolbox

First off, thank you for considering contributing to DevToolbox! It's people like you that make DevToolbox such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## Development Process

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes following our guidelines
4. Run tests: `npm test`
5. Commit your changes following our commit message format
6. Push to the branch: `git push origin feature/your-feature-name`
7. Submit a pull request

## Coding Guidelines

### General Rules
- Write clean, maintainable, and testable code
- Follow the Single Responsibility Principle
- Keep functions small and focused
- Add appropriate error handling
- Write meaningful comments and documentation
- Follow existing patterns in the codebase

### TypeScript/JavaScript Style
- Use TypeScript for all new code
- Follow the ESLint configuration
- Use Prettier for code formatting
- Write JSDoc comments for functions and complex code blocks
- Use meaningful variable and function names
- Avoid any implicit any types

### React Components
- Use functional components with hooks
- Keep components small and focused
- Use TypeScript interfaces for props
- Implement proper error boundaries
- Follow the project's component structure
- Use ShadcN UI components when possible

### Testing
- Write unit tests for all new features
- Maintain test coverage above 80%
- Test edge cases and error scenarios
- Use meaningful test descriptions
- Follow the existing test patterns

## Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
- `feat(json): add new validation options`
- `fix(uuid): resolve sequential generation issue`
- `docs: update README with new features`
- `style: format code with prettier`
- `test(hash): add tests for SHA-512`

## Project Structure

```
devtools/
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── ui/        # Reusable UI components
│   │   │   └── tools/     # Tool-specific components
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/          # Utility functions
│   │   ├── styles/       # Global styles
│   │   └── types/        # TypeScript types
│   └── tests/            # Frontend tests
├── backend/
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── services/      # Business logic
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Express middleware
│   │   └── utils/         # Utility functions
│   └── tests/            # Backend tests
└── docs/                # Documentation
```

## Feature Implementation Guidelines

1. **Planning**
   - Review existing implementation
   - Consider edge cases
   - Plan for error handling
   - Consider performance implications

2. **Implementation**
   - Follow coding guidelines
   - Add necessary tests
   - Update documentation
   - Consider backwards compatibility

3. **Testing**
   - Run all tests
   - Test edge cases
   - Verify error handling
   - Check performance impact

4. **Documentation**
   - Update relevant documentation
   - Add JSDoc comments
   - Update CHANGELOG.md
   - Add usage examples

## Getting Help

If you need help, you can:
- Check the documentation
- Create an issue
- Join our community discussions
- Reach out to maintainers

## Recognition

Contributors will be recognized in:
- The README.md file
- The GitHub contributors list
- Release notes
- Our community showcase

Thank you for contributing to DevToolbox! 🚀 