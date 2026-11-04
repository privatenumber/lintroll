import arrowPlugin from 'eslint-plugin-arrow';
import { defineConfig } from '../utils/define-config.ts';

export const arrow = defineConfig({
	plugins: {
		arrow: arrowPlugin,

		// Previous namespace of these rules. Registered so existing `pvtnbr/*` directives still resolve
		pvtnbr: arrowPlugin,
	},
	rules: {
		'arrow/prefer-arrow-functions': ['error', {
			namedFunctionExpressions: true,
		}],
		'arrow/no-function-hoisting': 'error',
	},
});
