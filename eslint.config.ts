import { defineConfig, pvtnbr } from '#pvtnbr';

export default defineConfig([
	{
		ignores: [
			'tests/*/fixtures/**/fail{.*,/**}',
			'tests/node/fixtures/package-commonjs/pass.js',
			'tests/cli/fixtures/js-config-commonjs/',
			'tests/typescript/fixtures/allow-ts-extensions/',
		],
	},
	...pvtnbr({
		node: true,
	}),
	{
		// Relax package.json rules for test fixtures
		files: ['tests/**/package.json'],
		rules: {
			'package-json/require-description': 'off',
			'package-json/require-license': 'off',
			'package-json/require-name': 'off',
			'package-json/require-type': 'off',
			'package-json/require-version': 'off',
		},
	},
]);
