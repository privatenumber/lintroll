import type { FlatESLintConfig } from 'eslint-define-config'
import globals from 'globals'
import confusingBrowserGlobals from 'confusing-browser-globals';

export const serviceWorkers: FlatESLintConfig[] = [
	
	{
		files: ['*.sw.js'],
        languageOptions: {
            globals: globals['serviceworker'],
        },
		rules: {
			'no-restricted-globals': [
				'error',
				...confusingBrowserGlobals.filter(variable => variable !== 'self'),
			],
		},
}
];

