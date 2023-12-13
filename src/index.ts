import type { Linter } from 'eslint';
import { isInstalled } from './utils/require.js';
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

export type Options = {
	node?: boolean;
	react?: boolean;
	vue?: boolean;
};

export const pvtnbr = (
	options?: Options,
): Linter.FlatConfig[] => [
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
	...eslintComments,
	...imports,
	...unicorn,
	...typescript,
	stylistic,
	...regexp,
	...promise,
	...node(options),
	...noUseExtendNative,
	...json,
	...(options?.vue || isInstalled('vue') ? vue : []),
	...(options?.react || isInstalled('react') ? react : []),
	...markdown,
	jest,
].filter(Boolean);

export { defineConfig } from './utils/define-config.js';
