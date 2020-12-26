module.exports = {
	plugins: [
		'eslint-comments',
	],

	extends: [
		'plugin:eslint-comments/recommended',
	],

	rules: {
		'eslint-comments/no-unused-disable': 'error',

		// Disabled as per `unicorn/no-abusive-eslint-disable`
		// https://github.com/sindresorhus/eslint-plugin-unicorn/blob/c137daa/index.js#L33
		'eslint-comments/no-unlimited-disable': 'off',
	},
};
