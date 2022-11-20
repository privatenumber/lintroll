import confusingBrowserGlobals from 'confusing-browser-globals';
import { createConfig } from '../utils/create-config.js';

export = createConfig({
	overrides: [
		{
			env: {
				serviceworker: true,
			},
			files: '*.sw.js',
			rules: {
				'no-restricted-globals': [
					'error',
					...confusingBrowserGlobals.filter(variable => variable !== 'self'),
				],
			},
		},
	],
});
