import path from 'path';
import type { FlatESLintConfig } from 'eslint-define-config';
import nodePlugin from 'eslint-plugin-n';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const currentPackageJson = require(path.resolve('package.json'));
const isCli = 'bin' in currentPackageJson;

export const node = [
	{
		plugins: {
			n: nodePlugin,
		},

		settings: {
			node: {
				// Should support the latest LTS and above
				version: '>=18.16.0',
			},
		},

		rules: {
			...nodePlugin.configs.recommended.rules,

			// https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/file-extension-in-import.md
			'n/file-extension-in-import': ['error', 'always', {

				// TypeScript doesn't allow extensions https://github.com/Microsoft/TypeScript/issues/27481
				// Use .js instead
				'.ts': 'never',
				'.tsx': 'never',
			}],

			// https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/global-require.md
			'n/global-require': 'error',

			// https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/no-mixed-requires.md
			'n/no-mixed-requires': ['error', {
				allowCall: true,
				grouping: true,
			}],

			// https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/no-new-require.md
			'n/no-new-require': 'error',

			// https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/no-path-concat.md
			'n/no-path-concat': 'error',

			// https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/prefer-global/buffer.md
			'n/prefer-global/buffer': ['error', 'always'],

			// https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/prefer-global/console.md
			'n/prefer-global/console': ['error', 'always'],

			// https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/prefer-global/process.md
			'n/prefer-global/process': ['error', 'always'],

			// https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/prefer-global/text-decoder.md
			'n/prefer-global/text-decoder': ['error', 'always'],

			// https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/prefer-global/text-encoder.md
			'n/prefer-global/text-encoder': ['error', 'always'],

			// https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/prefer-global/url.md
			'n/prefer-global/url': ['error', 'always'],

			// https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/prefer-global/url-search-params.md
			'n/prefer-global/url-search-params': ['error', 'always'],

			// https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/prefer-promises/dns.md
			'n/prefer-promises/dns': 'error',

			// https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/prefer-promises/fs.md
			'n/prefer-promises/fs': 'error',

			// https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/no-missing-import.md
			// Currently doesn't work for modules
			'n/no-missing-import': 'off',
		},
	},
	...(
		isCli
			? [{
				files: [
					'**/cli.{js,ts}',
					'**/cli/**/*.{js,ts}',
				],
				rules: {
					'n/no-process-exit': 'off',
				},
			} satisfies FlatESLintConfig]
			: []
	),
	{
		files: ['**/*.md/*'],
		rules: {
			'n/no-missing-import': 'off',
		},
	},
] satisfies FlatESLintConfig[];


// export = createConfig({
// 	extends: [
// 		'plugin:n/recommended',

// 		/**
// 		 * Overwrite eslint-plugin-n/recommended's CommonJS configuration in parserOptions
// 		 * because often times, ESM is compiled to CJS at runtime using tools like tsx:
// 		 * https://github.com/eslint-community/eslint-plugin-n/blob/15.5.1/lib/configs/recommended-script.js#L14-L18
// 		 */
// 		'./index',
// 	],

// 	settings: {
// 		node: {
// 			// Should support the latest LTS and above
// 			version: '>=18.16.0',
// 		},
// 	},

// 	overrides: [
// 		...(
// 			isCli
// 				? [{
// 					files: [
// 						'cli.{js,ts}',
// 						'**/cli/**/*.{js,ts}',
// 					],
// 					rules: {
// 						'n/no-process-exit': 'off',
// 					} as Linter.RulesRecord,
// 				}]
// 				: []
// 		),
// 		{
// 			files: '**/*.md/*',
// 			rules: {
// 				'n/no-missing-import': 'off',
// 			},
// 		},
// 	],
// });
