import type { ESLint, Rule } from 'eslint';
import { version } from '../../package.json';
import { preferArrowFunctions } from './prefer-arrow-functions/index.js';
import { noFunctionHoisting } from './no-function-hoisting/index.js';

export const pvtnbrPlugin = {
	meta: {
		name: 'pvtnbr/custom-rules',
		version,
	},
	rules: {
		'prefer-arrow-functions': preferArrowFunctions as unknown as Rule.RuleModule,
		'no-function-hoisting': noFunctionHoisting as unknown as Rule.RuleModule,
	},
	configs: {
		base: {
			rules: {
				'pvtnbr/prefer-arrow-functions': 'error',
				// 'pvtnbr/no-function-hoisting': 'error',
			},
		},
	},
} satisfies ESLint.Plugin;
