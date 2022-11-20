import path from 'path';
import { createConfig } from '../utils/create-config.js';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const currentPackageJson = require(path.resolve('package.json'));
const isCli = 'bin' in currentPackageJson;

export = createConfig({
	extends: 'plugin:n/recommended',

	rules: {

		// https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/file-extension-in-import.md
		'n/file-extension-in-import': ['error', 'always', {

			// TypeScript doesn't allow extensions https://github.com/Microsoft/TypeScript/issues/27481
			// Use .js instead
			'.ts': 'never',
			'.tsx': 'never',
		}],

		// https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/global-require.md
		'n/global-require': 'error',

		// https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/no-mixed-requires.md
		'n/no-mixed-requires': ['error', {
			allowCall: true,
			grouping: true,
		}],

		// https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/no-new-require.md
		'n/no-new-require': 'error',

		// https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/no-path-concat.md
		'n/no-path-concat': 'error',

		// https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/prefer-global/buffer.md
		'n/prefer-global/buffer': ['error', 'always'],

		// https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/prefer-global/console.md
		'n/prefer-global/console': ['error', 'always'],

		// https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/prefer-global/process.md
		'n/prefer-global/process': ['error', 'always'],

		// https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/prefer-global/text-decoder.md
		'n/prefer-global/text-decoder': ['error', 'always'],

		// https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/prefer-global/text-encoder.md
		'n/prefer-global/text-encoder': ['error', 'always'],

		// https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/prefer-global/url.md
		'n/prefer-global/url': ['error', 'always'],

		// https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/prefer-global/url-search-params.md
		'n/prefer-global/url-search-params': ['error', 'always'],

		// https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/prefer-promises/dns.md
		'n/prefer-promises/dns': 'error',

		// https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/prefer-promises/fs.md
		'n/prefer-promises/fs': 'error',
	},

	overrides: (
		isCli
			? [{
				files: [
					'cli.{js,ts}',
					'**/cli/**/*.{js,ts}',
				],
				rules: {
					'n/no-process-exit': 'off',
				},
			}]
			: []
	),
});
