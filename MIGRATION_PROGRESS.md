# Oxc Migration Progress

## Benchmarks

### Baseline (ESLint only, `--eslint-only --git .`)
- **~5.9s wall** on 112 JS/TS + 34 non-JS files (146 total)
- 124 problems (1 error, 123 warnings)

### Hybrid v3 (parallel: oxfmt+oxlint || ESLint for non-JS)
- oxfmt: ~1000ms (format check, includes spawn overhead)
- oxlint: ~1100ms (lint 112 JS/TS files, 296 rules, includes spawn overhead)
- ESLint: ~1900ms (lint 34 non-JS files — JSON, YAML, MD)
- **~4.2s wall** (~1.4x faster) — limited by ESLint startup
- Internal timing: ~2.2s (oxfmt+oxlint overlap with ESLint)

### Raw tool benchmarks (no wrapper overhead)
- `oxlint .`: 14ms on 112 files with 93 default rules
- `oxlint .` (with config + JS plugins): 1.1s on 115 files with 296 rules
- `oxfmt --check .`: 375ms on 154 files

### Summary
| Mode | Wall time | Internal | Rules |
|------|-----------|----------|-------|
| ESLint only | ~5.9s | ~5.9s | ~250 |
| Hybrid (no prevent-abbreviations) | ~3.3s | ~1.7s | 280 |
| Hybrid (with all JS plugins) | ~4.2s | ~2.2s | 296 |

Note: unicorn-js plugin (for prevent-abbreviations) adds ~400ms. If perf is critical,
this can be removed since oxlint has most unicorn rules natively.

## Done

- [x] Installed oxlint and oxfmt
- [x] Created `.oxfmtrc.json` matching lintroll's tab/single-quote/semicolon style
- [x] Created `.oxlintrc.json` with 214 native rules mapped from ESLint config
- [x] Modified CLI to orchestrate: oxfmt -> oxlint (sequential) || ESLint (parallel)
- [x] Added `--eslint-only` flag for legacy mode
- [x] File categorization: JS/TS -> oxfmt+oxlint, JSON/YAML/MD -> ESLint
- [x] Timing output showing per-tool breakdown
- [x] Parallel execution: ESLint runs alongside oxfmt+oxlint
- [x] Verified all 157 existing tests pass
- [x] `--fix` mode works end-to-end
- [x] Created draft PR #116
- [x] eslint-plugin-regexp as JS plugin (60 rules)
- [x] @eslint-community/eslint-plugin-eslint-comments as JS plugin (4 rules)
- [x] eslint-plugin-no-use-extend-native as JS plugin (1 rule)
- [x] eslint-plugin-n as JS plugin (15 Node.js rules)
- [x] eslint-plugin-unicorn as JS plugin (prevent-abbreviations with full config)
- [x] pvtnbr/prefer-arrow-functions ported to oxlint JS plugin (.cjs)

## JS Plugins Summary

| Plugin | Rules | Overhead |
|--------|-------|----------|
| eslint-plugin-regexp | 60 | ~260ms |
| @eslint-community/eslint-plugin-eslint-comments | 4 | negligible |
| eslint-plugin-no-use-extend-native | 1 | negligible |
| eslint-plugin-n | 15 | ~100ms |
| eslint-plugin-unicorn (prevent-abbreviations only) | 1 | ~400ms |
| pvtnbr/prefer-arrow-functions | 1 | negligible |
| **Total** | **82** | **~760ms** |

## TODO

### High priority
- [ ] Compare oxlint output vs ESLint output for same files (rule parity check)
- [ ] Remove `@stylistic/eslint-plugin` from ESLint config (oxfmt handles formatting)
- [ ] Handle `import/no-named-as-default-member` false positives in oxlint

### Medium priority
- [ ] Handle directory arguments without --git
- [ ] Suppress oxfmt formatting issues that conflict with lintroll markdown code block style
- [ ] Benchmark on larger codebases (tsx, pkgroll, etc.)

### Low priority
- [ ] Add oxlint-specific CLI tests
- [ ] Handle `--cache` flag for oxlint
- [ ] Consider lazy ESLint loading (only import when non-JS files detected)

## Rule Gaps (remaining)

### ESLint core not in oxlint (11 rules)
- `camelcase`, `no-implicit-globals`, `no-octal-escape`, `no-restricted-exports`
- `no-restricted-properties`, `no-undef-init`, `no-unreachable-loop`
- `object-shorthand`, `one-var`, `prefer-arrow-callback`, `prefer-regex-literals`

These are either low-frequency or have partial overlap with other rules.
Could be loaded as individual JS plugin rules from @eslint/js if needed.

### Stylistic (deliberately removed from oxlint)
- `no-mixed-operators` — drop (readability only)
- `spaced-comment` — drop (cosmetic)

### Import (2 stalled PRs)
- `import/no-extraneous-dependencies` — PR #15703 stalled
- `import/no-useless-path-segments` — PR #14569 stalled

### Known false positives
- `import/no-named-as-default-member` fires on ESLint plugin `.configs` access
  (oxlint behavior differs from eslint-plugin-import-x)

## Architecture

```
lintroll [flags] [paths...]
|
|-- [parallel branch 1: oxfmt -> oxlint]
|   |-- oxfmt (format check/fix)          ~1000ms
|   |-- oxlint (native + JS plugins)      ~1100ms
|       |-- 214 native Rust rules
|       |-- 82 JS plugin rules (6 plugins)
|
|-- [parallel branch 2: eslint]
|   |-- ESLint (non-JS files only)         ~1900ms
|       |-- JSON (jsonc, package-json)
|       |-- YAML (yml)
|       |-- Markdown (code blocks)
|       |-- Vue (template rules)
|
|-- Total wall time: max(branch1, branch2) = ~2.2s internal
```
