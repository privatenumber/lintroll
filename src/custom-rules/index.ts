import type { ESLint, Rule } from 'eslint';
import { version } from '../../package.json';
import { preferArrowFunctions } from './prefer-arrow-functions.js';

export const pvtnbrPlugin = {
	meta: {
		name: 'pvtnbr/custom-rules',
		version,
	},
	rules: {
		'prefer-arrow-functions': preferArrowFunctions as unknown as Rule.RuleModule,
	},
	configs: {
		base: {
			rules: {
				'pvtnbr/prefer-arrow-functions': 'error',
			},
		},
	},
} satisfies ESLint.Plugin;
