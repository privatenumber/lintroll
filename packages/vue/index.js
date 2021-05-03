/** @typedef { import('eslint').Linter.Config } ESLintConfig */

/** @type { ESLintConfig } */
const config = {
	extends: '@pvtnbr/eslint-config-base',
	overrides: [
		// Setting as an override allows .vue files to be
		// linted without specifying it on the user-end
		{
			files: '*.vue',
			extends: 'plugin:vue/vue3-recommended',
			rules: {
				'vue/html-indent': ['error', 'tab'],

				// Defaults to PascalCase
				'vue/component-name-in-template-casing': ['error', 'kebab-case'],

				'vue/no-unregistered-components': ['error', {
					ignorePatterns: [
						'router-view',
						'router-link',
					],
				}],

				// Disabled until github.com/vuejs/eslint-plugin-vue/issues/1260
				'vue/custom-event-name-casing': 'off',

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
