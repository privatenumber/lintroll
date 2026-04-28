import type { DummyRuleMap } from 'oxlint';

/**
 * Unicorn rule overrides — matches src/configs/unicorn.ts
 *
 * oxlint includes unicorn/recommended as a native plugin.
 * These are the overrides from lintroll's ESLint config.
 */
export const unicornRules: DummyRuleMap = {
	// Disable in favor of eslint-plugin-regexp
	'unicorn/better-regex': 'off',

	// Too many false positives with inline functions in tests
	'unicorn/consistent-function-scoping': 'off',

	'unicorn/no-array-for-each': 'off',

	// for-of + iterators requires transpilation (downlevelIteration)
	'unicorn/no-for-loop': 'off',

	// Conflicts with eslint-plugin-n/no-deprecated-api
	'unicorn/no-new-buffer': 'off',

	// Too many cases where 3rd party library expects null
	'unicorn/no-null': 'off',

	// Conflicts with eslint-plugin-n/no-process-exit
	'unicorn/no-process-exit': 'off',

	// ts-node can't load TypeScript's compilation of export-from
	'unicorn/prefer-export-from': 'off',

	'unicorn/prefer-json-parse-buffer': 'off',
	'unicorn/prefer-module': 'off',
	'unicorn/prefer-node-protocol': 'off',

	// Good rule but autofix can break low-level libraries
	'unicorn/prefer-spread': 'off',

	'unicorn/prefer-ternary': 'off',
	'unicorn/prefer-top-level-await': 'off',

	// Changes formatting of inline snapshots in tests
	'unicorn/template-indent': 'off',

	// False positives on string properties named 'size' or 'length'
	'unicorn/explicit-length-check': 'off',

	// Disabled in favor of eslint-comments/no-unlimited-disable
	'unicorn/no-abusive-eslint-disable': 'off',

	// Disabled: suggests toSorted() which is ES2023
	'unicorn/no-array-sort': 'off',
};
