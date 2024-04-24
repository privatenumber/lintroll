import fs from 'node:fs';
import nodePlugin from 'eslint-plugin-n';
import { readPackageUpSync } from 'read-package-up';
import { findUpSync } from 'find-up-simple';
import type { Linter } from 'eslint';
import { defineConfig } from '../utils/define-config.js';
import type { Options } from '../types.js';

const scriptExtensions = 'js,ts,mjs,cjs,mts,cts';

const getNodeVersion = () => {
	const foundNvmrc = findUpSync('.nvmrc');
	if (foundNvmrc) {
		let version = fs.readFileSync(foundNvmrc, 'utf8');
		version = version.trim();
		if (version.startsWith('v')) {
			version = version.slice(1);
		}
		return version;
	}

	// Oldest LTS: https://endoflife.date/nodejs
	return '18.19.0';
};

const foundPackageJson = readPackageUpSync()!;
const hasCli = foundPackageJson && ('bin' in foundPackageJson.packageJson);

const [
	defaultAmbiguous,
	defaultMjs,
	defaultCjs,
] = nodePlugin.configs['flat/mixed-esm-and-cjs'];

const disableRules = {
	// https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/no-missing-import.md
	// Defer to import plugin
	'n/no-missing-import': 'off',
	'n/no-missing-require': 'off',

	/**
	 * 1. Doesn't support import maps
	 * 2. Disabling in favor of https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-unresolved.md
	 */
	'n/no-extraneous-import': 'off',
} as const;

/**
* Overwrite eslint-plugin-n/recommended's CommonJS configuration in parserOptions
* because often times, ESM is compiled to CJS at runtime using tools like tsx:
* https://github.com/eslint-community/eslint-plugin-n/blob/15.5.1/lib/configs/recommended-script.js#L14-L18
*/
const base = defineConfig({
	...defaultAmbiguous,
	files: [...defaultAmbiguous.files!, '**/*.ts'],
	languageOptions: {
		...defaultAmbiguous.languageOptions,
		sourceType: 'module',
	},
	rules: {
		...defaultAmbiguous.rules,
		...disableRules,
	},
});

const mjs = defineConfig({
	...defaultMjs,
	files: [...defaultMjs.files!, '**/*.mts'],
	rules: {
		...defaultMjs.rules,
		...disableRules,
	},
});

const cjs = defineConfig({
	...defaultCjs,
	files: [...defaultCjs.files!, '**/*.cts'],
	rules: {
		...defaultCjs.rules,
		...disableRules,
	},
});

export const node = (
	options: Options = {},
) => {
	const config: Linter.FlatConfig[] = [
		defineConfig({
			plugins: {
				n: nodePlugin,
			},
			settings: {
				node: {
					version: `>=${getNodeVersion()}`,
				},
			},
		}),

		// .cjs files can be assumed to be Node
		cjs,
	];

	if (options?.node) {
		config.push(
			base,
			mjs,
			defineConfig({
				files: (
					options.node === true
						? [`**/*.{${scriptExtensions}}`] // all JS files
						: options.node
				),

				rules: {
					// https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/file-extension-in-import.md
					// TODO: Defer to import plugin
					// 'n/file-extension-in-import': ['error', 'always', {

					// 	// TypeScript doesn't allow extensions https://github.com/Microsoft/TypeScript/issues/27481
					// 	// Use .js instead
					// 	'.ts': 'never',
					// 	'.tsx': 'never',
					// }],

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

					'n/no-unsupported-features/node-builtins': 'warn',
				},
			}),
		);
	}

	if (hasCli) {
		config.push(
			defineConfig({
				...base,
				files: [
					`**/cli.{${scriptExtensions}}`,
					`**/cli/**/*.{${scriptExtensions}}`,
				],
				rules: {
					...base.rules,
					'n/no-process-exit': 'off',
				},
			}),
		);
	}

	return config;
};
