const path = require('path');
const { ESLint } = require('eslint');
require('../../../test/jest-setup');

const passFixture = path.join(__dirname, 'fixtures/pass.ts');
const failFixture = path.join(__dirname, 'fixtures/fail.ts');
const eslint = new ESLint({
	useEslintrc: false,
	baseConfig: {
		extends: path.join(__dirname, '../index.js'),
	},
});

test('Pass cases', async () => {
	const results = await eslint.lintFiles([passFixture]);
	const [result] = results;

	expect(result.errorCount).toBe(0);
	expect(result.warningCount).toBe(0);
	expect(result.usedDeprecatedRules.length).toBe(0);
});

test('Fail cases', async () => {
	const results = await eslint.lintFiles([failFixture]);
	const { messages } = results[0];

	expect(messages).toContainObject({
		ruleId: '@typescript-eslint/return-await',
		messageId: 'requiredPromiseAwait',
	});

	expect(messages).toContainObject({
		ruleId: '@typescript-eslint/member-delimiter-style',
		messageId: 'expectedSemi',
	});

	expect(messages).toContainObject({
		ruleId: '@typescript-eslint/consistent-type-assertions',
		messageId: 'as',
	});
});
