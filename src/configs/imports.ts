import { fileURLToPath } from 'node:url';
import importPlugin from 'eslint-plugin-import-x';
import { defineConfig } from '../utils/define-config';

const pkgMapsResolver = fileURLToPath(
	import.meta.resolve('#pkg-maps-resolver'),
);

export const createImportsConfig = (cwd: string) => defineConfig({
	plugins: {
		'import-x': importPlugin,
	},

	settings: {
		'import-x/ignore': [
			'node_modules',
			String.raw`\.(css|svg|json)$`,
		],
		'import-x/resolver': {
			node: {},
			[pkgMapsResolver]: {},
		},
	},

	rules: {
		...importPlugin.configs.recommended.rules,

		// https://github.com/import-js/eslint-plugin-import/blob/e6f6018/docs/rules/default.md#when-not-to-use-it
		'import-x/default': 'off',

		// dynamic imports require a leading comment with a webpackChunkName
		// https://github.com/import-js/eslint-plugin-import/blob/e6f6018/docs/rules/dynamic-import-chunkname.md
		'import-x/dynamic-import-chunkname': ['off', {
			importFunctions: [],
			webpackChunknameFormat: '[0-9a-zA-Z-_/.]+',
		}],

		// Helpful warnings:

		// disallow invalid exports, e.g. multiple defaults
		// https://github.com/import-js/eslint-plugin-import/blob/e6f6018/docs/rules/export.md
		'import-x/export': 'error',

		// https://github.com/import-js/eslint-plugin-import/blob/e6f6018/docs/rules/exports-last.md
		// Hard to expect this when the grouped exports can't be enabled.
		// In TS, if a type needs to be exported inline, it's dependent types should be right above it
		'import-x/exports-last': 'off',

		// Always require a file extension except from packages
		// https://github.com/import-js/eslint-plugin-import/blob/e6f6018/docs/rules/extensions.md
		'import-x/extensions': ['error', 'ignorePackages'],

		// https://github.com/import-js/eslint-plugin-import/blob/e6f6018/docs/rules/first.md
		'import-x/first': 'error',

		// https://githubis.com/benmosher/eslint-plugin-import/blob/e6f6018/docs/rules/group-exports.md
		// Excessive. Also, not suppored in TS w/ isolatedModules:
		// Re-exporting a type when the 'isolatedModules' flag is provided requires using 'export type'
		'import-x/group-exports': 'off',

		// Forbid modules to have too many dependencies
		// https://github.com/import-js/eslint-plugin-import/blob/e6f6018/docs/rules/max-dependencies.md
		'import-x/max-dependencies': ['warn', { max: 15 }],

		// ensure named imports coupled with named exports
		// https://github.com/import-js/eslint-plugin-import/blob/e6f6018/docs/rules/named.md#when-not-to-use-it
		'import-x/named': 'error',

		// https://github.com/import-js/eslint-plugin-import/blob/e6f6018/docs/rules/namespace.md
		'import-x/namespace': 'off',

		// https://github.com/import-js/eslint-plugin-import/blob/e6f6018/docs/rules/newline-after-import.md
		'import-x/newline-after-import': 'error',

		// Forbid import of modules using absolute paths
		// https://github.com/import-js/eslint-plugin-import/blob/e6f6018/docs/rules/no-absolute-path.md
		'import-x/no-absolute-path': 'error',

		// https://github.com/import-js/eslint-plugin-import/blob/e6f6018/docs/rules/no-amd.md
		'import-x/no-amd': 'error',

		// Reports if a module's default export is unnamed
		// https://github.com/import-js/eslint-plugin-import/blob/e6f6018/docs/rules/no-anonymous-default-export.md
		'import-x/no-anonymous-default-export': ['off', {
			allowAnonymousClass: false,
			allowAnonymousFunction: false,
			allowArray: false,
			allowArrowFunction: false,
			allowLiteral: false,
			allowObject: false,
		}],

		// https://github.com/import-js/eslint-plugin-import/blob/e6f6018/docs/rules/no-commonjs.md
		'import-x/no-commonjs': 'off',

		// https://github.com/import-js/eslint-plugin-import/blob/e6f6018/docs/rules/no-cycle.md
		'import-x/no-cycle': ['error', {
			ignoreExternal: true,
			maxDepth: '∞',
		}],

		// https://github.com/import-js/eslint-plugin-import/blob/e6f6018/docs/rules/no-duplicates.md
		'import-x/no-duplicates': ['error', { 'prefer-inline': true }],

		// https://github.com/import-js/eslint-plugin-import/blob/e6f6018/docs/rules/no-deprecated.md
		// Very slow based on TIMING=ALL npx eslint .
		// High cost, low value
		// 'import-x/no-deprecated': 'error',

		// Forbid the use of extraneous packages
		// https://github.com/import-js/eslint-plugin-import/blob/e6f6018/docs/rules/no-extraneous-dependencies.md
		// paths are treated both as absolute paths, and relative to process.cwd()
		'import-x/no-extraneous-dependencies': ['error', {
			devDependencies: [
				// Source directory - implies bundled
				'**/src/**',
				'**/@types/**',

				// Build configuration related files
				'build/**',
				'build.{js,ts}',

				// Scripts
				'**/scripts/**',

				// Tests
				'**/{test,tests,test-d}/**',
				'**/{test,test-*}.js',
				'**/*{.,_}{test,spec}.js', // tests where the extension or filename suffix denotes that it is a test
				'**/__{tests,mocks}__/**', // jest pattern

				// Config files
				'**/*.config.{js,cjs,mjs,ts,cts,mts}', // any config (eg. jest, webpack, rollup, postcss, vue)
				'**/.*.js', // invisible config files

				// Example snippets
				'examples/**',

				// Code snippets
				'README.md',
			],
			optionalDependencies: false,
		}],

		// https://github.com/import-js/eslint-plugin-import/blob/e6f6018/docs/rules/no-mutable-exports.md
		'import-x/no-mutable-exports': 'error',

		// https://github.com/import-js/eslint-plugin-import/blob/e6f6018/docs/rules/no-named-as-default.md
		'import-x/no-named-as-default': 'error',

		// https://github.com/import-js/eslint-plugin-import/blob/e6f6018/docs/rules/no-named-as-default-member.md
		'import-x/no-named-as-default-member': 'error',

		// https://github.com/import-js/eslint-plugin-import/blob/e6f6018/docs/rules/no-named-default.md
		'import-x/no-named-default': 'error',

		// Forbid a module from importing itself
		// https://github.com/import-js/eslint-plugin-import/blob/e6f6018/docs/rules/no-self-import.md
		'import-x/no-self-import': 'error',

		// https://github.com/import-js/eslint-plugin-import/blob/e6f6018/docs/rules/no-unresolved.md
		'import-x/no-unresolved': ['error', {
			caseSensitive: true,
			commonjs: true,
			ignore: [
				'^https?://',
			],
		}],

		// https://github.com/import-js/eslint-plugin-import/blob/e6f6018/docs/rules/no-useless-path-segments.md
		'import-x/no-useless-path-segments': ['error', { commonjs: true }],

		// https://github.com/import-js/eslint-plugin-import/blob/e6f6018/docs/rules/no-webpack-loader-syntax.md
		'import-x/no-webpack-loader-syntax': 'error',

		// https://github.com/import-js/eslint-plugin-import/blob/e6f6018/docs/rules/order.md
		'import-x/order': 'error',

		// https://github.com/import-js/eslint-plugin-import/blob/e6f6018/docs/rules/prefer-default-export.md
		// Excessive. Also, named exports help enforce readable imports.
		'import-x/prefer-default-export': 'off',
	},
});

// For backward compatibility and use in other configs
export const importsConfig = createImportsConfig(process.cwd());

export const imports = (cwd: string) => [
	createImportsConfig(cwd),

	// Bundled files
	defineConfig({
		files: ['**/src/**/*'],
		rules: {
			// Disallow dynamic imports if compiled
			// https://github.com/import-js/eslint-plugin-import/blob/e6f6018/docs/rules/no-dynamic-require.md
			'import-x/no-dynamic-require': 'error',
		},
	}),
];
