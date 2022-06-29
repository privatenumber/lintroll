import path from 'path';
import { testSuite, expect } from 'manten';
import { eslint } from '../utils/eslint';

const fixturePass = path.join(__dirname, 'fixtures/PASS.md');
const fixtureFail = path.join(__dirname, 'fixtures/fail.md');

export default testSuite(({ describe }) => {
	describe('markdown', ({ test }) => {
		test('Pass', async () => {
			const results = await eslint.lintFiles([fixturePass]);
			const { messages } = results[0];

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
			const results = await eslint.lintFiles([fixtureFail]);
			const { messages } = results[0];

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
