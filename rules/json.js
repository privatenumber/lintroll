module.exports = {

	ignorePatterns: [
		'package-lock.json',
	],

	overrides: [
		{
			files: '*.json',

			parser: 'jsonc-eslint-parser',

			plugins: ['jsonc'],

			rules: {
				'jsonc/indent': ['error', 'tab'],
				'jsonc/key-spacing': [
					'error',
					{
						beforeColon: false,
						afterColon: true,
						mode: 'strict',
					},
				],
				'jsonc/object-property-newline': 'error',
			},
		},
		{
			files: 'package.json',

			rules: {
				'jsonc/sort-keys': [
					'error',
					{
						pathPattern: '^$',
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
							'main',
							'module',
							'types',
							'exports',
							'bin',
							'unpkg',
							'scripts',
							'husky',
							'lint-staged',
							'peerDependencies',
							'peerDependenciesMeta',
							'dependencies',
							'optionalDependencies',
							'devDependencies',
							'bundledDependencies',
							'bundleDependencies',
							'overrides',
							'eslintConfig',
						],
					},
					{
						pathPattern: '^(?:dev|peer|optional|bundled)?Dependencies$',
						order: { type: 'asc' },
					},
				],
			},
		},
	],
};
