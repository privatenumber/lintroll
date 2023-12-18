import { fileURLToPath } from 'url';
import { testSuite, expect } from 'manten';
import { eslint } from '../utils/eslint.js';

const passFixtureTs = fileURLToPath(new URL('fixtures/pass.ts', import.meta.url));
const passFixtureMts = fileURLToPath(new URL('fixtures/pass.mts', import.meta.url));
const failFixture = fileURLToPath(new URL('fixtures/fail.ts', import.meta.url));

export default testSuite(({ describe }) => {
	describe('typescript', ({ test }) => {
		test('Pass ts', async () => {
			const results = await eslint.lintFiles(passFixtureTs);
			const [result] = results;

			expect(result.errorCount).toBe(0);
			expect(result.warningCount).toBe(0);
			expect(result.usedDeprecatedRules.length).toBe(0);
		});

		test('Pass mts', async ({ onTestFail }) => {
			const results = await eslint.lintFiles(passFixtureMts);
			const [result] = results;

			onTestFail(() => {
				console.log(result.messages);
			});

			expect(result.errorCount).toBe(0);
			expect(result.warningCount).toBe(0);
			expect(result.usedDeprecatedRules.length).toBe(0);
		});

		test('Fail cases', async () => {
			const results = await eslint.lintFiles(failFixture);
			const { messages } = results[0];

			expect(messages).toEqual(
				expect.arrayContaining([
					// expect.objectContaining({
					// 	ruleId: 'import/extensions',
					// 	message: 'Missing file extension "js" for "./some-file"',
					// 	severity: 2,
					// }),
					expect.objectContaining({
						ruleId: '@typescript-eslint/no-unused-vars',
						messageId: 'unusedVar',
						severity: 2,
					}),
					expect.objectContaining({
						ruleId: '@stylistic/member-delimiter-style',
						messageId: 'expectedSemi',
					}),
					expect.not.objectContaining({
						ruleId: '@stylistic/member-delimiter-style',
						messageId: 'expectedSemi',
					}),
				]),
			);

			expect(messages).toEqual(
				expect.not.arrayContaining([
					expect.objectContaining({
						ruleId: 'no-unused-vars',
					}),
				]),
			);
		});
	});
});
