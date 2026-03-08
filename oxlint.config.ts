/**
 * oxlint configuration for lintroll
 *
 * This config mirrors the ESLint config from src/configs/ as closely
 * as possible. Rules not available natively in oxlint are loaded via
 * JS plugins (eslint-plugin-regexp, eslint-plugin-n, etc.) or wrapped
 * from ESLint's builtinRules (combined-plugin.cjs).
 *
 * Architecture:
 *   213 native Rust rules (fast)
 *   + 93 JS plugin rules (via NAPI bridge)
 *   = 306 total rules
 */
/* eslint-disable n/no-unpublished-import */
import { defineConfig } from 'oxlint';
import { eslintRules } from './src/oxlint/rules/eslint.ts';
import { typescriptRules } from './src/oxlint/rules/typescript.ts';
import { importRules } from './src/oxlint/rules/imports.ts';
import { unicornRules } from './src/oxlint/rules/unicorn.ts';
import { regexpRules } from './src/oxlint/rules/regexp.ts';
import { nodeRules } from './src/oxlint/rules/node.ts';
import {
	lintrollPluginRules,
	preventAbbreviationsRule,
} from './src/oxlint/rules/plugins.ts';
import { overrides } from './src/oxlint/overrides.ts';
import { ignorePatterns } from './src/oxlint/ignores.ts';
/* eslint-enable n/no-unpublished-import */

export default defineConfig({
	// Native Rust plugins (fast, parallelized)
	plugins: [
		'import',
		'typescript',
		'unicorn',
		'promise',
		'react',
	],

	// JS plugins loaded via NAPI bridge
	jsPlugins: [
		// Regexp best practices (60 rules)
		'eslint-plugin-regexp',

		// Node.js rules (15 rules) — aliased to avoid conflict with native "node" plugin
		{
			name: 'n',
			specifier: 'eslint-plugin-n',
		},

		// unicorn/prevent-abbreviations — needs full plugin (uses context.on() API)
		{
			name: 'unicorn-js',
			specifier: 'eslint-plugin-unicorn',
		},

		// Combined: eslint-comments, no-use-extend-native, ESLint gap, prefer-arrow-functions
		'./src/custom-rules/combined-plugin.cjs',
	],

	categories: {
		correctness: 'error',
		suspicious: 'warn',
		pedantic: 'off',
		nursery: 'off',
		style: 'off',
		restriction: 'off',
	},

	rules: {
		...eslintRules,
		...typescriptRules,
		...importRules,
		...unicornRules,
		...regexpRules,
		...nodeRules,
		...lintrollPluginRules,
		...preventAbbreviationsRule,

		// Promise rules — matches src/configs/promise.ts
		'promise/always-return': 'off',
		'promise/catch-or-return': ['error', { allowThen: true }],

		// React rules — matches src/configs/react.ts
		'react/react-in-jsx-scope': 'off',
	},

	overrides,
	ignorePatterns,
});
