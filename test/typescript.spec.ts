import path from 'path';
import { test, expect } from 'vitest';
import { eslint } from './utils/eslint';
import './utils/chai-contain-object';

const passFixtureTs = path.join(__dirname, 'fixtures/typescript/pass.ts');
const passFixtureMts = path.join(__dirname, 'fixtures/typescript/pass.mts');
const failFixture = path.join(__dirname, 'fixtures/typescript/fail.ts');

test('Pass ts', async () => {
	const results = await eslint.lintFiles([passFixtureTs]);
	const [result] = results;

	expect(result.errorCount).toBe(0);
	expect(result.warningCount).toBe(0);
	expect(result.usedDeprecatedRules.length).toBe(0);
});

test('Pass mts', async () => {
	const results = await eslint.lintFiles([passFixtureMts]);
	const [result] = results;

	expect(result.errorCount).toBe(0);
	expect(result.warningCount).toBe(0);
	expect(result.usedDeprecatedRules.length).toBe(0);
});

test('Fail cases', async () => {
	const results = await eslint.lintFiles([failFixture]);
	const { messages } = results[0];

	expect(messages).to.containObject({
		ruleId: '@typescript-eslint/no-unused-vars',
		messageId: 'unusedVar',
		severity: 2,
	});

	// expect(messages).to.containObject({
	// 	ruleId: '@typescript-eslint/return-await',
	// 	messageId: 'requiredPromiseAwait',
	// });

	expect(messages).to.containObject({
		ruleId: '@typescript-eslint/member-delimiter-style',
		messageId: 'expectedSemi',
	});

	expect(messages).to.containObject({
		ruleId: '@typescript-eslint/consistent-type-assertions',
		messageId: 'as',
	});
});
