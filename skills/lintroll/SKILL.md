---
name: lintroll
description: Opinionated ESLint configuration and CLI for TypeScript, Vue, React, JSON, YAML, and Markdown. Use when linting code, fixing style issues, or configuring ESLint in projects using lintroll.
---

# Lintroll

Batteries-included ESLint with 12+ plugins for TypeScript, Vue, React, JSON, YAML, and Markdown.

## Quick Reference

| Command | Description |
|---------|-------------|
| `lintroll .` | Lint current directory |
| `lintroll . --fix` | Auto-fix issues |
| `lintroll . --cache` | Cache for performance |
| `lintroll --staged` | Lint only staged files |
| `lintroll --node` | Enable Node.js rules |
| `lintroll --quiet` | Errors only (no warnings) |

## Style Defaults

| Setting | Value |
|---------|-------|
| Indentation | Tabs |
| Quotes | Single |
| Semicolons | Always |
| Line length | 100 chars |
| Trailing commas | Multiline only |
| Functions | Arrow preferred |

## CLI Flags

```bash
# Common usage
lintroll .                          # Lint directory
lintroll . --fix                    # Auto-fix
lintroll . --fix --cache            # Fix with caching

# Git integration
lintroll --staged --fix             # Pre-commit hook
lintroll --git                      # Only tracked files

# Node.js rules
lintroll . --node                   # Enable for all files
lintroll . --node=./scripts         # Enable for specific paths

# Abbreviation exceptions
lintroll . --allow-abbreviation db --allow-abbreviation env
```

## ESLint Config

Simple setup:

```js
// eslint.config.js
export { default } from 'lintroll'
```

Custom setup:

```js
// eslint.config.ts
import { defineConfig, pvtnbr } from 'lintroll'

export default defineConfig([
    {
        ignores: ['tests/fixtures/**/*']
    },
    ...pvtnbr({
        node: true,
        allowAbbreviations: {
            exactWords: ['i', 'j'],
            substrings: ['db', 'env']
        }
    })
])
```

## Rules That Require Action

### Prefer Arrow Functions

```ts
// ❌ Bad
function getData() {
    return fetch('/api')
}

async function processItems(items) {
    return items.map(transform)
}

// ✅ Good
const getData = () => fetch('/api')

const processItems = async (items) => items.map(transform)
```

Traditional functions are only needed for:
- `this`, `arguments`, `super`, `new.target`
- Generators (`function*`)
- Hoisting (called before definition)

### No Abbreviations

```ts
// ❌ Bad
const args = []
const db = createConnection()
const env = process.env
const pkg = require('./package.json')
const temp = getTempValue()

// ✅ Good
const arguments_ = []       // Use full word + underscore if reserved
const database = createConnection()
const environment = process.env
const packageJson = require('./package.json')
const temporary = getTempValue()
```

Loop indices `i`, `j` are always allowed. Add more with `--allow-abbreviation`.

### Type Imports

```ts
// ❌ Bad
import { User, createUser } from './user'

// ✅ Good
import type { User } from './user'
import { createUser } from './user'
```

### Type over Interface

```ts
// ❌ Bad
interface User {
    name: string
}

// ✅ Good
type User = {
    name: string
}
```

### No `any`

```ts
// ❌ Bad
const data: any = response.json()

// ✅ Good
const data: unknown = response.json()
```

### Unused Variables

```ts
// ❌ Bad
const unused = getValue()  // Error: defined but never used

// ✅ Good - prefix with underscore
const _unused = getValue()
```

## Auto-Detection

| Feature | Detection |
|---------|-----------|
| Vue.js | `*.vue` files present |
| TypeScript | `tsconfig.json` present |
| Node.js | `.cjs`, `.mts`, `scripts/**`, `bin` entries |

Vue rules apply automatically when `.vue` files exist—no config needed.

## Ignored by Default

- `node_modules/**`, `dist/**`, `vendor/**`
- `package-lock.json`, `pnpm-lock.yaml`
- `*.min.js`, `.vitepress`
- `CLAUDE.md`, `copilot.json`

## Common Gotchas

### Abbreviations in `.d.ts`

Abbreviation rules are disabled in `.d.ts` files since they follow standard conventions.

### TypeScript Extensions in Imports

By default, `.ts` extensions are not allowed in imports:

```ts
// ❌ Bad
import { foo } from './utils.ts'

// ✅ Good
import { foo } from './utils.js'
```

Unless `tsconfig.json` has `allowImportingTsExtensions: true`.

### Pre-commit Hook Setup

```bash
# lint-staged config
lintroll --staged --fix
```

### React PascalCase

React component files must use PascalCase:

```
// ❌ Bad
user-profile.tsx

// ✅ Good
UserProfile.tsx
UserProfile.spec.tsx  // .spec allowed
```

## JSON/YAML Formatting

package.json keys are auto-sorted:
`name → version → description → ... → scripts → dependencies → devDependencies`

Uses tabs, trailing commas, spaces around braces: `{ "key": "value" }`.

## Options Reference

```ts
type Options = {
    cwd?: string                              // Working directory
    node?: boolean | string[]                 // Node.js rules
    allowAbbreviations?: {
        exactWords?: string[]                 // Full match: ['i', 'j']
        substrings?: string[]                 // Partial match: ['db', 'env']
    }
}
```
