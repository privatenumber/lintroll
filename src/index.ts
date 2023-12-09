import type { FlatESLintConfig } from 'eslint-define-config';
import { base } from './rules/base.js';
import { stylistic } from './rules/stylistic.js';
import { regexp } from './rules/regexp.js';
import { imports } from './rules/imports.js';
import { promise } from './rules/promise.js';
import { eslintComments } from './rules/eslint-comments.js';
import { jest } from './rules/jest.js';
import { markdown } from './rules/markdown.js';
import { json } from './rules/json.js';
import { noUseExtendNative } from './rules/no-use-extend-native.js';
import { serviceWorkers } from './rules/service-workers.js';
import { typescript } from './rules/typescript.js';
import { unicorn } from './rules/unicorn.js';
import { react } from './rules/react.js';
import { vue } from './rules/vue.js';
import { node } from './rules/node.js';

export type Options = {
	node?: boolean;
};

export const pvtnbr = (
	options?: Options,
): FlatESLintConfig[] => [
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
	...(
		options?.node ? node : []
	),
	base,
	stylistic,
	regexp,
	imports,
	promise,
	unicorn,
	noUseExtendNative,
	eslintComments,
	...json,
	...typescript,
	vue,
	react,
	...markdown,
	serviceWorkers,
	jest,
].filter(Boolean);
