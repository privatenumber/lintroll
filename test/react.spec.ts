import path from 'path';
import { test, expect } from 'vitest';
import { createEslint } from './utils/eslint';
import './utils/chai-contain-object';

const eslint = createEslint({
	rules: {
		'import/no-extraneous-dependencies': 'off',
	},
});

const passFixture = path.join(__dirname, 'fixtures/react/InputComponent.tsx');
const failFixture = path.join(__dirname, 'fixtures/react/fail.tsx');

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

	expect(messages).to.containObject({
		ruleId: 'jsx-quotes',
		messageId: 'unexpected',
	});

	expect(messages).to.containObject({
		ruleId: 'unicorn/filename-case',
		messageId: 'filename-case',
	});

	expect(messages).to.containObject({
		ruleId: 'react/react-in-jsx-scope',
		messageId: 'notInScope',
	});

	expect(messages).to.containObject({
		ruleId: 'react/prop-types',
		messageId: 'missingPropType',
	});

	expect(messages).to.containObject({
		ruleId: 'react/jsx-max-props-per-line',
		messageId: 'newLine',
	});
});
