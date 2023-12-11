import type { Linter } from 'eslint';
import jsoncPlugin from 'eslint-plugin-jsonc';
import { defineConfig } from '../utils/define-config.js';
import { resolveConfig } from '../utils/resolve-config.js';

export const json = [
	...resolveConfig('plugin:jsonc/base'),
	defineConfig({
		files: ['**/*.{json,json5,jsonc}'],
		rules: {
			'jsonc/indent': ['error', 'tab'],
			'jsonc/key-spacing': [
				'error',
				{
					afterColon: true,
					beforeColon: false,
					mode: 'strict',
				},
			],
			'jsonc/object-property-newline': 'error',
		},
	}),
	defineConfig({
		files: ['**/package.json'],
		rules: {
			'jsonc/sort-keys': [
				'error',
				{
					order: [
						'name',
						'version',
						'private',
						'publishConfig',
						'description',
						'keywords',
						'license',
						'repository',
						'funding',
						'author',
						'type',
						'files',
						'main',
						'module',
						'types',
						'exports',
						'imports',
						'bin',
						'unpkg',
						'scripts',
						'husky',
						'simple-git-hooks',
						'lint-staged',
						'engines',
						'peerDependencies',
						'peerDependenciesMeta',
						'dependencies',
						'optionalDependencies',
						'devDependencies',
						'bundledDependencies',
						'bundleDependencies',
						'overrides',
						'eslintConfig',
					],
					pathPattern: '^$',
				},
				{
					order: { type: 'asc' },
					pathPattern: '^(?:dev|peer|optional|bundled)?Dependencies$',
				},
			],
		},
	}),
	defineConfig({
		files: ['**/tsconfig.json'],
		rules: {
			...(jsoncPlugin.configs['recommended-with-jsonc'].rules as Linter.RulesRecord),
		},
	}),
];
