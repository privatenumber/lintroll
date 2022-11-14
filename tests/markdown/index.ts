import path from 'path';
import { testSuite, expect } from 'manten';
import { eslint } from '../utils/eslint.js';

const fixturePass = path.join(__dirname, 'fixtures/PASS.md');
const fixtureFail = path.join(__dirname, 'fixtures/fail.md');

export default testSuite(({ describe }) => {
	describe('markdown', ({ test }) => {
		test('Pass', async ({ onTestFail }) => {
			const [result] = await eslint.lintFiles(fixturePass);
			const { messages } = result;

			onTestFail(() => {
				console.log(messages);
			});

			expect(messages.length).toBe(2);
			expect(messages).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						ruleId: '@typescript-eslint/no-unused-vars',
						severity: 1,
					}),
					expect.objectContaining({
						ruleId: 'no-unused-vars',
						severity: 1,
					}),
				]),
			);
		});

		test('Fail', async () => {
			const [result] = await eslint.lintFiles(fixtureFail);
			const { messages } = result;

			expect(messages).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						ruleId: 'semi',
						messageId: 'extraSemi',
					}),

					expect.objectContaining({
						ruleId: 'comma-dangle',
						messageId: 'unexpected',
					}),

					expect.objectContaining({
						ruleId: 'indent',
						messageId: 'wrongIndentation',
					}),

					expect.objectContaining({
						ruleId: 'no-multiple-empty-lines',
						messageId: 'blankEndOfFile',
					}),

					expect.objectContaining({
						ruleId: '@typescript-eslint/indent',
						messageId: 'wrongIndentation',
					}),

					expect.objectContaining({
						ruleId: '@typescript-eslint/semi',
						messageId: 'extraSemi',
					}),
				]),
			);
		});
	});
});
