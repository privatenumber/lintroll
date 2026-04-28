import type { DummyRuleMap } from 'oxlint';
import { shadowAllowList } from './eslint.ts';

/**
 * TypeScript rules — matches src/configs/typescript.ts
 *
 * Extension rules disable the base ESLint version and enable the
 * TypeScript-aware version that understands parameter properties,
 * type imports, etc.
 */
export const typescriptRules: DummyRuleMap = {
	// Enforce type over interface for consistency
	'@typescript-eslint/consistent-type-definitions': ['error', 'type'],

	// Extension rules (TS-aware versions of base ESLint rules)
	'@typescript-eslint/no-useless-constructor': 'error',
	'@typescript-eslint/no-empty-function': ['error', {
		allow: ['arrowFunctions', 'functions', 'methods'],
	}],
	'@typescript-eslint/no-shadow': ['error', { allow: shadowAllowList }],
	'@typescript-eslint/no-unused-vars': ['error', {
		argsIgnorePattern: '^_',
		caughtErrorsIgnorePattern: '^_',
		varsIgnorePattern: '^_',
		args: 'after-used',
		ignoreRestSiblings: true,
		vars: 'all',
	}],

	// Prefer unknown over any
	'@typescript-eslint/no-explicit-any': ['error', {
		fixToUnknown: false,
		ignoreRestArgs: true,
	}],

	// Enforce type-only imports when value is only used as a type
	'@typescript-eslint/consistent-type-imports': ['error', {
		fixStyle: 'inline-type-imports',
	}],
	'@typescript-eslint/no-import-type-side-effects': 'error',
};
