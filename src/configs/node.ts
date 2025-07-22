import fs from 'node:fs';
import nodePlugin from 'eslint-plugin-n';
import { readPackageUpSync } from 'read-package-up';
import { findUpSync } from 'find-up-simple';
import type { Linter } from 'eslint';
import { defineConfig } from '../utils/define-config.js';
import type { Options as PvtnbrOptions } from '../types.js';
import { tsFiles } from './typescript.js';

const scriptExtensions = 'js,ts,mjs,cjs,mts,cts';

const getNodeVersion = (
	cwd: string,
) => {
	const foundNvmrc = findUpSync('.nvmrc', { cwd });
	if (foundNvmrc) {
		let version = fs.readFileSync(foundNvmrc, 'utf8');
		version = version.trim();
		if (version.startsWith('v')) {
			version = version.slice(1);
		}
		return version;
	}

	return process.version;
};

const tsOverrides: Linter.RulesRecord = {
	// Can't resolve implicit extensionss that are valid in TS. Defer to import plugin
	'n/no-missing-import': 'off',
};

const cjsConfig = nodePlugin.configs['flat/recommended-script'];
const mjsConfig = nodePlugin.configs['flat/recommended-module'];
const mjs = defineConfig({
	...mjsConfig,
	files: ['**/*.mjs'],
});

const mts = defineConfig({
	...mjsConfig,
	files: ['**/*.mts'],
	rules: {
		...mjsConfig.rules,
		...tsOverrides,
	},
});

const cjs = defineConfig({
	...cjsConfig,
	files: ['**/*.cjs'],
});

const cts = defineConfig({
	...cjsConfig,
	files: ['**/*.cts'],
	rules: {
		...cjsConfig.rules,
		...tsOverrides,
	},
});

type Options = {
	cwd: string;
	node?: PvtnbrOptions['node'];
};

export const node = (
	{
		cwd,
		node: isNodeProject,
	}: Options,
) => {
	const foundPackageJson = readPackageUpSync({ cwd });
	const isModule = foundPackageJson?.packageJson?.type === 'module';
	const autoConfig = (
		isModule
			? mjsConfig
			: cjsConfig
	);
	const hasCli = foundPackageJson && ('bin' in foundPackageJson.packageJson);

	const config: Linter.Config[] = [
		defineConfig({
			plugins: {
				n: nodePlugin,
			},
			settings: {
				node: {
					version: `>=${getNodeVersion(cwd)}`,
				},
			},
		}),

		// .cjs files can be assumed to be Node
		cjs,
		cts,
	];

	if (isNodeProject) {
		config.push(
			defineConfig({
				...autoConfig,
				files: ['**/*.js'],
			}),
			defineConfig({
				...autoConfig,
				files: ['**/*.ts'],
				rules: {
					...autoConfig.rules,
					...tsOverrides,
				},
			}),
			mjs,
			mts,
			defineConfig({
				files: (
					isNodeProject === true
						? [`**/*.{${scriptExtensions}}`] // all JS files
						: isNodeProject
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

					'n/prefer-node-protocol': 'error',
				},
			}),
			defineConfig({
				files: [tsFiles],
				rules: {
					// Disable in favor of @typescript-eslint/no-require-imports
					'n/global-require': 'off',
				},
			}),
		);
	}

	if (hasCli) {
		config.push(
			defineConfig({
				...autoConfig,
				files: [
					`**/cli.{${scriptExtensions}}`,
					`**/cli/**/*.{${scriptExtensions}}`,
				],
				rules: {
					...autoConfig.rules,
					'n/no-process-exit': 'off',
				},
			}),
		);
	}

	return config;
};
