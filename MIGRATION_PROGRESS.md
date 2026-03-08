# Oxc Migration Progress

## Benchmarks

### Baseline (ESLint only, `--eslint-only --git .`)
- **~6.7s wall** on 112 JS/TS + 34 non-JS files (162 total)

### Hybrid v5 (lazy ESLint + parallel: oxfmt+oxlint || slim ESLint)
- oxfmt: ~350ms (format check)
- oxlint: ~1000ms (lint JS/TS files, 306 rules with 8 JS plugins)
- ESLint (slim, lazy-loaded): ~400ms (lint JSON/YAML only)
- **~1.5s wall, ~1.4s internal** (3.9x faster wall, 4.8x internal)

### Summary
| Mode | Wall time | Internal | Speedup |
|------|-----------|----------|---------|
| ESLint only | ~6.7s | ~6.7s | baseline |
| **Hybrid v5 (lazy ESLint)** | **~1.5s** | **~1.4s** | **4.5x wall** |
| Hybrid src/ only (no JSON/YAML) | ~1.2s | ~1.1s | 6x wall |

## Implementation Complete

- [x] `.oxfmtrc.json` — tabs, single quotes, semicolons
- [x] `.oxlintrc.json` — 306 rules (213 native + 93 JS plugin from 8 plugins)
- [x] CLI orchestration: oxfmt -> oxlint (sequential) || ESLint (parallel)
- [x] `--eslint-only` flag for backward compatibility
- [x] File categorization: JS/TS -> oxfmt+oxlint, JSON/YAML -> slim ESLint
- [x] Per-tool timing output
- [x] Parallel execution with lazy ESLint loading
- [x] All 157 existing tests pass
- [x] `--fix` mode works end-to-end
- [x] Draft PR #116
- [x] `--ignore-pattern` forwarded to oxlint
- [x] Error handling for config/internal errors

## JS Plugins (8 total, 93 rules)

| Plugin | Rules | Purpose |
|--------|-------|---------|
| eslint-plugin-regexp | 60 | Regexp best practices |
| eslint-plugin-n | 15 | Node.js rules |
| @eslint-community/eslint-plugin-eslint-comments | 4 | ESLint directive rules |
| eslint-plugin-no-use-extend-native | 1 | Native prototype protection |
| eslint-plugin-unicorn (prevent-abbreviations) | 1 | Abbreviation enforcement |
| pvtnbr/prefer-arrow-functions (ported to CJS) | 1 | Custom arrow function rule |
| eslint-gap-plugin (ESLint core wrapper) | 11 | Missing ESLint core rules |

## Rule Gap Status: ZERO GAPS

All ESLint core rules that were missing from oxlint are now covered via
the `eslint-gap-plugin.cjs` wrapper which extracts rules from ESLint's
`builtinRules` and exposes them as an oxlint JS plugin:

`camelcase`, `no-implicit-globals`, `no-octal-escape`, `no-restricted-exports`,
`no-restricted-properties`, `no-undef-init`, `no-unreachable-loop`,
`object-shorthand`, `one-var`, `prefer-arrow-callback`, `prefer-regex-literals`

### Remaining limitations (by design)
- `import/no-extraneous-dependencies` — requires resolver context, stalled PR #15703
- `import/no-useless-path-segments` — stalled PR #14569
- Markdown code block linting — skipped in hybrid mode (use `--eslint-only`)
- `no-mixed-operators`, `spaced-comment` — dropped (stylistic, handled by oxfmt)

## Architecture

```
lintroll --git .
|
+-- [parallel branch 1: oxfmt -> oxlint]    ~1.1s total
|   +-- oxfmt (format check/fix)            ~350ms
|   +-- oxlint                              ~1.0s
|       +-- 213 native Rust rules
|       +-- 93 JS plugin rules (8 plugins)
|
+-- [parallel branch 2: slim eslint]        ~400ms (lazy-loaded)
|   +-- JSON (jsonc, package-json)
|   +-- YAML (yml)
|
+-- Without --git/--staged: falls through to ESLint-only mode
```

## Files Changed

### New files
- `.oxfmtrc.json` — oxfmt configuration
- `.oxlintrc.json` — oxlint configuration with 306 rules
- `src/cli/utils/oxfmt.ts` — oxfmt subprocess wrapper
- `src/cli/utils/oxlint.ts` — oxlint subprocess wrapper
- `src/cli/get-non-js-config.ts` — slim ESLint config for JSON/YAML
- `src/custom-rules/oxlint-plugin.cjs` — ported prefer-arrow-functions
- `src/custom-rules/eslint-gap-plugin.cjs` — ESLint core rules wrapper

### Modified files
- `src/cli/index.ts` — hybrid CLI orchestration
- `package.json` — added oxlint, oxfmt dependencies
