module.exports = {
	plugins: [
		'promise',
	],

	extends: [
		'plugin:promise/recommended',
	],

	rules: {
		'promise/always-return': 'off',
		'promise/catch-or-return': ['error', {
			allowThen: true,
		}],
	},
};
