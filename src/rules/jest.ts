/**
 * References:
 * - https://github.com/import-js/eslint-plugin-import/blob/master/config/typescript.js
 * - https://github.com/xojs/eslint-config-xo-typescript/blob/master/index.js
 */
import globals from 'globals';
import { isInstalled } from '../utils/is-installed.js';
import { defineConfig } from '../utils/define-config.js';

export const jest = (
	isInstalled('jest')
		? defineConfig({
			files: ['**/{test,tests}/*'],
			languageOptions: {
				globals: globals.jest,
			},
		})
		: undefined
);
