# Oxc Migration Analysis for lintroll

Thorough audit of whether lintroll can adopt oxlint (linter) and oxfmt (formatter) from the Oxc project, what we'd gain, what we'd lose, and what's uncertain.

---

## Executive Summary

lintroll currently bundles 15 ESLint plugins into a single opinionated config + CLI. Oxc offers two tools that overlap significantly:

- **oxlint** — Rust linter, 50-100x faster than ESLint, 695 built-in rules across 15 plugins
- **oxfmt** — Rust formatter, 30-45x faster than Prettier, 100% Prettier JS/TS conformance

**The gap is much smaller than initially expected.** Most "missing" ESLint core rules already exist in oxlint. The real blockers are non-JS file types (JSON, YAML, Markdown) and a handful of import rules. oxlint's JS plugin system can bridge the remaining gaps by loading existing ESLint plugins directly.

### Proposed architecture

```
lintroll .
├── [1] oxfmt                              (format all files)
├── [2] oxlint + JS plugins                (lint JS/TS — native + plugin rules)
└── [3] eslint (if JSON/YAML/MD/Vue exist) (lint non-JS files only)
```

Step 3 only runs when non-JS files are detected, and only with the subset of ESLint configs needed for those file types.

---

## Part 1: oxfmt (Formatter)

### What oxfmt replaces

oxfmt replaces the entire `@stylistic/eslint-plugin` config (`src/configs/stylistic.ts`) — 53 rules covering indentation, spacing, quotes, semicolons, brackets, etc.

### lintroll's style settings mapped to oxfmt config

```json
{
    "$schema": "./node_modules/oxfmt/configuration_schema.json",
    "printWidth": 100,
    "tabWidth": 1,
    "useTabs": true,
    "semi": true,
    "singleQuote": true,
    "jsxSingleQuote": false,
    "trailingComma": "all",
    "bracketSpacing": true,
    "bracketSameLine": false,
    "arrowParens": "as-needed",
    "endOfLine": "lf",
    "quoteProps": "as-needed",
    "insertFinalNewline": true,
    "singleAttributePerLine": false
}
```

**Note on `arrowParens`**: lintroll uses `@stylistic/arrow-parens: ['error', 'as-needed', { requireForBlockBody: true }]`. oxfmt's `"avoid"` option matches Prettier's behavior (omit parens for single params), but **does not support `requireForBlockBody`**. This means `x => x + 1` stays unwrapped (fine) but `x => { return x; }` also stays unwrapped (lintroll currently requires parens here). This is a minor behavioral difference.

### Rules fully covered by oxfmt (~50)

All whitespace, spacing, indentation, quote, semicolon, comma, and bracket rules. These can be completely dropped:

`array-bracket-newline`, `array-bracket-spacing`, `array-element-newline`, `arrow-parens` (partial), `arrow-spacing`, `block-spacing`, `brace-style`, `comma-dangle`, `comma-spacing`, `comma-style`, `computed-property-spacing`, `dot-location`, `eol-last`, `function-call-spacing`, `function-call-argument-newline`, `function-paren-newline`, `generator-star-spacing`, `implicit-arrow-linebreak`, `indent`, `key-spacing`, `keyword-spacing`, `linebreak-style`, `multiline-ternary`, `new-parens`, `newline-per-chained-call`, `no-extra-semi`, `no-floating-decimal`, `no-mixed-spaces-and-tabs`, `no-multi-spaces`, `no-multiple-empty-lines`, `no-trailing-spaces`, `no-whitespace-before-property`, `object-curly-newline`, `object-curly-spacing`, `object-property-newline`, `quote-props`, `quotes`, `rest-spread-spacing`, `semi`, `semi-spacing`, `semi-style`, `space-before-blocks`, `space-before-function-paren`, `space-in-parens`, `space-infix-ops`, `space-unary-ops`, `switch-colon-spacing`, `template-curly-spacing`, `template-tag-spacing`, `wrap-iife`, `yield-star-spacing`, `member-delimiter-style`, `jsx-quotes`, `jsx-indent-props`

### Rules NOT covered by oxfmt (linter concerns)

These 8 rules enforce patterns a formatter can't detect. They become candidates for oxlint JS plugins or can be dropped:

| Rule | Severity | Verdict |
|------|----------|---------|
| `no-mixed-operators` | error | **JS plugin** via `@stylistic/eslint-plugin` — deliberately removed from oxlint native (#479) |
| `max-statements-per-line` | warn | **JS plugin** or drop |
| `spaced-comment` | error | **JS plugin** or drop — requested as oxfmt feature ([#16377](https://github.com/oxc-project/oxc/issues/16377)) |
| `lines-around-comment` | error | Drop — cosmetic blank line enforcement |
| `lines-between-class-members` | error | Drop — cosmetic blank line enforcement |
| `padding-line-between-statements` | error | Drop — only enforces `'use strict'` padding, rare in ESM |
| `no-confusing-arrow` | error | Drop — low value with `allowParens: true` |
| `one-var-declaration-per-line` | error | Drop — **redundant** with `one-var: ['error', 'never']` |

### oxfmt verdict

**High value, low risk.** Eliminates ~50 ESLint rules and the `@stylistic/eslint-plugin` dependency. For the 2-3 rules worth keeping (`no-mixed-operators`, `spaced-comment`), load `@stylistic/eslint-plugin` as an oxlint JS plugin.

---

## Part 2: oxlint (Linter)

### Updated rule coverage (post-research)

Many rules initially assumed missing are actually **already implemented** in oxlint. Here's the corrected status based on GitHub issues [#479](https://github.com/oxc-project/oxc/issues/479) and [#1117](https://github.com/oxc-project/oxc/issues/1117):

#### ESLint core rules — corrections

| Rule | Previous assumption | Actual status |
|------|-------------------|---------------|
| `no-eq-null` | Not in oxlint | **Implemented** (tracked in #479) |
| `vars-on-top` | Not in oxlint | **Implemented** (tracked in #479, TS declare fix merged) |
| `prefer-destructuring` | Not in oxlint | **Implemented** (tracked in #479, auto-fixer merged) |
| `func-style` | Not in oxlint | **Implemented** (tracked in #479, pending fix) |
| `func-names` | Not in oxlint | **Implemented** (tracked in #479, reserved keyword fix merged) |
| `prefer-arrow-callback` | Not in oxlint | **Not implemented** — TODO in #479, no PR |
| `camelcase` | Not in oxlint | Needs verification |
| `complexity` | Assumed missing | **Implemented** |
| `prefer-promise-reject-errors` | Not in oxlint | Needs verification |

#### Import rules — corrections

| Rule | Previous assumption | Actual status |
|------|-------------------|---------------|
| `import/max-dependencies` | Not in oxlint | **Implemented** (bug fix merged in [#19270](https://github.com/oxc-project/oxc/pull/19270)) |
| `import/no-dynamic-require` | Not in oxlint | **Implemented** |
| `import/no-named-default` | Not in oxlint | **Implemented** |
| `import/no-amd` | Not in oxlint | **Implemented** (perf improvement merged) |
| `import/no-extraneous-dependencies` | Not in oxlint | **Not implemented** — stalled PR [#15703](https://github.com/oxc-project/oxc/pull/15703) |
| `import/no-useless-path-segments` | Not in oxlint | **Not implemented** — stalled PR [#14569](https://github.com/oxc-project/oxc/pull/14569) |

#### eslint-plugin-regexp

**Deliberately removed from oxlint** ([#16493](https://github.com/oxc-project/oxc/pull/16493)). After 6 months with zero rules implemented, the built-in regexp plugin support was dropped. Maintainer position: "these rules can be implemented via JS plugins."

The `oxc_regular_expression` crate (regex parser) exists, but no lint rules use it. The recommended path is loading `eslint-plugin-regexp` as an oxlint JS plugin.

### Remaining gaps for JS/TS linting

After corrections, the **actual** gaps for JS/TS files are much smaller:

#### Must port or bridge (blockers for dropping ESLint on JS/TS)

| Rule/Plugin | Strategy | Effort |
|-------------|----------|--------|
| `eslint-plugin-regexp` (68 rules) | **JS plugin** — load existing ESLint plugin | Config only |
| `import/no-extraneous-dependencies` | **Contribute** — stalled PR [#15703](https://github.com/oxc-project/oxc/pull/15703) exists | Pick up PR |
| `import/no-useless-path-segments` | **Contribute** — stalled PR [#14569](https://github.com/oxc-project/oxc/pull/14569) exists | Pick up PR |
| `prefer-arrow-callback` | **Contribute** or JS plugin | Small rule |
| `pvtnbr/prefer-arrow-functions` | **JS plugin** — port custom rule | ~100 lines |
| `@stylistic` gap rules (2-3) | **JS plugin** — load `@stylistic/eslint-plugin` | Config only |
| `eslint-plugin-no-use-extend-native` | **JS plugin** — load existing ESLint plugin | Config only |
| `@eslint-community/eslint-plugin-eslint-comments` | **JS plugin** — load existing ESLint plugin | Config only |
| `eslint-plugin-n` (Node rules) | **JS plugin** — load existing ESLint plugin | Config only |

#### Non-JS files (keep in ESLint, no oxlint path)

| Plugin | File types | Notes |
|--------|-----------|-------|
| `eslint-plugin-jsonc` | `.json`, `.jsonc`, `.json5` | Custom sort-keys, strict formatting. oxlint has no JSON support, JS plugins can't use custom parsers |
| `eslint-plugin-package-json` | `package.json` | Semantic validation. Same parser limitation |
| `eslint-plugin-yml` | `.yml`, `.yaml` | Requires yaml-eslint-parser. Same parser limitation |
| `@eslint/markdown` | `.md` | Code block extraction + linting. No oxlint equivalent |
| `eslint-plugin-vue` (template rules) | `.vue` | Template linting. oxlint only does `<script>` blocks, JS plugins can't use custom parsers |

---

## Part 3: oxlint JS Plugin System (Research Findings)

### Architecture

Hybrid Rust/JS bridge via NAPI:
1. Rust parses file → serializes AST to shared memory buffer
2. JS plugin receives AST as typed array (zero-copy)
3. Visitor functions compiled once during plugin load
4. Single AST pass for all rules (native + JS)
5. Diagnostics returned as JSON → Rust applies fixes

### Supported ESLint APIs

The JS plugin system is **comprehensive** — nearly full ESLint v9 compatibility:

- `context.report()` with `message`, `messageId`, `node`, `loc`, `fix()`, `suggest`
- Full fixer API: `remove`, `removeRange`, `replaceText`, `replaceTextRange`, `insertTextBefore/After`
- `context.sourceCode`: `.text`, `.ast`, `.lines`, token methods, comment methods
- Scope analysis via `@typescript-eslint/scope-manager`
- CSS selectors via esquery (`:matches`, `:not`, `:has`, child/sibling combinators)
- Rule metadata: `fixable`, `hasSuggestions`, `messages`, `type`
- `context.options`, `context.settings`, `context.filename`, `context.cwd`

### Not supported

- **Custom parsers** — only oxlint's built-in parser (this is why JSON/YAML/Vue template plugins can't work)
- `context.languageOptions.parser.parse()` — throws "not implemented"
- `context.markVariableAsUsed()` — throws "not implemented"
- Type-aware rules — no TypeScript type information
- ESLint v8-era APIs (mostly)

### Performance

- JS plugins run single-threaded (not parallelized like native Rust rules)
- Still 15x faster than multi-threaded ESLint (per oxc benchmarks)
- Overhead: serialization across NAPI boundary per file
- Visitor compilation cached per plugin load
- Real-world: 200ms on 1 file with 97 rules (native + JS in single pass)

### Configuration

```json
{
    "jsPlugins": [
        "eslint-plugin-regexp",
        { "name": "stylistic",
            "specifier": "@stylistic/eslint-plugin" },
        { "name": "eslint-comments",
            "specifier": "@eslint-community/eslint-plugin-eslint-comments" },
        "eslint-plugin-no-use-extend-native",
        "eslint-plugin-n"
    ],
    "rules": {
        "stylistic/no-mixed-operators": "error",
        "stylistic/spaced-comment": "error"
    }
}
```

**Alias required** when plugin name conflicts with a built-in oxlint plugin (e.g., `eslint-plugin-n` → alias needed since oxlint has native `node` plugin).

### Known issue

[#19192](https://github.com/oxc-project/oxc/issues/19192): A user tried loading `eslint-plugin-import-x` (for `no-extraneous-dependencies`) as a JS plugin and it failed. This suggests complex import-resolution plugins may have issues. Simpler plugins (`eslint-plugin-regexp`, `@stylistic/eslint-plugin`) are more likely to work.

---

## Part 4: Revised Strategy

### The new lintroll CLI flow

```
lintroll [flags] [paths...]
│
├─ [step 1] oxfmt (format)
│   Run: oxfmt --check (CI) or oxfmt (fix mode)
│   Covers: all formatting for JS/TS/JSON/YAML/MD
│
├─ [step 2] oxlint + JS plugins (lint JS/TS)
│   Sequential to step 1 (lint formatted code)
│   Native rules: eslint core, typescript, unicorn, promise, import, react, vue (scripts)
│   JS plugins: regexp, @stylistic (2-3 rules), eslint-comments, no-use-extend-native, n (node)
│   Custom JS plugin: pvtnbr/prefer-arrow-functions
│
└─ [step 3] eslint (lint non-JS files) — parallel to steps 1+2
    Only spawned if JSON/YAML/MD/Vue files detected in target paths
    Configs: json.ts, package-json.ts, yml.ts, markdown.ts, vue.ts (template rules only)
    Uses eslint-plugin-oxlint to disable rules oxlint already covers in .vue files
```

### What this eliminates from ESLint

| Removed from ESLint | Replacement |
|---------------------|-------------|
| `@stylistic/eslint-plugin` (53 rules) | oxfmt |
| `@eslint/js` core rules (~80 rules) | oxlint native |
| `@typescript-eslint` (~30 rules) | oxlint native |
| `eslint-plugin-unicorn` (~50 rules) | oxlint native |
| `eslint-plugin-promise` (~8 rules) | oxlint native |
| `eslint-plugin-import-x` (most rules) | oxlint native import plugin |
| `eslint-plugin-react` + hooks | oxlint native react plugin |
| `eslint-plugin-regexp` (68 rules) | oxlint JS plugin |
| `eslint-plugin-n` (Node rules) | oxlint JS plugin |
| `eslint-plugin-eslint-comments` | oxlint JS plugin |
| `eslint-plugin-no-use-extend-native` | oxlint JS plugin |
| `pvtnbr/prefer-arrow-functions` | oxlint JS plugin (ported) |

### What stays in ESLint (non-JS files only)

| Stays in ESLint | Why |
|-----------------|-----|
| `eslint-plugin-jsonc` | Custom parser, oxlint can't load it |
| `eslint-plugin-package-json` | Custom parser |
| `eslint-plugin-yml` | Custom parser (yaml-eslint-parser) |
| `@eslint/markdown` | Custom processor, code block extraction |
| `eslint-plugin-vue` (template rules) | Custom parser (vue-eslint-parser) |

### Contributions to oxlint (unblock native speed)

Two stalled PRs that would close the biggest remaining native gaps:

| Rule | PR | Action |
|------|-----|--------|
| `import/no-extraneous-dependencies` | [#15703](https://github.com/oxc-project/oxc/pull/15703) | Pick up or co-author |
| `import/no-useless-path-segments` | [#14569](https://github.com/oxc-project/oxc/pull/14569) | Pick up or co-author |
| `prefer-arrow-callback` | None | New contribution (small) |

---

## Part 5: Open Questions

### Must verify before implementation

1. **`eslint-plugin-regexp` as JS plugin** — Does it load and work? It uses standard ESLint APIs (no custom parser), so it should, but needs testing. This is the single biggest JS plugin dependency.

2. **`eslint-plugin-n` as JS plugin** — Node rules use `context.settings.node.version` and file resolution. Do these work through the JS plugin bridge?

3. **`unicorn/prevent-abbreviations` config parity** — Does oxlint's native implementation support `allowList`, `replacements`, and `ignore` (regex) options with the same behavior? This is lintroll's most complex rule configuration.

4. **`no-shadow` allow list** — lintroll dynamically detects installed packages (manten, tasuku) and adds their callback names to the allow list. oxlint config is static — the dynamic detection would be lost. Acceptable?

5. **Import resolution** — lintroll uses a custom `pkg-maps-resolver` for package.json exports/imports maps. oxlint uses `--tsconfig` for path aliases. Would `import/no-unresolved` produce false positives without the custom resolver?

6. **`no-restricted-globals` with confusing-browser-globals** — lintroll passes ~70 globals from the `confusing-browser-globals` package. This list would need to be embedded in `.oxlintrc.json`. Doable but verbose.

7. **Conditional Node.js rules** — lintroll enables node rules conditionally based on `options.node` and detects `package.json` type field / `.nvmrc`. oxlint's overrides system supports file-glob-based rules, but dynamic behavior would be lost.

8. **oxfmt `arrowParens: requireForBlockBody`** — lintroll requires parens for block-body arrows. oxfmt doesn't support this sub-option. Acceptable style change?

9. **JSON formatting** — lintroll enforces one-property-per-line and one-element-per-line in all JSON. oxfmt uses printWidth-based wrapping. Visible style change across JSON files.

### Strategic questions

10. **lintroll's new identity** — lintroll becomes an orchestrator of oxfmt + oxlint + ESLint (for gaps). The ESLint config export (`export { default } from 'lintroll'`) would need to change or be deprecated. What's the migration path for users who import the config?

11. **Dependency on preview features** — JS plugins are "preview" in oxlint. Is it acceptable to depend on a preview API for production linting?

12. **Performance validation** — Need to benchmark the 3-tool orchestration vs current single-ESLint approach. The expectation is faster, but the ESLint-for-non-JS step still has startup cost.

---

## Part 6: Implementation Plan

### Phase 1: oxfmt for formatting

1. Add `oxfmt` dependency
2. Create `.oxfmtrc.json` with config above
3. Remove all `@stylistic/eslint-plugin` rules from `stylistic.ts`
4. Update CLI to run `oxfmt` before linting
5. Remove `@stylistic/eslint-plugin` dependency

**Risk**: Low. oxfmt is beta with 100% Prettier conformance.

### Phase 2: oxlint for JS/TS linting

1. Add `oxlint` dependency
2. Create `.oxlintrc.json` with native rule config (eslint core, typescript, unicorn, promise, import, react)
3. Configure JS plugins: `eslint-plugin-regexp`, `eslint-plugin-n`, `@eslint-community/eslint-plugin-eslint-comments`, `eslint-plugin-no-use-extend-native`
4. Port `pvtnbr/prefer-arrow-functions` to oxlint JS plugin format
5. Update CLI to run `oxlint` instead of ESLint for JS/TS files
6. Remove ESLint plugins that oxlint now covers from the ESLint config

**Risk**: Medium. JS plugin compatibility needs testing. Fallback: keep ESLint for any plugin that fails.

### Phase 3: Slim ESLint for non-JS only

1. Detect non-JS files in target paths (JSON/YAML/MD/Vue)
2. Only spawn ESLint if non-JS files exist
3. Slim ESLint config to only: `json.ts`, `package-json.ts`, `yml.ts`, `markdown.ts`, `vue.ts`
4. Use `eslint-plugin-oxlint` to disable overlap in Vue files

**Risk**: Low. ESLint continues to do what it's good at — non-JS file linting.

### Phase 4: Contribute to oxlint (optional, improves native speed)

1. Pick up stalled `import/no-extraneous-dependencies` PR ([#15703](https://github.com/oxc-project/oxc/pull/15703))
2. Pick up stalled `import/no-useless-path-segments` PR ([#14569](https://github.com/oxc-project/oxc/pull/14569))
3. Contribute `prefer-arrow-callback` (small rule, no existing work)
4. As these land, move rules from JS plugin to native config

---

## Appendix: Dependency changes

### Current (30 runtime deps)

All 15 ESLint plugins + parsers + utilities.

### After full migration

**Added:**
- `oxfmt` — formatter
- `oxlint` — linter
- `eslint-plugin-oxlint` — disables ESLint overlap in Vue files

**Removed:**
- `@stylistic/eslint-plugin` — replaced by oxfmt

**Kept but reduced scope (non-JS only):**
- `eslint` — only for JSON/YAML/MD/Vue templates
- `eslint-plugin-jsonc` — JSON linting
- `eslint-plugin-package-json` — package.json validation
- `eslint-plugin-yml` — YAML linting
- `@eslint/markdown` — Markdown code block linting
- `eslint-plugin-vue` + `vue-eslint-parser` — Vue template linting
- `@typescript-eslint/parser` — needed for Vue template TS support

**Moved to oxlint JS plugins (still installed, loaded by oxlint instead of ESLint):**
- `eslint-plugin-regexp`
- `eslint-plugin-n`
- `@eslint-community/eslint-plugin-eslint-comments`
- `eslint-plugin-no-use-extend-native`

**No longer loaded by ESLint (covered by oxlint native):**
- `@eslint/js`
- `@typescript-eslint/eslint-plugin`
- `eslint-plugin-unicorn`
- `eslint-plugin-promise`
- `eslint-plugin-import-x` (most rules)
- `eslint-plugin-react`
- `eslint-plugin-react-hooks`
- `confusing-browser-globals` (embedded in oxlint config)
- `globals` (oxlint has built-in env support)
