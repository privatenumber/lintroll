# Oxc Migration Progress

## Benchmarks

### Baseline (ESLint only, `--eslint-only --git .`)
- **~5.9s wall** on 112 JS/TS + 34 non-JS files (146 total)

### Hybrid v5 (lazy ESLint + parallel: oxfmt+oxlint || slim ESLint)
- oxfmt: ~350ms (format check)
- oxlint: ~1000ms (lint JS/TS files, 295 rules with 6 JS plugins)
- ESLint (slim, lazy-loaded): ~400ms (lint JSON/YAML only)
- **~1.5s wall, ~1.4s internal** (3.9x faster)

### Performance breakdown
| Component | Time | Notes |
|-----------|------|-------|
| oxlint native (213 rules) | 233ms | Rust-only, no JS plugins |
| oxlint JS plugins (82 rules) | ~870ms | 6 ESLint plugins via NAPI bridge |
| oxfmt | ~200ms | Format check |
| ESLint slim (JSON/YAML) | ~100ms | Only jsonc, package-json, yml plugins |
| Node.js startup overhead | ~2.2s | Unavoidable per-invocation |

### Summary
| Mode | Wall time | Internal | Speedup |
|------|-----------|----------|---------|
| ESLint only | ~5.9s | ~5.9s | baseline |
| Hybrid v3 (full ESLint) | ~4.2s | ~2.2s | 1.4x wall |
| Hybrid v4 (slim ESLint) | ~3.5s | ~1.3s | 1.7x wall |
| **Hybrid v5 (lazy ESLint)** | **~1.5s** | **~1.4s** | **3.9x wall, 4.2x internal** |
| Hybrid v5 (cold cache) | ~2.4s | ~2.3s | 2.5x wall |
| Theoretical (native only) | ~1.0s | ~0.5s | 12x internal |

## Done

- [x] Installed oxlint and oxfmt
- [x] Created `.oxfmtrc.json` matching lintroll's tab/single-quote/semicolon style
- [x] Created `.oxlintrc.json` with 295 rules (214 native + 81 JS plugin)
- [x] Modified CLI to orchestrate: oxfmt -> oxlint || ESLint (parallel)
- [x] Added `--eslint-only` flag for legacy mode
- [x] File categorization: JS/TS -> oxfmt+oxlint, JSON/YAML -> slim ESLint
- [x] Timing output per-tool
- [x] All 157 existing tests pass
- [x] `--fix` mode works end-to-end
- [x] Draft PR #116
- [x] eslint-plugin-regexp as JS plugin (60 rules)
- [x] @eslint-community/eslint-plugin-eslint-comments as JS plugin (4 rules)
- [x] eslint-plugin-no-use-extend-native as JS plugin (1 rule)
- [x] eslint-plugin-n as JS plugin (15 Node.js rules)
- [x] eslint-plugin-unicorn as JS plugin (prevent-abbreviations)
- [x] pvtnbr/prefer-arrow-functions ported to oxlint JS plugin (.cjs)
- [x] Slim ESLint config (JSON/YAML only, skips markdown code blocks)
- [x] Disabled import/no-named-as-default-member (oxlint false positives)
- [x] Fixed oxlint-plugin.cjs abbreviation warnings
- [x] Lazy ESLint loading (dynamic import) — 3.5s -> 1.5s wall time
- [x] Forward --ignore-pattern to oxlint
- [x] Improved error handling for oxfmt/oxlint config errors

## JS Plugins Summary

| Plugin | Rules | Purpose |
|--------|-------|---------|
| eslint-plugin-regexp | 60 | Regexp best practices |
| eslint-plugin-n | 15 | Node.js rules |
| @eslint-community/eslint-plugin-eslint-comments | 4 | ESLint directive rules |
| eslint-plugin-no-use-extend-native | 1 | Native prototype protection |
| eslint-plugin-unicorn (prevent-abbreviations) | 1 | Abbreviation enforcement |
| pvtnbr/prefer-arrow-functions | 1 | Custom arrow function rule |
| **Total** | **82** | All via NAPI bridge (~870ms overhead) |

## TODO

### Potential further optimizations
- [ ] Contribute gap rules to native oxlint (would save ~870ms JS plugin overhead)
- [ ] Investigate oxlint `--cache` for incremental runs
- [ ] Consider lazy ESLint loading via dynamic import()

### Nice to have
- [ ] Add oxlint-specific CLI tests
- [ ] Markdown code block linting in hybrid mode (requires full ESLint config)
- [ ] Benchmark on larger codebases

## Rule Gaps (accepted)

### ESLint core not in oxlint (11 rules, zero hits on this codebase)
`camelcase`, `no-implicit-globals`, `no-octal-escape`, `no-restricted-exports`,
`no-restricted-properties`, `no-undef-init`, `no-unreachable-loop`,
`object-shorthand`, `one-var`, `prefer-arrow-callback`, `prefer-regex-literals`

### Stylistic (deliberately removed from oxlint, handled by oxfmt)
`no-mixed-operators`, `spaced-comment`

### Import (2 stalled PRs in oxlint)
`import/no-extraneous-dependencies` (PR #15703), `import/no-useless-path-segments` (PR #14569)

### Markdown code blocks
Skipped in hybrid mode — requires full ESLint config with all JS/TS plugins.
Available via `--eslint-only` mode.

## Architecture

```
lintroll --git .
|
|-- [parallel branch 1: oxfmt -> oxlint]    ~1.1s total
|   |-- oxfmt (format check/fix)            ~200ms
|   |-- oxlint                              ~1.1s
|       |-- 213 native Rust rules           ~233ms
|       |-- 82 JS plugin rules              ~870ms
|           |-- eslint-plugin-regexp (60)
|           |-- eslint-plugin-n (15)
|           |-- eslint-comments (4)
|           |-- no-use-extend-native (1)
|           |-- unicorn-js (1)
|           |-- pvtnbr (1)
|
|-- [parallel branch 2: slim eslint]        ~100ms
|   |-- JSON (jsonc, package-json)
|   |-- YAML (yml)
|
|-- Without --git/--staged: falls through to ESLint-only mode
```
