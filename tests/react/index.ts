import { fileURLToPath } from 'url';
import { testSuite, expect } from 'manten';
import { eslint } from '../utils/eslint.js';

const passFixture = fileURLToPath(new URL('fixtures/InputComponent.tsx', import.meta.url));
const failFixture = fileURLToPath(new URL('fixtures/fail.tsx', import.meta.url));

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
			const [result] = await eslint.lintFiles(failFixture);

			[
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
			].forEach((matcher) => {
				expect(result.messages).toEqual(
					expect.arrayContaining([matcher]),
				);
			});
		});
	});
});
