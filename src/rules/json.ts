import type { Linter, ESLint } from 'eslint';
import jsoncPlugin from 'eslint-plugin-jsonc';
import { defineConfig } from '../utils/define-config.js';

const [base] = jsoncPlugin.configs.base.overrides;

export const json = [
	defineConfig({
		files: ['**/*.{json,json5,jsonc}'],
		plugins: {
			jsonc: jsoncPlugin as unknown as ESLint.Plugin,
		},
		languageOptions: {
			parser: jsoncPlugin as unknown as Linter.ParserModule,
		},
		rules: {
			...base.rules as Linter.RulesRecord,
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
	}),
	defineConfig({
		files: ['**/package.json'],
		rules: {
			'jsonc/sort-keys': [
				'error',
				{
					pathPattern: '^$',
					order: [
						// Publish requirements
						'name',
						'version',

						// Package meta
						'description',
						'keywords',
						'license',
						'repository',
						'funding',
						'author',

						// Privacy/publishing
						'private',
						'publishConfig',
						'files',

						// Package features
						'type',
						'bin',

						// Entry points
						'main',
						'module',
						'types',
						'exports',
						'imports',
						'unpkg',

						// Development meta
						'scripts',
						'husky',
						'simple-git-hooks',
						'lint-staged',

						// Dependencies
						'engines',
						'peerDependencies',
						'peerDependenciesMeta',
						'dependencies',
						'optionalDependencies',
						'devDependencies',
						'bundledDependencies',
						'bundleDependencies',

						// Miscellaneous
						'overrides',
						'eslintConfig',
					],
				},
				{
					pathPattern: '^(?:dev|peer|optional|bundled)?[Dd]ependencies(Meta)?$',
					order: { type: 'asc' },
				},
			],
		},
	}),
	defineConfig({
		files: ['**/tsconfig.json', '**/tsconfig.*.json'],
		rules: {
			...jsoncPlugin.configs['recommended-with-jsonc'].rules as Linter.RulesRecord,
			'jsonc/sort-keys': [
				'error',
				{
					pathPattern: '^$',
					order: [
						'extends',
						'compilerOptions',
						'references',
						'files',
						'include',
						'exclude',
					],
				},
				{
					pathPattern: '^compilerOptions$',
					order: [
						// Projects
						'incremental',
						'composite',
						'tsBuildInfoFile',
						'disableSourceOfProjectReferenceRedirect',
						'disableSolutionSearching',
						'disableReferencedProjectLoad',

						// Language and Environment
						'target',
						'jsx',
						'jsxFactory',
						'jsxFragmentFactory',
						'jsxImportSource',
						'lib',
						'moduleDetection',
						'noLib',
						'reactNamespace',
						'useDefineForClassFields',
						'emitDecoratorMetadata',
						'experimentalDecorators',

						// Modules
						'baseUrl',
						'rootDir',
						'rootDirs',
						'customConditions',
						'module',
						'moduleResolution',
						'moduleSuffixes',
						'noResolve',
						'paths',
						'resolveJsonModule',
						'resolvePackageJsonExports',
						'resolvePackageJsonImports',
						'typeRoots',
						'types',
						'allowArbitraryExtensions',
						'allowImportingTsExtensions',
						'allowUmdGlobalAccess',

						// JavaScript Support
						'allowJs',
						'checkJs',
						'maxNodeModuleJsDepth',

						// Type Checking
						'strict',
						'strictBindCallApply',
						'strictFunctionTypes',
						'strictNullChecks',
						'strictPropertyInitialization',
						'allowUnreachableCode',
						'allowUnusedLabels',
						'alwaysStrict',
						'exactOptionalPropertyTypes',
						'noFallthroughCasesInSwitch',
						'noImplicitAny',
						'noImplicitOverride',
						'noImplicitReturns',
						'noImplicitThis',
						'noPropertyAccessFromIndexSignature',
						'noUncheckedIndexedAccess',
						'noUnusedLocals',
						'noUnusedParameters',
						'useUnknownInCatchVariables',

						// Emit
						'declaration',
						'declarationDir',
						'declarationMap',
						'downlevelIteration',
						'emitBOM',
						'emitDeclarationOnly',
						'importHelpers',
						'importsNotUsedAsValues',
						'inlineSourceMap',
						'inlineSources',
						'mapRoot',
						'newLine',
						'noEmit',
						'noEmitHelpers',
						'noEmitOnError',
						'outDir',
						'outFile',
						'preserveConstEnums',
						'preserveValueImports',
						'removeComments',
						'sourceMap',
						'sourceRoot',
						'stripInternal',

						// Interop Constraints
						'allowSyntheticDefaultImports',
						'esModuleInterop',
						'forceConsistentCasingInFileNames',
						'isolatedModules',
						'preserveSymlinks',
						'verbatimModuleSyntax',

						// Completeness
						'skipDefaultLibCheck',
						'skipLibCheck',
					],
				},
			],
		},
	}),
];
