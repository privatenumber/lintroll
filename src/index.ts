import type { Linter } from 'eslint';
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
};

export const pvtnbr = (
	options?: Options,
): Linter.FlatConfig[] => [
	{
		ignores: [
			// Nested node_modules
			'**/node_modules/**',

			'{tmp,temp}/**',
			'**/*.min.js',
			'**/vendor/**',
			'**/dist/**',
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
	...(
		options?.node ? node : []
	),
	...noUseExtendNative,
	...json,
	...vue,
	...react,
	...markdown,
	jest,
].filter(Boolean);

export { defineConfig } from './utils/define-config.js';
