import { defineConfig, pvtnbr } from '#pvtnbr';

export default defineConfig([
	{
		ignores: [
			'tests/*/fixtures/**/fail{.*,/**}',
			'tests/node/fixtures/package-commonjs/pass.js',
			'tests/cli/fixtures/js-config-commonjs/',
			'tests/typescript/fixtures/import-ts-extension/',
		],
	},
	...pvtnbr({
		node: true,
	}),
]);
