const path = require('path');
const { ESLint } = require('eslint');
require('./jest-setup.js');

const passFixture = path.join(__dirname, 'fixtures/react/InputComponent.tsx');
const failFixture = path.join(__dirname, 'fixtures/react/fail.tsx');
const eslint = new ESLint({
	useEslintrc: false,
	baseConfig: {
		extends: path.join(__dirname, '../index.js'),
		rules: {
			'import/no-extraneous-dependencies': 'off',
		},
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
		ruleId: 'jsx-quotes',
		messageId: 'unexpected',
	});

	expect(messages).toContainObject({
		ruleId: 'unicorn/filename-case',
		messageId: 'filename-case',
	});

	expect(messages).toContainObject({
		ruleId: 'react/react-in-jsx-scope',
		messageId: 'notInScope',
	});

	expect(messages).toContainObject({
		ruleId: 'react/prop-types',
		messageId: 'missingPropType',
	});

	expect(messages).toContainObject({
		ruleId: 'react/jsx-max-props-per-line',
		messageId: 'newLine',
	});
});
