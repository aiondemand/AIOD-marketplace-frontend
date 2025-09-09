# Git Hooks Setup

This project uses [Husky](https://typicode.github.io/husky/) to manage Git hooks for maintaining code quality and enforcing conventional commits.

## Hooks Configured

### Pre-commit Hook

- **Purpose**: Runs ESLint to check code quality before allowing commits
- **Location**: `.husky/pre-commit`
- **Command**: `npm run lint`

### Commit Message Hook

- **Purpose**: Validates that commit messages follow the [Conventional Commits](https://www.conventionalcommits.org/) specification
- **Location**: `.husky/commit-msg`
- **Tool**: Uses [@commitlint/config-conventional](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional)

## Conventional Commit Format

Commit messages must follow this format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `build`: Changes that affect the build system or external dependencies
- `ci`: Changes to our CI configuration files and scripts
- `chore`: Other changes that don't modify src or test files
- `revert`: Reverts a previous commit

### Examples

```bash
feat: add user authentication
fix: resolve memory leak in data processing
docs: update installation instructions
style: format code according to style guide
refactor: extract user validation logic
```

## Setup Commands

The following commands were used to set up this configuration:

```bash
# Install commitlint dependencies
npm install @commitlint/cli @commitlint/config-conventional --save-dev

# Initialize husky
npx husky install

# Add pre-commit hook for linting
npx husky add .husky/pre-commit "npm run lint"

# Add commit-msg hook for conventional commits
npx husky add .husky/commit-msg "npx --no -- commitlint --edit \$1"
```

## Troubleshooting

### If hooks are not running

1. Ensure you're in a git repository
2. Make sure Husky is installed: `npx husky install`
3. Check that hook files have execute permissions
4. Verify the `.husky` directory is not in `.gitignore`

### Testing the setup

```bash
# Test commitlint with a valid message
echo "feat: test message" | npx commitlint

# Test commitlint with an invalid message
echo "invalid message" | npx commitlint

# Test linting
npm run lint
```

## Configuration Files

- `commitlint.config.js`: Commitlint configuration
- `.husky/pre-commit`: Pre-commit hook script
- `.husky/commit-msg`: Commit message validation hook script
