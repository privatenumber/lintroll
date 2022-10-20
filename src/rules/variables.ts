import confusingBrowserGlobals from 'confusing-browser-globals';
import { createConfig } from '../utils/create-config';
import { isInstalled } from '../utils/is-installed';

export = createConfig({
	rules: {
		// enforce or disallow variable initializations at definition
		'init-declarations': 'off',

		// disallow the catch clause parameter name being the same as a variable in the outer scope
		'no-catch-shadow': 'off',

		// disallow deletion of variables
		'no-delete-var': 'error',

		// disallow labels that share a name with a variable
		// https://eslint.org/docs/rules/no-label-var
		'no-label-var': 'error',

		'no-restricted-globals': [
			'error',
			...confusingBrowserGlobals,
		],

		// disallow declaration of variables already declared in the outer scope
		'no-shadow': ['error', {
			allow: [
				...(isInstalled('manten')
					? ['test', 'describe', 'runTestSuite']
					: []
				),
				...(isInstalled('tasuku')
					? ['task', 'setTitle', 'setError', 'setWarning', 'setStatus', 'setOutput']
					: []
				),
			],
		}],

		// disallow shadowing of names such as arguments
		'no-shadow-restricted-names': 'error',

		// disallow use of undeclared variables unless mentioned in a /*global */ block
		'no-undef': 'error',

		// disallow use of undefined when initializing variables
		'no-undef-init': 'error',

		// disallow declaration of variables that are not used in the code
		'no-unused-vars': ['error', {
			vars: 'all',
			args: 'after-used',
			ignoreRestSiblings: true,
		}],

		// not always possible for inter-dependent functions
		'no-use-before-define': 'off',
	},
});
