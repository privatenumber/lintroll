import type { Linter, ESLint } from 'eslint';
import jsoncPlugin from 'eslint-plugin-jsonc';
import { defineConfig } from '../utils/define-config.js';

const [base] = jsoncPlugin.configs.base.overrides;

export const json = [
	defineConfig({
		files: ['**/*.{json,json5,jsonc}'],
		plugins: {
			jsonc: jsoncPlugin as unknown as ESLint.Plugin,
		},
		languageOptions: {
			parser: jsoncPlugin as unknown as Linter.ParserModule,
		},
		rules: {
			...base.rules as Linter.RulesRecord,
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
					pathPattern: '^$',
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
						'bin',
						'main',
						'module',
						'types',
						'exports',
						'imports',
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
				},
				{
					pathPattern: '^(dependencies|(dev|peer|optional|bundled)Dependencies)$',
					order: { type: 'asc' },
				},
			],
		},
	}),
	defineConfig({
		files: ['**/tsconfig.json'],
		rules: jsoncPlugin.configs['recommended-with-jsonc'].rules as Linter.RulesRecord,
	}),
];
