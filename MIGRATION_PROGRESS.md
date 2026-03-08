# Oxc Migration Progress

## Performance

| Mode | Wall time | Speedup |
|------|-----------|---------|
| ESLint only | ~6.1s | baseline |
| **Hybrid (`--oxc --git`)** | **~1.5s** | **4x faster** |

## Architecture

```
lintroll --oxc --git .
|
+-- [parallel] oxfmt -> oxlint
|   +-- oxfmt (programmatic format() API, inline options)
|   +-- oxlint -c #oxlint-config (306 rules)
|       +-- 213 native Rust rules
|       +-- 93 JS plugin rules (4 plugins)
|
+-- [parallel] ESLint (slim, lazy-loaded)
    +-- JSON (jsonc, package-json)
    +-- YAML (yml)
```

## Source Structure

```
src/oxlint/                         # oxlint config (built by pkgroll)
  index.ts                          # Main config composition → dist/oxlint/index.mjs
  rules/
    eslint.ts                       # ESLint core rules
    typescript.ts                   # TypeScript extension rules
    imports.ts                      # import plugin rules
    unicorn.ts                      # unicorn overrides
    regexp.ts                       # regexp recommended config
    node.ts                         # Node.js rules
    plugins.ts                      # lintroll combined plugin rules
  overrides.ts                      # File-specific overrides
  ignores.ts                        # Shared ignore patterns

src/custom-rules/                   # oxlint JS plugins
  combined-plugin.ts                # Bundles all custom rules → dist/custom-rules/combined-plugin.cjs
  eslint-gap-plugin.ts              # 11 ESLint builtinRules wrapper
  prefer-arrow-functions/index.ts   # Reused by both ESLint and oxlint configs

src/cli/
  utils/oxfmt.ts                    # Programmatic oxfmt API (inline options, no config file)
  utils/oxlint.ts                   # oxlint subprocess wrapper
  get-non-js-config.ts              # Slim ESLint config for JSON/YAML
  index.ts                          # CLI orchestration
```

## Package.json Integration

```jsonc
{
	"imports": {
		"#oxlint-config": {
			"development": "./src/oxlint/index.ts",
			"default": "./dist/oxlint/index.mjs",
		},
		"#oxlint-combined-plugin": {
			"development": "./src/custom-rules/combined-plugin.ts",
			"default": "./dist/custom-rules/combined-plugin.cjs",
		},
	},
	"files": [
		"dist",
		"skills",
	],   // No source files shipped
}
```

## JS Plugins (4 entries, 93 rules)

| Plugin | Rules | Notes |
|--------|-------|-------|
| eslint-plugin-regexp | 60 | npm package, resolved by name |
| eslint-plugin-n | 15 | npm package, aliased as "n" |
| eslint-plugin-unicorn | 1 | prevent-abbreviations (uses context.on() API) |
| combined-plugin | 17 | eslint-comments (4) + no-use-extend-native (1) + ESLint gap (11) + prefer-arrow-functions (1) |

## CI Status
- All 157 tests pass (Ubuntu + Windows)
- Lint passes with 0 errors
- PR #116 (draft)
