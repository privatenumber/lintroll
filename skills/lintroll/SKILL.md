---
name: lintroll
description: Opinionated ESLint configuration and CLI for TypeScript, Vue, React, JSON, YAML, and Markdown. Use when linting code, fixing style issues, or configuring ESLint in projects using lintroll.
---

# Lintroll

Batteries-included ESLint with 12+ plugins for TypeScript, Vue, React, JSON, YAML, and Markdown.

## CLI

```bash
lintroll .                          # Lint directory
lintroll . --fix                    # Auto-fix
lintroll . --fix --cache            # Fix with caching
lintroll --git .                    # Only git-tracked files
lintroll --git --fix .              # Fix only tracked files
lintroll --staged --fix             # Pre-commit hook
lintroll . --node                   # Enable Node.js rules
lintroll . --node=./scripts         # Node.js rules for specific paths
lintroll . --quiet                  # Errors only (no warnings)
lintroll . --allow-abbreviation db  # Allow specific abbreviations
```

## Style Rules

| Rule | Enforced style |
|------|---------------|
| Indentation | Tabs |
| Quotes | Single |
| Semicolons | Always |
| Line length | 100 chars max |
| Trailing commas | Multiline only |
| Functions | Arrow (except `this`/`arguments`/generators/hoisting) |
| Types | `type =` over `interface` |
| Type imports | Separate `import type` from value imports |
| No `any` | Use `unknown` and narrow |
| Unused vars | Prefix with `_` (e.g. `_unused`) |
| No abbreviations | `db` → `database`, `env` → `environment`, `pkg` → `packageJson` |
| Import extensions | `.js` not `.ts` (unless `allowImportingTsExtensions: true`) |
| React filenames | PascalCase (`UserProfile.tsx`) |

### Abbreviation Mapping

Common renames enforced by `unicorn/prevent-abbreviations`:

| Abbreviation | Full name |
|-------------|-----------|
| `args` | `arguments_` (reserved word) |
| `db` | `database` |
| `env` | `environment` |
| `pkg` | `packageJson` |
| `temp` | `temporary` |
| `res` | `response` |
| `req` | `request` |
| `dir` | `directory` |
| `err` | `error` |
| `msg` | `message` |

Loop indices `i`, `j` are always allowed. Add more with `--allow-abbreviation`.

## ESLint Config

Zero-config:

```js
// eslint.config.js
export { default } from 'lintroll'
```

Custom:

```js
// eslint.config.ts
import { defineConfig, pvtnbr } from 'lintroll'

export default defineConfig([
    { ignores: ['tests/fixtures/**/*'] },
    ...pvtnbr({
        node: true,
        allowAbbreviations: {
            exactWords: ['i', 'j'],
            substrings: ['db', 'env']
        }
    })
])
```

For full API types, see `node_modules/lintroll/dist/index.d.mts`.

## Auto-Detection

| Feature | Detection |
|---------|-----------|
| Vue.js | `*.vue` files present — rules apply automatically |
| TypeScript | `tsconfig.json` present |
| Node.js | `.cjs`, `.mts`, `scripts/**`, `bin` entries |

## Ignored by Default

- `node_modules/**`, `dist/**`, `vendor/**`
- `package-lock.json`, `pnpm-lock.yaml`
- `*.min.js`, `.vitepress`
- AI assistant files: `CLAUDE.md`, `.claude/`, `copilot.json`, `.cursorrules`

## JSON/YAML

- package.json keys auto-sorted: `name → version → description → ... → scripts → dependencies → devDependencies`
- JSON style: tabs, trailing commas, spaces around braces `{ "key": "value" }`

## Gotchas

- **Abbreviation rules disabled in `.d.ts`** — declaration files follow standard conventions
- **`.ts` extensions in imports** — use `.js` unless tsconfig has `allowImportingTsExtensions: true`
- **Markdown code blocks in `skills/` directories** — automatically ignored (not linted as project code)
