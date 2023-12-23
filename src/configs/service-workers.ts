import globals from 'globals';
import confusingBrowserGlobals from 'confusing-browser-globals';
import { defineConfig } from '../utils/define-config.js';

export const serviceWorkers = defineConfig({
	files: ['**/*.sw.{js,ts}'],
	languageOptions: {
		globals: globals.serviceworker,
	},
	rules: {
		'no-restricted-globals': [
			'error',
			...confusingBrowserGlobals.filter(variable => variable !== 'self'),
		],
	},
});
