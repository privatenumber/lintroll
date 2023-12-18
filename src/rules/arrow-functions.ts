import arrowFunctionsPlugin from 'eslint-plugin-prefer-arrow-functions';
import { defineConfig } from '../utils/define-config.js';

export const arrowFunctions = defineConfig({
	plugins: {
		'prefer-arrow-functions': arrowFunctionsPlugin,
	},
	rules: {
		'prefer-arrow-functions/prefer-arrow-functions': [
			'warn',
			{
				allowNamedFunctions: false,
				classPropertiesAllowed: false,
				disallowPrototype: false,
				returnStyle: 'unchanged',
				singleReturnOnly: false,
			},
		],
	},
});
