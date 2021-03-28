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
				'jsonc/sort-keys': ['error', {
					pathPattern: '.*',
					order: [
						'name',
						'version',
						'description',
						'keywords',
						'license',
						'repository',
						'funding',
						'author',
						'type',
						'files',
						'exports',
						'main',
						'module',
						'unpkg',
						'types',
						'bin',
						'scripts',
						'husky',
						'lint-staged',
						'peerDependencies',
						'peerDependenciesMeta',
						'dependencies',
						'devDependencies',
						'eslintConfig',
					],
				}],
			},
		},
	],
};
