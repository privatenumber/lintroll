import type { ESLint, Rule } from 'eslint';
import packageJson from '../../package.json' with { type: 'json' };
import { preferArrowFunctions } from './prefer-arrow-functions/index.ts';
// import { noFunctionHoisting } from './no-function-hoisting/index.ts';

export const pvtnbrPlugin = {
	meta: {
		name: 'pvtnbr/custom-rules',
		version: packageJson.version,
	},
	rules: {
		'prefer-arrow-functions': preferArrowFunctions as unknown as Rule.RuleModule,
		// 'no-function-hoisting': noFunctionHoisting as unknown as Rule.RuleModule,
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
