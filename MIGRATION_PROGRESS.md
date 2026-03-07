# Oxc Migration Progress

## Benchmarks

### Baseline (ESLint only)
- `node -C development ./src/cli/index.ts --git .`
- **7.3s** on 112 JS/TS files + 34 non-JS files (146 total)
- 114 warnings, 0 errors

### Hybrid v1 (oxfmt + oxlint + ESLint for non-JS)
- oxfmt: 435ms (format check on all files)
- oxlint: 384ms (lint 112 JS/TS files, 214 rules)
- ESLint: 1810ms (lint 34 non-JS files — JSON, YAML, MD)
- **Total: 4.6s** (37% faster)
- Bottleneck: ESLint startup for non-JS files still ~1.8s

### Raw tool benchmarks (no wrapper overhead)
- `oxlint .`: 14ms on 112 files with 93 default rules
- `oxlint .` (with config): 145ms on 112 files with 214 rules
- `oxfmt --check .`: 375ms on 154 files

## Done

- [x] Installed oxlint and oxfmt
- [x] Created `.oxfmtrc.json` matching lintroll's tab/single-quote/semicolon style
- [x] Created `.oxlintrc.json` with all available rules mapped from ESLint config
- [x] Modified CLI to orchestrate: oxfmt → oxlint → ESLint (non-JS only)
- [x] Added `--eslint-only` flag for legacy mode
- [x] File categorization: JS/TS → oxfmt+oxlint, JSON/YAML/MD → ESLint
- [x] Timing output showing per-tool breakdown

## TODO

- [ ] Run ESLint step in parallel with oxfmt+oxlint (currently sequential)
- [ ] Verify oxlint rule option compatibility for complex rules (prevent-abbreviations, no-shadow, etc.)
- [ ] Test `--fix` mode end-to-end
- [ ] Handle directory arguments (currently requires --git for file list)
- [ ] Suppress oxfmt formatting issues that conflict with lintroll's markdown code block style
- [ ] Add oxlint JS plugins for gap rules (regexp, eslint-comments, etc.)
- [ ] Port pvtnbr/prefer-arrow-functions to oxlint JS plugin format
- [ ] Update tests
- [ ] Benchmark on larger codebases (tsx, pkgroll, etc.)

## Ideas

- ESLint-for-non-JS takes 1.8s. This is the new bottleneck. Could we:
  - Lazy-load ESLint only when non-JS files exist?
  - Use oxfmt for JSON/YAML formatting and skip ESLint for formatting-only JSON?
  - Consider keeping ESLint as the last step and only for files that actually need it?

- oxlint's `import/no-cycle` is reportedly very fast (7s for 126K files). Should benchmark vs eslint-plugin-import-x.

- The --git flag is critical for the hybrid approach because we need individual file paths to categorize. Directory arguments without --git fall through to raw tool invocation.

## Rule gaps (not in oxlint, not handled by JS plugins yet)

### ESLint core (not in oxlint)
- `camelcase` — no oxlint equivalent
- `no-implicit-globals` — not in oxlint
- `no-octal-escape` — not in oxlint
- `no-restricted-exports` — not in oxlint
- `no-restricted-properties` — not in oxlint
- `no-undef-init` — not in oxlint
- `no-unreachable-loop` — not in oxlint
- `object-shorthand` — not in oxlint
- `one-var` — not in oxlint
- `prefer-arrow-callback` — not in oxlint, no PR
- `prefer-regex-literals` — not in oxlint

### Stylistic (dropped, not in oxlint, not in oxfmt)
- `no-mixed-operators` — deliberately removed from oxlint
- `spaced-comment` — deliberately removed from oxlint

### Import (stalled PRs)
- `import/no-extraneous-dependencies` — PR #15703 stalled
- `import/no-useless-path-segments` — PR #14569 stalled
- `import/no-unresolved` — in oxlint but no custom resolver support
- `import/order` — in oxlint but limited group config

### Full plugins (need JS plugins)
- eslint-plugin-regexp (68 rules) — deliberately removed from oxlint, use JS plugin
- eslint-plugin-n (node rules) — 14 native, ~15 missing
- @eslint-community/eslint-plugin-eslint-comments
- eslint-plugin-no-use-extend-native
