import type { Linter } from 'eslint';
import { isInstalled } from './utils/require.js';
import type { Options } from './types.js';
import { base } from './rules/base.js';
import { eslintComments } from './rules/eslint-comments.js';
import { stylistic } from './rules/stylistic.js';
import { imports } from './rules/imports.js';
import { typescript } from './rules/typescript.js';
import { regexp } from './rules/regexp.js';
import { node } from './rules/node.js';
import { promise } from './rules/promise.js';
import { jest } from './rules/jest.js';
import { markdown } from './rules/markdown.js';
import { json } from './rules/json.js';
import { noUseExtendNative } from './rules/no-use-extend-native.js';
import { unicorn } from './rules/unicorn.js';
import { react } from './rules/react.js';
import { vue } from './rules/vue.js';
import { arrowFunctions } from './rules/arrow-functions.js';

export const pvtnbr = (
	options?: Options,
): Linter.FlatConfig[] => {
	const normalizedOptions = {
		...options,
		node: options?.node,
		vue: options?.vue || isInstalled('vue'),
		react: options?.react || isInstalled('react'),
	};

	return [
		{
			linterOptions: {
				reportUnusedDisableDirectives: true,
			},
		},
		{
			ignores: [
				'**/package-lock.json',
				'{tmp,temp}/**',
				'**/*.min.js',
				'**/dist/**',
				'**/node_modules/**',
				'**/vendor/**',
			],
		},
		...base,
		eslintComments,
		...imports,
		...unicorn,
		...typescript,
		stylistic,
		...regexp,
		...promise,
		...node(normalizedOptions),
		...noUseExtendNative,
		...json,
		...(normalizedOptions.vue ? vue : []),
		...(normalizedOptions.react ? react : []),
		...markdown(normalizedOptions),
		arrowFunctions,
		jest,
	].filter(Boolean);
};

export type { Options };
export { defineConfig } from './utils/define-config.js';
