import path from 'path';
import { testSuite, expect } from 'manten';
import { eslint } from '../utils/eslint';

const passFixtureTs = path.join(__dirname, 'fixtures/pass.ts');
const passFixtureMts = path.join(__dirname, 'fixtures/pass.mts');
const failFixture = path.join(__dirname, 'fixtures/fail.ts');

export default testSuite(({ describe }) => {
	describe('typescript', ({ test }) => {
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

			expect(messages).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						ruleId: '@typescript-eslint/no-unused-vars',
						messageId: 'unusedVar',
						severity: 2,
					}),
					expect.objectContaining({
						ruleId: '@typescript-eslint/member-delimiter-style',
						messageId: 'expectedSemi',
					}),
					expect.objectContaining({
						ruleId: '@typescript-eslint/consistent-type-assertions',
						messageId: 'as',
					}),
					// expect.objectContaining({
					// 	ruleId: '@typescript-eslint/return-await',
					// 	messageId: 'requiredPromiseAwait',
					// }),
				]),
			);
		});
	});
});
