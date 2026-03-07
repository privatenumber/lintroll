# Oxc Migration Progress

## Benchmarks

### Baseline (ESLint only, `--eslint-only --git .`)
- **~5.9s wall** on 112 JS/TS + 34 non-JS files (146 total)
- 124 problems (1 error, 123 warnings)

### Hybrid v2 (parallel: oxfmt+oxlint || ESLint for non-JS)
- oxfmt: ~1000ms (format check, includes spawn overhead)
- oxlint: ~700ms (lint 112 JS/TS files, 214 rules, includes spawn overhead)
- ESLint: ~1700ms (lint 34 non-JS files — JSON, YAML, MD)
- **~3.2s wall** (1.8x faster) — limited by ESLint startup
- Internal timing: ~1.7s (oxfmt+oxlint overlap with ESLint)

### Raw tool benchmarks (no wrapper overhead)
- `oxlint .`: 14ms on 112 files with 93 default rules
- `oxlint .` (with config): 145ms on 112 files with 214 rules
- `oxfmt --check .`: 375ms on 154 files

### Summary
| Mode | Wall time | Internal | Speedup |
|------|-----------|----------|---------|
| ESLint only | ~5.9s | ~5.9s | baseline |
| Hybrid | ~3.2s | ~1.7s | **1.8x wall, 3.5x internal** |

## Done

- [x] Installed oxlint and oxfmt
- [x] Created `.oxfmtrc.json` matching lintroll's tab/single-quote/semicolon style
- [x] Created `.oxlintrc.json` with 214 native rules mapped from ESLint config
- [x] Modified CLI to orchestrate: oxfmt → oxlint (sequential) || ESLint (parallel)
- [x] Added `--eslint-only` flag for legacy mode
- [x] File categorization: JS/TS → oxfmt+oxlint, JSON/YAML/MD → ESLint
- [x] Timing output showing per-tool breakdown
- [x] Parallel execution: ESLint runs alongside oxfmt+oxlint
- [x] Verified all 157 existing tests pass
- [x] `--fix` mode works end-to-end (oxfmt formats, oxlint fixes, ESLint fixes)
- [x] Created draft PR #116
- [x] Added eslint-plugin-regexp as JS plugin (60 rules) — VERIFIED WORKING
- [x] Added @eslint-community/eslint-plugin-eslint-comments as JS plugin (4 rules)
- [x] Added eslint-plugin-no-use-extend-native as JS plugin (1 rule)
- [x] Total: 279 rules (214 native + 65 JS plugin) in ~485ms

## TODO

### High priority
- [ ] Verify oxlint rule option compatibility for complex rules (prevent-abbreviations, no-shadow allow lists, etc.)
- [x] ~~Add oxlint JS plugins for gap rules (eslint-plugin-regexp, eslint-comments)~~
- [ ] Add eslint-plugin-n as JS plugin for Node.js rules
- [ ] Port pvtnbr/prefer-arrow-functions to oxlint JS plugin format
- [ ] Compare oxlint output vs ESLint output for same files (rule parity check)

### Medium priority
- [ ] Handle directory arguments without --git (currently works but file categorization only with explicit paths)
- [ ] Suppress oxfmt formatting issues that conflict with lintroll's markdown code block style
- [ ] Remove `@stylistic/eslint-plugin` from ESLint config (since oxfmt handles formatting)
- [ ] Benchmark on larger codebases (tsx, pkgroll, etc.)

### Low priority
- [ ] Add oxlint-specific CLI tests
- [ ] Handle `--cache` flag for oxlint (uses `--cache` natively)
- [ ] Consider lazy ESLint loading (only import when non-JS files detected)

## Rule Gaps

### ESLint core (not in oxlint, 11 rules)
- `camelcase`, `no-implicit-globals`, `no-octal-escape`, `no-restricted-exports`
- `no-restricted-properties`, `no-undef-init`, `no-unreachable-loop`
- `object-shorthand`, `one-var`, `prefer-arrow-callback`, `prefer-regex-literals`

### Stylistic (deliberately removed from oxlint)
- `no-mixed-operators` — use JS plugin or drop
- `spaced-comment` — use JS plugin or drop

### Import (2 stalled PRs)
- `import/no-extraneous-dependencies` — PR #15703 stalled
- `import/no-useless-path-segments` — PR #14569 stalled

### Full plugins — RESOLVED via JS plugins
- ~~eslint-plugin-regexp (60 rules)~~ → JS plugin, verified working
- ~~@eslint-community/eslint-plugin-eslint-comments~~ → JS plugin, verified working
- ~~eslint-plugin-no-use-extend-native~~ → JS plugin, verified working
- eslint-plugin-n (node rules) — not yet tested as JS plugin

## Ideas

- ESLint-for-non-JS takes 1.7s — this is the new bottleneck. Node startup (~1.5s) dominates.
  - Could lazy-load ESLint and skip it entirely when no non-JS files are in the target
  - Use `oxfmt` for JSON/YAML formatting (it handles these) and only use ESLint for sort-keys/validation

- oxlint `import/no-cycle` benchmark: reportedly 7s for 126K files vs minutes with eslint-plugin-import-x

- The spawn overhead for oxfmt/oxlint (~200-400ms each) is mostly process start. For watch mode, both tools offer LSP servers that could be kept running.
