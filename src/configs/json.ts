import type { Linter } from 'eslint';
import jsoncPlugin from 'eslint-plugin-jsonc';
import { defineConfig } from '../utils/define-config.js';
import { stylistic } from './stylistic.js';

const pick = <T extends Record<string, unknown>, K extends keyof T>(
	object: T,
	keys: K[],
) => Object.fromEntries(
	keys.map(key => [key, object[key]]),
) as Pick<T, K>;

const vscodeConfigs = '**/.vscode/*.json';
const tsconfigFiles = [
	'**/tsconfig.json',
	'**/tsconfig.*.json',
	'**/tsconfig-*.json',
];
const nxConfigs = [
	'**/project.json',
	'**/nx.json',
];
const jsoncFiles = [
	vscodeConfigs,
	...tsconfigFiles,
	...nxConfigs,
];

const jsoncCommaDangle = pick(
	stylistic[1].rules['@stylistic/comma-dangle'][1],
	['arrays', 'objects'],
);
const jsoncConfigs = jsoncPlugin.configs;

const jsoncRecommended = jsoncConfigs['recommended-with-jsonc'].rules as Linter.RulesRecord;

export const json = defineConfig([
	...jsoncConfigs['flat/base'] as Linter.Config[],
	{
		files: ['**/*.json'],
		ignores: jsoncFiles,
		rules: jsoncConfigs['recommended-with-json'].rules as Linter.RulesRecord,
	},
	{
		files: [
			'**/*.jsonc',
			...jsoncFiles,
		],
		rules: {
			...jsoncRecommended,
			'jsonc/comma-dangle': ['error', jsoncCommaDangle],
		},
	},
	{
		files: ['**/*.json5'],
		rules: {
			...jsoncConfigs['recommended-with-json5'].rules as Linter.RulesRecord,
			'jsonc/comma-dangle': ['error', jsoncCommaDangle],
		},
	},
	{
		files: ['**/*.{json,json5,jsonc}'],
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
			'jsonc/object-curly-newline': ['error', { minProperties: 1 }],
			'jsonc/object-curly-spacing': ['error', 'always'],
			'jsonc/object-property-newline': 'error',

			// This must be `always` because JSON stringification produces new lines
			'jsonc/array-bracket-newline': ['error', { minItems: 1 }],
			'jsonc/array-bracket-spacing': ['error', 'never'],
			'jsonc/array-element-newline': ['error', 'always'],

			'eol-last': 'error',

			...pick(
				stylistic[1].rules,
				[
					'@stylistic/no-trailing-spaces',
					'@stylistic/no-multiple-empty-lines',
				],
			),
		},
	},
	{
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
						'typings',
						'exports',
						'imports',
						'unpkg',

						// Development meta
						'packageManager',
						'scripts',
						'husky',
						'simple-git-hooks',
						'lint-staged',

						// Dependencies
						'engines',
						'dependencies',
						'optionalDependencies',
						'peerDependencies',
						'peerDependenciesMeta',
						'devDependencies',

						// Miscellaneous
						'overrides',
						'bundledDependencies',
						'bundleDependencies',
						'eslintConfig',

						// Nx
						'generators',
					],
				},
				{
					pathPattern: '^(?:dev|peer|optional|bundled)?[Dd]ependencies(Meta)?$',
					order: { type: 'asc' },
				},
			],
		},
	},
	{
		files: tsconfigFiles,
		rules: {
			...jsoncRecommended,
			'jsonc/comma-dangle': ['error', jsoncCommaDangle],
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
						'rootDir',
						'rootDirs',
						'module',
						'moduleResolution',
						'moduleSuffixes',
						'customConditions',
						'noResolve',
						'baseUrl',
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
	},
	{
		files: nxConfigs,
		rules: {
			...jsoncRecommended,
			'jsonc/sort-keys': [
				'error',
				{
					pathPattern: '^$',
					order: [
						'$schema',
						'name',
						'metadata',
						'projectType',
						'root',
						'sourceRoot',
						'generators',
						'namedInputs',
						'tags',
						'implicitDependencies',
						'release',
						'targets',
					],
				},
				{
					pathPattern: '^targets$',
					order: { type: 'asc' },
				},
			],
		},
	},
]);
