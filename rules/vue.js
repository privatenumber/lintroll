/** @typedef { import('eslint').Linter.Config } ESLintConfig */

/** @type { ESLintConfig } */
const config = {
	overrides: [
		// Setting as an override allows .vue files to be
		// linted without specifying it on the user-end
		{
			files: '*.vue',

			extends: 'plugin:vue/vue3-recommended',

			// Compiler macros
			// https://github.com/vuejs/eslint-plugin-vue/blob/eaf6584/docs/user-guide/README.md#compiler-macros-such-as-defineprops-and-defineemits-are-warned-by-no-undef-rule
			globals: {
				defineProps: 'readonly',
				defineEmits: 'readonly',
				defineExpose: 'readonly',
				withDefaults: 'readonly',
			},

			parserOptions: {
				// https://github.com/vuejs/vue-eslint-parser#parseroptionsparser
				parser: {
					ts: '@typescript-eslint/parser',
				},
			},

			rules: {
				'vue/html-indent': ['error', 'tab'],

				// Defaults to PascalCase
				'vue/component-name-in-template-casing': ['error', 'kebab-case'],

				'vue/no-undef-components': ['error', {
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
