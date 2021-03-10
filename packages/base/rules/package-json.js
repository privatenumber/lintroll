module.exports = {
	overrides: [
		{
			files: 'package.json',

			parser: require.resolve('jsonc-eslint-parser'),

			plugins: [
				'jsonc',
			],

			rules: {
				'jsonc/indent': ['error', 'tab'],
			},
		},
	],
};
