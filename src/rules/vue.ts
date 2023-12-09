import fs from 'fs';
import vuePlugin from 'eslint-plugin-vue';
import globals from 'globals';
import * as vueParser from 'vue-eslint-parser';
import { isInstalled } from '../utils/is-installed.js';
import { defineConfig } from '../utils/define-config';

const getModuleExports = (
	moduleName: string,
) => Object.keys(
	// eslint-disable-next-line @typescript-eslint/no-var-requires,n/global-require
	require(moduleName),
);

function detectAutoImport() {
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
				? getModuleExports(moduleName).map(
					exportName => [exportName, 'readonly'] as const,
				)
				: []
		)),
	);
}

function detectAutoImportComponents() {
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
}

const vue3Recommended = {
	...vuePlugin.configs.base.rules,
	...vuePlugin.configs['vue3-essential'].rules,
	...vuePlugin.configs['vue3-strongly-recommended'].rules,
	...vuePlugin.configs['vue3-recommended'].rules,
};

export const vue = defineConfig({
	files: ['**/*.vue'],

	languageOptions: {
		globals: {
			...globals.browser,
			...globals.es2015,
			...detectAutoImport(),
			...vuePlugin.environments!['setup-compiler-macros'].globals,
		},
		parser: vueParser,
		parserOptions: {
			// https://github.com/vuejs/vue-eslint-parser#parseroptionsparser
			// parser: {
			// 	ts: '@typescript-eslint/parser',
			// },
		},
	},

	processor: vuePlugin.processors!['.vue'],

	plugins: {
		vue: vuePlugin,
	},

	rules: {
		...vue3Recommended,

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
});
