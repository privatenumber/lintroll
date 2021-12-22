const path = require('path');
const { ESLint } = require('eslint');
require('./jest-setup.js');

const packageJsonFixture = path.join(__dirname, 'fixtures/base/package.json');
const jsonFixture = path.join(__dirname, 'fixtures/base/random.json');

const eslint = new ESLint({
	useEslintrc: false,
	baseConfig: {
		extends: path.join(__dirname, '../index.js'),
	},
});

test('package.json', async () => {
	const results = await eslint.lintFiles([packageJsonFixture]);
	const { messages } = results[0];

	expect(messages).toContainObject({
		ruleId: 'jsonc/indent',
		messageId: 'wrongIndentation',
	});

	expect(messages).toContainObject({
		ruleId: 'jsonc/sort-keys',
		messageId: 'sortKeys',
	});
});

test('random.json', async () => {
	const results = await eslint.lintFiles([jsonFixture]);
	const { messages } = results[0];

	expect(messages).toContainObject({
		ruleId: 'jsonc/indent',
		messageId: 'wrongIndentation',
	});
});
