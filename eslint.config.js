// @ts-check
import { defineFlatConfig } from 'eslint-define-config';

// eslint-disable-next-line n/file-extension-in-import
import { pvtnbr } from './src/index.ts';

export default defineFlatConfig([
	{
		ignores: [
			'tests/*/fixtures/**/fail.*',
			'tests/*/fixtures/**/fail/**',
		],
	},
	...pvtnbr({
		node: true,
	}),
]);
