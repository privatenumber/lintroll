// @ts-check

// eslint-disable-next-line n/file-extension-in-import
import { defineConfig, pvtnbr } from './src/index.ts';

export default defineConfig([
	{
		ignores: [
			'tests/*/fixtures/**/fail{.*,/**}',
			'tests/node/fixtures/package-commonjs/pass.js',
		],
	},
	...pvtnbr({
		node: true,
	}),
]);
