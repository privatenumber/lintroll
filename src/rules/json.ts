import { createConfig } from '../utils/create-config.js';

export = createConfig({
	ignorePatterns: [
		'package-lock.json',
	],

	overrides: [
		{
			files: '*.{json,json5,jsonc}',
			extends: 'plugin:jsonc/base',
			rules: {
				'jsonc/indent': ['error', 'tab'],
				'jsonc/key-spacing': [
					'error',
					{
						afterColon: true,
						beforeColon: false,
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
						order: [
							'name',
							'version',
							'private',
							'publishConfig',
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
							'imports',
							'bin',
							'unpkg',
							'scripts',
							'husky',
							'simple-git-hooks',
							'lint-staged',
							'engines',
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
						pathPattern: '^$',
					},
					{
						order: { type: 'asc' },
						pathPattern: '^(?:dev|peer|optional|bundled)?Dependencies$',
					},
				],
			},
		},
		{
			files: 'tsconfig.json',
			extends: 'plugin:jsonc/recommended-with-jsonc',
		},
	],
});
