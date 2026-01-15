import { fileURLToPath } from 'node:url';
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

		// React 17+ with new JSX transform doesn't require importing React
		test('does not require React import for JSX', async ({ onTestFail }) => {
			const [result] = await eslint.lintFiles(passFixture);

			onTestFail(() => {
				console.log(result.messages);
			});

			const hasReactScopeError = result.messages.some(
				message => message.ruleId === 'react/react-in-jsx-scope',
			);

			expect(hasReactScopeError).toBe(false);
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
					ruleId: '@stylistic/jsx-max-props-per-line',
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
