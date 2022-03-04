const fs = require('fs');

/** @typedef { import('eslint').Linter.Config } ESLintConfig */

function isInstalled(specifier) {
	try {
		require.resolve(specifier);
		return true;
	} catch {}

	return false;
}

function detectAutoImport() {
	if (!isInstalled('unplugin-auto-import')) {
		return {};
	}

	const globalEntries = [];

	globalEntries.push(
		// eslint-disable-next-line node/global-require,import/no-unresolved
		...Object.keys(require('vue')).map(
			exportName => [exportName, 'readonly'],
		),
	);

	if (isInstalled('@vueuse/core')) {
		globalEntries.push(
			// eslint-disable-next-line node/global-require,import/no-unresolved
			...Object.keys(require('@vueuse/core')).map(
				exportName => [exportName, 'readonly'],
			),
		);
	}

	return Object.fromEntries(globalEntries);
}

function detectAutoImportComponents() {
	const componentsPath = './src/components';

	if (
		!fs.existsSync(componentsPath)
		|| !isInstalled('unplugin-vue-components')
	) {
		return [];
	}

	const files = fs.readdirSync(componentsPath);
	const components = files
		.filter(filename => filename.endsWith('.vue'))
		.map(filename => filename.replace('.vue', ''));

	if (isInstalled('unplugin-icons')) {
		components.push('icon-*');
	}

	return components;
}

/** @type { ESLintConfig } */
const config = {
	overrides: [
		// Setting as an override allows .vue files to be
		// linted without specifying it on the user-end
		{
			files: '*.vue',

			extends: 'plugin:vue/vue3-recommended',

			env: {
				'vue/setup-compiler-macros': true,
			},

			globals: detectAutoImport(),

			parserOptions: {
				// https://github.com/vuejs/vue-eslint-parser#parseroptionsparser
				parser: {
					ts: '@typescript-eslint/parser',
				},
			},

			rules: {
				'vue/html-indent': ['error', 'tab'],

				'vue/no-undef-components': ['error', {
					ignorePatterns: [
						'router-view',
						'router-link',
						...detectAutoImportComponents(),
					],
				}],

				'vue/multi-word-component-names': 'off',

				// For Vue 2
				// 'vue/no-deprecated-slot-attribute': ['error'],
				// 'vue/no-deprecated-slot-scope-attribute': ['error'],
				// 'vue/no-deprecated-scope-attribute': ['error'],

				'unicorn/filename-case': ['error', {
					case: 'pascalCase',
				}],
			},
		},
	],
};

module.exports = config;
