import nodePlugin from 'eslint-plugin-n';
import { readPackageUpSync } from 'read-package-up';
import type { Linter } from 'eslint';
import { defineConfig } from '../utils/define-config.js';

const foundPackageJson = readPackageUpSync()!;
const hasCli = foundPackageJson && ('bin' in foundPackageJson.packageJson);

const [
	ambiguious,
	mjs,
	cjs,
] = nodePlugin.configs['flat/mixed-esm-and-cjs'];

// .cjs files can be assumed to support Node features
const baselineNode = defineConfig({
	...cjs,
	files: [...cjs.files!, '**/*.cts'],
});

/*
Eventually this should be a function that accepts a glob to apply node rules to
*/
export const node = (options?: {
	node?: boolean;
}) => {
	const config: Linter.FlatConfig[] = [
		baselineNode,
	];

	if (options?.node) {
		config.push(
			/**
			 * Overwrite eslint-plugin-n/recommended's CommonJS configuration in parserOptions
			 * because often times, ESM is compiled to CJS at runtime using tools like tsx:
			 * https://github.com/eslint-community/eslint-plugin-n/blob/15.5.1/lib/configs/recommended-script.js#L14-L18
			 */
			defineConfig({
				...ambiguious,
				files: [...ambiguious.files!, '**/*.ts'],
				languageOptions: {
					...ambiguious.languageOptions,
					sourceType: 'module',
				},
			}),
			defineConfig({
				...mjs,
				files: [...mjs.files!, '**/*.mts'],
			}),
			defineConfig({
				...cjs,
				files: [...cjs.files!, '**/*.cts'],
			}),

			defineConfig({
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
					// https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/file-extension-in-import.md
					// TODO: Defer to import plugin
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
					// Defer to import plugin
					'n/no-missing-import': 'off',
				},
			}),
		);
	}

	if (hasCli) {
		config.push(
			defineConfig({
				files: [
					'**/cli.{js,ts}',
					'**/cli/**/*.{js,ts}',
				],
				rules: {
					'n/no-process-exit': 'off',
				},
			}),
		);
	}

	return config;
};
