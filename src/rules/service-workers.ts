import confusingBrowserGlobals from 'confusing-browser-globals';
import { createConfig } from '../utils/create-config.js';

export = createConfig({
	overrides: [
		{
			files: '*.sw.js',
			env: {
				serviceworker: true,
			},
			rules: {
				'no-restricted-globals': [
					'error',
					...confusingBrowserGlobals.filter(variable => variable !== 'self'),
				],
			},
		},
	],
});
