const path = require('path');
const { ESLint } = require('eslint');
require('./jest-setup.js');

const fixturePass = path.join(__dirname, 'fixtures/markdown/PASS.md');
const fixtureFail = path.join(__dirname, 'fixtures/markdown/fail.md');

const eslint = new ESLint({
	useEslintrc: false,
	baseConfig: {
		extends: path.join(__dirname, '../index.js'),
	},
});

test('Pass', async () => {
	const results = await eslint.lintFiles([fixturePass]);
	const { messages } = results[0];

	expect(messages.length).toBe(0);
});

test('Fail', async () => {
	const results = await eslint.lintFiles([fixtureFail]);
	const { messages } = results[0];

	expect(messages).toContainObject({
		ruleId: 'semi',
		messageId: 'extraSemi',
	});

	expect(messages).toContainObject({
		ruleId: 'comma-dangle',
		messageId: 'unexpected',
	});

	expect(messages).toContainObject({
		ruleId: 'no-multiple-empty-lines',
		messageId: 'blankEndOfFile',
	});
});
