import { defineConfig, pvtnbr } from '#pvtnbr';

export default defineConfig([
	{
		ignores: [
			'tests/*/fixtures/**/fail{.*,/**}',
			'tests/node/fixtures/package-commonjs/pass.js',
			'tests/cli/fixtures/js-config-commonjs/',
			'tests/typescript/fixtures/rewrite-extensions/',
		],
	},
	...pvtnbr({
		node: true,
	}),
]);
