import { defineConfig } from 'oxlint';
import { ignorePatterns } from './ignores.ts';
import { overrides } from './overrides.ts';
import { rules } from './rules/index.ts';

export const oxlintConfig = defineConfig({
	plugins: [
		'import',
		'vue',
	],
	categories: {
		correctness: 'off',
	},
	options: {
		reportUnusedDisableDirectives: 'warn',
	},
	env: {
		builtin: true,
		es2026: true,
		node: true,
		'shared-node-browser': true,
	},
	ignorePatterns,
	rules,
	overrides,
});

export default oxlintConfig;
