import type { DummyRuleMap } from 'oxlint';

/**
 * Rules from the combined lintroll JS plugin.
 *
 * This plugin bundles:
 * - @eslint-community/eslint-plugin-eslint-comments (directive rules)
 * - eslint-plugin-no-use-extend-native (native prototype protection)
 * - ESLint core gap rules (11 rules not in oxlint natively)
 * - pvtnbr/prefer-arrow-functions (custom rule)
 */
export const lintrollPluginRules: DummyRuleMap = {
	// eslint-comments (directive hygiene)
	'lintroll/comments-disable-enable-pair': 'error',
	'lintroll/comments-no-aggregating-enable': 'error',
	'lintroll/comments-no-duplicate-disable': 'error',
	'lintroll/comments-no-unlimited-disable': 'error',
	'lintroll/comments-no-unused-enable': 'off',

	// Prevent extending native prototypes
	'lintroll/no-use-extend-native': 'error',

	// Custom rule: enforce arrow functions over function declarations
	'lintroll/prefer-arrow-functions': 'error',

	// ESLint core rules not available natively in oxlint
	// (loaded from ESLint's builtinRules via eslint-gap wrapper)
	'lintroll/camelcase': ['error', {
		ignoreDestructuring: false,
		ignoreImports: true,
		properties: 'never',
	}],
	'lintroll/no-implicit-globals': 'error',
	'lintroll/no-octal-escape': 'error',
	'lintroll/no-restricted-exports': ['error', {
		restrictedNamedExports: ['then'],
	}],
	'lintroll/no-restricted-properties': ['error',
		{
			message: 'arguments.callee is deprecated',
			object: 'arguments',
			property: 'callee',
		},
		{
			message: 'Please use Number.isFinite instead',
			object: 'global',
			property: 'isFinite',
		},
		{
			message: 'Please use Number.isFinite instead',
			object: 'self',
			property: 'isFinite',
		},
		{
			message: 'Please use Number.isFinite instead',
			object: 'window',
			property: 'isFinite',
		},
		{
			message: 'Please use Number.isNaN instead',
			object: 'global',
			property: 'isNaN',
		},
		{
			message: 'Please use Number.isNaN instead',
			object: 'self',
			property: 'isNaN',
		},
		{
			message: 'Please use Number.isNaN instead',
			object: 'window',
			property: 'isNaN',
		},
		{
			message: 'Please use Object.defineProperty instead.',
			property: '__defineGetter__',
		},
		{
			message: 'Please use Object.defineProperty instead.',
			property: '__defineSetter__',
		},
		{
			message: 'Use the exponentiation operator (**) instead.',
			object: 'Math',
			property: 'pow',
		}],
	'lintroll/no-undef-init': 'error',
	'lintroll/no-unreachable-loop': 'error',
	'lintroll/object-shorthand': ['error', 'always', { ignoreConstructors: false }],
	'lintroll/one-var': ['error', 'never'],
	'lintroll/prefer-arrow-callback': ['error', {
		allowNamedFunctions: false,
		allowUnboundThis: true,
	}],
	'lintroll/prefer-regex-literals': ['error', { disallowRedundantWrapping: true }],
};

/**
 * unicorn/prevent-abbreviations — loaded via eslint-plugin-unicorn JS plugin.
 *
 * This rule can't be inlined because it uses context.on() API
 * which oxlint's JS plugin system doesn't support.
 */
export const preventAbbreviationsRule: DummyRuleMap = {
	'unicorn-js/prevent-abbreviations': ['error', {
		allowList: {
			i: true,
			j: true,
		},
		replacements: {
			args: false,
			db: false,
			def: false,
			dev: false,
			dir: false,
			dist: false,
			docs: false,
			env: false,
			pkg: false,
			temp: false,
			prop: false,
			props: false,
			params: false,
			ref: false,
			rel: false,
			src: false,
			utils: false,
		},
		ignore: [String.raw`\be2e\b`],
	}],
};
