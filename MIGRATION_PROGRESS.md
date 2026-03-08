# Oxc Migration Progress

## Performance

| Mode | Wall time | Speedup |
|------|-----------|---------|
| ESLint only | ~6.1s | baseline |
| **Hybrid (`--oxc --git`)** | **~1.5s** | **4x faster** |

### Breakdown (hybrid mode)
- oxfmt: ~450ms (programmatic API, no config file)
- oxlint: ~1100ms (306 rules via oxlint.config.ts)
- ESLint slim: ~400ms (JSON/YAML only, lazy-loaded)
- All three run in parallel

## Architecture

```
lintroll --oxc --git .
|
+-- [parallel] oxfmt -> oxlint
|   +-- oxfmt (programmatic format() API)
|   +-- oxlint -c oxlint.config.ts
|       +-- 213 native Rust rules
|       +-- 93 JS plugin rules (4 plugins)
|
+-- [parallel] ESLint (slim, lazy-loaded)
    +-- JSON (jsonc, package-json)
    +-- YAML (yml)
```

## Config Files

| File | Format | Shipped | Notes |
|------|--------|---------|-------|
| `oxlint.config.ts` | TypeScript | Yes | Type-checked via defineConfig(), split into src/oxlint/ modules |
| `.oxfmtrc.json` | JSON | No | Editor integration only — CLI uses programmatic API with inline options |
| `src/oxlint/` | TypeScript | Yes | Rule modules with JSDoc comments |
| `src/custom-rules/*.cjs` | CJS | Yes | JS plugins for oxlint |

### oxlint config structure
```
oxlint.config.ts                    # Main composition (imports + defineConfig)
src/oxlint/
  rules/
    eslint.ts                       # ESLint core rules (confusing globals, shadow allow list)
    typescript.ts                   # TypeScript extension rules
    imports.ts                      # import plugin rules
    unicorn.ts                      # unicorn overrides with rationale
    regexp.ts                       # regexp recommended config
    node.ts                         # Node.js rules via eslint-plugin-n
    plugins.ts                      # lintroll combined plugin + prevent-abbreviations
  overrides.ts                      # File-specific rule overrides
  ignores.ts                        # Shared ignore patterns
```

## JS Plugins (4 entries, 93 rules)

| Plugin | Rules | Notes |
|--------|-------|-------|
| eslint-plugin-regexp | 60 | Regexp best practices |
| eslint-plugin-n | 15 | Node.js rules (aliased as "n") |
| eslint-plugin-unicorn | 1 | prevent-abbreviations (uses context.on() API) |
| combined-plugin.cjs | 17 | eslint-comments (4) + no-use-extend-native (1) + ESLint gap (11) + prefer-arrow-functions (1) |

## Remaining Limitations
- `import/no-extraneous-dependencies` — stalled oxlint PR #15703
- `import/no-useless-path-segments` — stalled oxlint PR #14569
- Markdown code block linting — use `--eslint-only`
- `--allowAbbreviation` CLI flag — static config in oxlint, not dynamic
- Formatting: oxfmt uses Prettier-style (arrowParens: avoid), differs from @stylistic

## CI Status
- All 157 tests pass (Ubuntu + Windows)
- Lint passes with 0 errors
- PR #116 (draft)
