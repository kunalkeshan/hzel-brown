# Contributing to Hzel Brown

Thank you for your interest in contributing to Hzel Brown! We welcome contributions from the community to help improve this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Branch Naming Conventions](#branch-naming-conventions)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Questions or Issues](#questions-or-issues)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and collaborative environment. Please be considerate and constructive in your interactions with other contributors.

## Getting Started

1. **Fork the repository** to your GitHub account
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/hzel-brown.git
   cd hzel-brown
   ```
3. **Add the upstream repository**:
   ```bash
   git remote add upstream https://github.com/kunalkeshan/hzel-brown.git
   ```
4. **Install dependencies**:
   ```bash
   pnpm install
   ```
5. **Set up environment variables** (see [README.md](README.md#environment-variables))
6. **Start the development server**:
   ```bash
   pnpm dev
   ```

## Development Workflow

1. **Sync your fork** with the upstream repository before starting work:
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create a new branch** for your changes (see [Branch Naming Conventions](#branch-naming-conventions))

3. **Make your changes** following the [Coding Standards](#coding-standards)

4. **Test your changes** thoroughly:
   - Ensure the application builds successfully: `pnpm build`
   - Run the linter: `pnpm lint`
   - Test all affected functionality manually

5. **Commit your changes** using [Conventional Commits](#commit-message-guidelines)

6. **Push to your fork** and create a pull request

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for commit messages. This helps maintain a clear and standardized commit history.

### Commit Message Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes only
- **style**: Code style changes (formatting, missing semi-colons, etc.)
- **refactor**: Code changes that neither fix a bug nor add a feature
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Changes to build process, dependencies, or auxiliary tools
- **ci**: Changes to CI/CD configuration

### Examples

```bash
# Feature
feat: add allergen filter to menu page

# Bug fix
fix: resolve cart total calculation error

# Documentation
docs: update installation instructions in README

# Refactoring with scope
refactor(cart): simplify item quantity update logic

# Breaking change
feat!: redesign menu item schema

BREAKING CHANGE: menuItem type now requires 'category' field
```

### Best Practices

- Use the imperative mood ("add feature" not "added feature")
- Keep the description concise (50 characters or less)
- Use the body to explain *what* and *why*, not *how*
- Reference issues and pull requests when relevant (e.g., "Closes #123")

## Branch Naming Conventions

Use descriptive branch names that indicate the purpose of your changes:

### Format

```
<type>/<short-description>
```

### Types

- **feature/**: New features or enhancements
- **fix/**: Bug fixes
- **docs/**: Documentation updates
- **refactor/**: Code refactoring
- **style/**: Style/formatting changes
- **test/**: Test additions or modifications
- **chore/**: Maintenance tasks

### Examples

```bash
feature/add-category-filter
fix/cart-quantity-update
docs/update-contributing-guide
refactor/simplify-menu-queries
style/format-components
chore/update-dependencies
```

### Best Practices

- Use lowercase letters
- Use hyphens to separate words
- Keep it short but descriptive
- Avoid special characters

## Pull Request Process

1. **Ensure your code meets the requirements**:
   - The application builds successfully (`pnpm build`)
   - All linting checks pass (`pnpm lint`)
   - Your changes work as expected
   - No unrelated changes are included

2. **Create a clear pull request**:
   - Use a descriptive title that summarizes the changes
   - Provide a detailed description of what changes were made and why
   - Reference any related issues (e.g., "Closes #123", "Relates to #456")
   - Include screenshots or GIFs for UI changes

3. **Pull request guidelines**:
   - PRs should be **clear and to the point** - explain what you're changing and why
   - PRs should provide **actual value** - avoid trivial or unnecessary changes
   - Avoid **vague descriptions** - be specific about what your changes do
   - Keep PRs focused on a single concern when possible

4. **Review process**:
   - Wait for a maintainer to review your PR
   - Be responsive to feedback and questions
   - Make requested changes in new commits (don't force push unless asked)
   - Once approved, a maintainer will merge your PR

## Coding Standards

### General Guidelines

- Follow the existing code style and conventions
- Write clear, self-documenting code
- Add comments for complex logic
- Keep functions small and focused
- Use meaningful variable and function names

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid using `any` - use proper types or `unknown`
- Leverage type inference when appropriate

### React

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Follow React best practices for performance

### Styling

- Use Tailwind CSS utility classes
- Follow the existing component structure
- Ensure responsive design for all screen sizes
- Test on multiple devices when possible

### File Organization

- Place components in appropriate directories
- Co-locate related files (components, styles, tests)
- Use index files for cleaner imports
- Follow the existing project structure

## Questions or Issues

If you have questions or need help:

- Check the [README.md](README.md) for setup and usage instructions
- Search existing [GitHub Issues](https://github.com/kunalkeshan/hzel-brown/issues) for similar questions
- Open a new issue if your question hasn't been addressed
- For other inquiries, contact the repository owner

---

Thank you for contributing to Hzel Brown! Your efforts help make this project better for everyone.
