/**
 * References:
 * - https://github.com/import-js/eslint-plugin-import/blob/master/config/typescript.js
 * - https://github.com/xojs/eslint-config-xo-typescript/blob/master/index.js
 */
import { createConfig } from '../utils/create-config';
import { isInstalled } from '../utils/is-installed';

export = createConfig(
	isInstalled('jest')
		? {
			overrides: [{
				files: '**/{test,tests}/*',
				env: {
					jest: true,
				},
			}],
		}
		: {},
);
