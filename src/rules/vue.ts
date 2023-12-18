import fs from 'fs';
import type { ESLint } from 'eslint';
import vuePlugin from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';
import globals from 'globals';
import { isInstalled, getExports } from '../utils/require.js';
import { defineConfig } from '../utils/define-config';

const vue3Rules = {
	...vuePlugin.configs.base.rules,
	...vuePlugin.configs['vue3-essential'].rules,
	...vuePlugin.configs['vue3-strongly-recommended'].rules,
	...vuePlugin.configs['vue3-recommended'].rules,
};

const detectAutoImport = () => {
	if (!isInstalled('unplugin-auto-import')) {
		return {};
	}

	return Object.fromEntries(
		[
			'vue',
			'vue-router',
			'@vueuse/core',
			'@vueuse/head',
		].flatMap(moduleName => (
			isInstalled(moduleName)
				? getExports(moduleName).map(
					exportName => [exportName, 'readonly'] as const,
				)
				: []
		)),
	);
};

const detectAutoImportComponents = () => {
	const components = [];

	if (isInstalled('vitepress')) {
		components.push(
			'content',
			'client-only',
			'outbound-link',
		);
	}

	const componentsPath = './src/components';

	if (
		isInstalled('unplugin-vue-components')
		&& fs.existsSync(componentsPath)
	) {
		const files = fs.readdirSync(componentsPath);
		const componentFiles = files
			.filter(filename => filename.endsWith('.vue'))
			.map(filename => filename.replace('.vue', ''));

		components.push(...componentFiles);
	}

	if (isInstalled('unplugin-icons')) {
		components.push('icon-*');
	}

	return components;
};

export const vue = [

	defineConfig({
		files: ['**/*.vue'],

		plugins: {
			vue: vuePlugin,
		},

		processor: vuePlugin.processors['.vue'],

		languageOptions: {
			globals: {
				...globals.browser,

				...vuePlugin.environments['setup-compiler-macros'].globals,

				// Types incorrect: https://github.com/DefinitelyTyped/DefinitelyTyped/pull/67852
				...detectAutoImport() as unknown as ESLint.Environment['globals'],
			},
			parser: vueParser,
			parserOptions: {
				// https://github.com/vuejs/vue-eslint-parser#parseroptionsparser
				parser: {
					ts: '@typescript-eslint/parser',
				},
			},
		},

		rules: {
			...vue3Rules,

			// For Vue 2
			// 'vue/no-deprecated-slot-attribute': ['error'],
			// 'vue/no-deprecated-slot-scope-attribute': ['error'],
			// 'vue/no-deprecated-scope-attribute': ['error'],

			'unicorn/filename-case': ['error', {
				case: 'pascalCase',
			}],

			'vue/html-indent': ['error', 'tab'],

			'vue/multi-word-component-names': 'off',

			'vue/no-undef-components': ['error', {
				ignorePatterns: [
					'router-view',
					'router-link',
					...detectAutoImportComponents(),
				],
			}],

			// Deprecated
			'vue/component-tags-order': 'off',

			'vue/block-order': ['error', {
				order: [
					'script[setup]',
					['script', 'template'],
					'style',
				],
			}],
		},
	}),
];
