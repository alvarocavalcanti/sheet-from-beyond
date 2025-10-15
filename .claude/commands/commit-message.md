# Commit Message Command

Generate a commit message for the staged changes.

## Requirements

- Don't mention Claude or AI assistance in the commit message
- Use conventional commits format: `type(scope): description`
- Be concise, maximum of two paragraphs
- Focus on "why" not "what"
- Use imperative mood (add, fix, update)

## Commit Types

- **feat**: New feature or functionality
- **fix**: Bug fix  
- **update**: Enhancement to existing feature
- **refactor**: Code refactoring without functional changes
- **test**: Adding or updating tests
- **docs**: Documentation changes
- **style**: Code style/formatting changes

## Scope Examples

- **activation**: Activation API and related logic
- **licensing**: License management and validation
- **ui**: User interface components
- **api**: API client and backend changes
- **types**: TypeScript interface updates
- **performance-for-woo**: Performance for Woo specific changes

## Format Template

```text
type(scope): description

Optional body explaining the reasoning and context behind the change.
Include any important details about implementation or impact.
```

## Example Commit Messages

```text
feat(activation): add fallback logic for existing activation errors

Implement automatic retry with patchActivation when postActivation fails due to existing activation. This handles race conditions and improves user experience by eliminating "already exists" error scenarios.
```

```text
fix(licensing): correct production environment license counting

Fix license calculation to only count activations from production environments instead of all environments, ensuring dev/staging don't consume production licenses.
```

```text
update(types): enhance PerformancePackForWoo interface with production environments

Add productionEnvironments array to support license management filtering by production environment names.
```
