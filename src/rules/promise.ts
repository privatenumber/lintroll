import { createConfig } from '../utils/create-config';

export = createConfig({
	extends: ['plugin:promise/recommended'],

	rules: {
		'promise/always-return': 'off',
		'promise/catch-or-return': ['error', {
			allowThen: true,
		}],
	},
});
