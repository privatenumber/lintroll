const path = require('path');
const { ESLint } = require('eslint');
require('./jest-setup.js');

const markdownFixture = path.join(__dirname, 'fixtures/markdown/README.md');

const eslint = new ESLint({
	useEslintrc: false,
	baseConfig: {
		extends: path.join(__dirname, '../index.js'),
	},
});

test('readme.md', async () => {
	const results = await eslint.lintFiles([markdownFixture]);
	const { messages } = results[0];

	expect(messages.length).toBe(0);
});
