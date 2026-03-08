# Oxc Migration Progress

## Performance

| Mode | Wall time | Speedup |
|------|-----------|---------|
| ESLint only (`--eslint-only`) | ~6.1s | baseline |
| **Hybrid (default)** | **~1.4s** | **4.4x faster** |
| Hybrid src/ only (no JSON/YAML) | ~1.2s | 5x faster |

### Breakdown
- oxfmt: ~350ms (format check)
- oxlint: ~1000ms (306 rules: 213 native + 93 JS plugin)
- ESLint slim: ~400ms (JSON/YAML only, lazy-loaded)

## Implementation (28 commits)

### New files
| File | Purpose |
|------|---------|
| `.oxfmtrc.json` | Editor integration only (CLI uses programmatic API) |
| `.oxlintrc.json` | 306 rules (213 native + 93 JS plugin from 4 plugins) |
| `src/cli/utils/oxfmt.ts` | oxfmt programmatic API wrapper (no config file needed) |
| `src/cli/utils/oxlint.ts` | oxlint subprocess wrapper with error handling |
| `src/cli/get-non-js-config.ts` | Slim ESLint config (JSON/YAML only) |
| `src/custom-rules/oxlint-plugin.cjs` | Ported prefer-arrow-functions |
| `src/custom-rules/combined-plugin.cjs` | Consolidates eslint-comments, no-use-extend-native, 11 ESLint core gap rules |
| `src/custom-rules/eslint-gap-plugin.cjs` | Wraps ESLint builtinRules (standalone, also used by combined-plugin) |

### Modified files
| File | Change |
|------|--------|
| `src/cli/index.ts` | Hybrid CLI orchestration, lazy ESLint, auto-git detection |
| `package.json` | Added oxlint, oxfmt dependencies |

## Features
- Auto-detects git repos for hybrid mode (no `--git` flag needed)
- `--eslint-only` flag for full backward compatibility
- `--fix` mode: oxfmt formats, oxlint fixes, ESLint fixes (all tools)
- `--quiet`, `--ignore-pattern` forwarded to oxlint
- Per-tool timing output
- Zero rule gaps (306 rules)
- All 157 existing tests pass
- Zero oxlint errors on src/
- Config/lock files excluded from ESLint pass

## JS Plugins (4 entries, 93 rules)

| Plugin | Rules | Notes |
|--------|-------|-------|
| eslint-plugin-regexp | 60 | Regexp best practices |
| eslint-plugin-n | 15 | Node.js rules |
| eslint-plugin-unicorn | 1 | prevent-abbreviations (needs context.on() API, can't inline) |
| combined-plugin.cjs | 17 | eslint-comments (4) + no-use-extend-native (1) + ESLint core gap (11) + prefer-arrow-functions (1) |

## Remaining Limitations
- `import/no-extraneous-dependencies` — stalled oxlint PR #15703
- `import/no-useless-path-segments` — stalled oxlint PR #14569
- Markdown code block linting — use `--eslint-only`
- `--allowAbbreviation` CLI flag not forwarded to oxlint (static config)
- `--node` CLI flag not forwarded to oxlint (n/ rules always active)
- Formatting style differs from ESLint @stylistic (Prettier-style via oxfmt)

## CI Status
- All 157 tests pass (Ubuntu + Windows)
- Lint passes with 0 errors
- 35 commits on feat/oxc-migration branch
- PR #116 (draft)

## Next Steps (for merging)
1. Apply oxfmt formatting to codebase (`lintroll --oxc --git --fix .`)
2. Commit as "style: adopt oxfmt formatting" + add to `.git-blame-ignore-revs`
3. Switch `pnpm lint` to `--oxc --git` mode
4. Remove `@stylistic/eslint-plugin` from ESLint config (or keep for `--eslint-only` compat)
5. Consider making `--oxc` the default (drop `--eslint-only` fallback)

## Future Opportunities
- Contributing gap rules to native oxlint would save ~760ms JS plugin overhead
- oxlint `--cache` support (not available yet)
