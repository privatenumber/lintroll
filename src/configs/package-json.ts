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

			// Enforce implicit format for exports (e.g. "exports": "./index.js")
			'package-json/exports-subpaths-style': ['error', { prefer: 'implicit' }],
		},
	},
	{
		// Relax rules for test fixtures - they don't need full package.json metadata
		files: ['**/tests/**/package.json', '**/fixtures/**/package.json'],
		rules: {
			'package-json/require-description': 'off',
			'package-json/require-license': 'off',
			'package-json/require-name': 'off',
			'package-json/require-type': 'off',
			'package-json/require-version': 'off',
			'package-json/repository-shorthand': 'off',
		},
	},
]);
