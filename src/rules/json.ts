import type { ESLint } from 'eslint';
import type { Rules } from 'eslint-define-config';
import jsonc from 'eslint-plugin-jsonc';
import { defineConfig } from '../utils/define-config.js';

const baseConfig = defineConfig({
	files: ['**/*.{json,json5,jsonc}'],
	plugins: {
		// jsonc comes with own types
		jsonc: jsonc as unknown as ESLint.Plugin,
	},
	languageOptions: {
		parser: jsonc,
	},
	rules: {
		...(jsonc.configs.base.overrides[0].rules as unknown as Rules),
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
});

const packageJson = defineConfig({
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
});

const tsconfig = defineConfig({
	files: ['**/tsconfig.json'],
	rules: {
		...(jsonc.configs['recommended-with-jsonc'].rules as unknown as Rules),
	},
});

export const json = [
	{
		ignores: [
			'**/package-lock.json',
		],
	},
	baseConfig,
	packageJson,
	tsconfig,
];
