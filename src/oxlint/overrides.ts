import type { OxlintOverride } from 'oxlint';

/**
 * File-specific rule overrides.
 */
export const overrides: OxlintOverride[] = [
	// TypeScript files: disable base rules in favor of TS-aware versions
	{
		files: ['**/*.{ts,tsx,mts,cts}'],
		rules: {
			'no-useless-constructor': 'off',
			'no-empty-function': 'off',
			'no-shadow': 'off',
			'no-unused-vars': 'off',

			// Function expression can be used to type a function
			'func-style': 'off',
			'prefer-rest-params': 'off',

			// TS handles destructuring differently
			'unicorn/consistent-destructuring': 'off',
			'unicorn/no-array-callback-reference': 'off',
			'unicorn/no-useless-undefined': 'off',
		},
	},

	// Declaration files
	{
		files: ['**/*.d.ts'],
		rules: {
			'unicorn/prevent-abbreviations': 'off',
		},
	},

	// Scripts directory
	{
		files: ['**/scripts/**/*.{js,ts}'],
		rules: {
			'no-console': 'off',
		},
	},

	// CJS files (oxlint JS plugins) — require() is expected
	{
		files: ['**/*.cjs'],
		rules: {
			'n/global-require': 'off',
			'lintroll/prefer-arrow-functions': 'off',
		},
	},
];
