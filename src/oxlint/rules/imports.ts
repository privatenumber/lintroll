import type { OxlintConfig } from 'oxlint';

/** Import rules implemented by Oxlint. */
export const importRules = {
	'import/no-named-as-default': 'error',
	'import/no-duplicates': 'error',
	'import/extensions': [
		'error',
		'ignorePackages',
	],
	'import/first': 'error',
	'import/max-dependencies': [
		'warn',
		{
			max: 15,
		},
	],
	'import/newline-after-import': 'error',
	'import/no-absolute-path': 'error',
	'import/no-amd': 'error',
	'import/no-cycle': [
		'error',
		{
			ignoreExternal: true,
		},
	],
	'import/no-mutable-exports': 'error',
	'import/no-named-default': 'error',
	'import/no-self-import': 'error',
	'import/no-webpack-loader-syntax': 'error',
} satisfies NonNullable<OxlintConfig['rules']>;
