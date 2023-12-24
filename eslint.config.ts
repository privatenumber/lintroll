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
	}),
]);

// export { default } from '#pvtnbr';
