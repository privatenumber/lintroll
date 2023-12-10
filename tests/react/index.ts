import { testSuite, expect } from 'manten';
import { eslint } from '../utils/eslint.js';

const passFixture = new URL('fixtures/InputComponent.tsx', import.meta.url).pathname;
const failFixture = new URL('fixtures/fail.tsx', import.meta.url).pathname;

export default testSuite(({ describe }) => {
	describe('react', ({ test }) => {
		test('Pass cases', async ({ onTestFail }) => {
			const [result] = await eslint.lintFiles(passFixture);

			onTestFail(() => {
				console.log(result);
				console.log(result.usedDeprecatedRules);
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
					expect.objectContaining({
						ruleId: '@stylistic/jsx-quotes',
						messageId: 'unexpected',
					}),
					expect.objectContaining({
						ruleId: 'unicorn/filename-case',
						messageId: 'filename-case',
					}),
					expect.objectContaining({
						ruleId: 'react/prop-types',
						messageId: 'missingPropType',
					}),
					expect.objectContaining({
						ruleId: 'react/jsx-max-props-per-line',
						messageId: 'newLine',
					}),
				]),
			);
		});
	});
});
