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

// export = createConfig({
// 	extends: [
// 		'./rules/base',
// 		'./rules/stylistic',
// 		'./rules/regexp',
// 		'./rules/imports',
// 		'./rules/promise',
// 		'./rules/unicorn',
// 		'./rules/no-use-extend-native',
// 		'./rules/eslint-comments',
// 		'./rules/json',
// 		'./rules/typescript',
// 		'./rules/vue',
// 		'./rules/react',
// 		'./rules/markdown',
// 		'./rules/service-workers',
// 		'./rules/jest',
// 	],

// 	ignorePatterns: [
// 		// Nested node_modules
// 		'**/node_modules/**',

// 		'{tmp,temp}/**',
// 		'**/*.min.js',
// 		'**/vendor/**',
// 		'**/dist/**',
// 	],
// });

console.log('typescript', typescript);
export const pvtnbr = (): FlatESLintConfig[] => [
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
	base,
	...stylistic,
	...regexp,
	imports,
	...promise,
	...eslintComments,
	...json,
	...markdown,
	...jest,
	...noUseExtendNative,
	...serviceWorkers,
	...typescript,
];
