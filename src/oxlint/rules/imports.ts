import type { DummyRuleMap } from 'oxlint';

/**
 * Import rules — matches src/configs/imports.ts
 *
 * Note: import/no-extraneous-dependencies and import/no-useless-path-segments
 * are not available in oxlint (stalled PRs #15703, #14569).
 */
export const importRules: DummyRuleMap = {
	'import/export': 'error',
	'import/first': 'error',
	'import/no-absolute-path': 'error',
	'import/no-duplicates': 'error',
	'import/no-mutable-exports': 'error',
	'import/no-named-as-default': 'error',

	// Disabled: oxlint's version has false positives on ESLint plugin .configs access
	'import/no-named-as-default-member': 'off',

	'import/no-named-default': 'error',
	'import/no-self-import': 'error',
	'import/no-webpack-loader-syntax': 'error',
	'import/no-amd': 'error',
	'import/max-dependencies': ['warn', { max: 15 }],
	'import/no-dynamic-require': 'error',
	'import/newline-after-import': 'error',
	'import/no-anonymous-default-export': 'off',
};
