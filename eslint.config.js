// @ts-check

// eslint-disable-next-line n/file-extension-in-import
import { defineConfig, pvtnbr } from '#pvtnbr';

export default defineConfig([
	{
		ignores: [
			'tests/*/fixtures/**/fail{.*,/**}',
			'tests/node/fixtures/package-commonjs/pass.js',
		],
	},
	...pvtnbr({
		node: true,

		// Because Vue is not installed but we lint SFCs
		vue: true,
	}),
]);
