const fs = require('fs');

/** @typedef { import('eslint').Linter.Config } ESLintConfig */

function isInstalled(specifier) {
	try {
		require.resolve(specifier);
		return true;
	} catch {}

	return false;
}

function autoImportIfInstalled(
	autoImportedEntries,
	moduleName,
) {
	if (!isInstalled(moduleName)) {
		return;
	}

	autoImportedEntries.push(
		// eslint-disable-next-line node/global-require
		...Object.keys(require(moduleName)).map(
			exportName => [exportName, 'readonly'],
		),
	);
}

function detectAutoImport() {
	if (!isInstalled('unplugin-auto-import')) {
		return {};
	}

	const autoImportedEntries = [];

	['vue', 'vue-router', '@vueuse/core'].forEach(
		moduleName => autoImportIfInstalled(autoImportedEntries, moduleName),
	);

	return Object.fromEntries(autoImportedEntries);
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
