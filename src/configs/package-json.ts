import type { Linter } from 'eslint';
import packageJsonPlugin from 'eslint-plugin-package-json';
import { defineConfig } from '../utils/define-config.js';

export const packageJson = defineConfig([
	packageJsonPlugin.configs.recommended as Linter.Config,
	{
		files: ['**/package.json'],
		rules: {
			// Disable sorting rules - already handled by jsonc/sort-keys in json.ts
			'package-json/order-properties': 'off',
			'package-json/sort-collections': 'off',

			// Skip description requirement for private packages
			'package-json/require-description': ['error', { ignorePrivate: true }],

			// Enforce GitHub shorthand (e.g. "privatenumber/lintroll")
			'package-json/repository-shorthand': ['error', { form: 'shorthand' }],

			// Enforce implicit format for exports (e.g. "exports": "./index.js")
			'package-json/exports-subpaths-style': ['error', { prefer: 'implicit' }],

			// Private packages should only use devDependencies since they're never published
			'package-json/restrict-private-properties': ['error', {
				blockedProperties: [
					'files',
					'publishConfig',
					'dependencies',
					'peerDependencies',
					'optionalDependencies',
				],
			}],
		},
	},
]);
