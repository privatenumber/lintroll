import path from 'path';
import { testSuite, expect } from 'manten';
import { createEslint } from '../utils/eslint.js';

const eslint = createEslint({
	rules: {
		'import/no-extraneous-dependencies': 'off',
	},
});

const passFixture = path.join(__dirname, 'fixtures/InputComponent.tsx');
const failFixture = path.join(__dirname, 'fixtures/fail.tsx');

export default testSuite(({ describe }) => {
	describe('react', ({ test }) => {
		test('Pass cases', async ({ onTestFail }) => {
			const [result] = await eslint.lintFiles(passFixture);

			onTestFail(() => {
				console.log(result);
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
						messageId: 'unexpected',
						ruleId: 'jsx-quotes',
					}),
					expect.objectContaining({
						messageId: 'filename-case',
						ruleId: 'unicorn/filename-case',
					}),
					expect.objectContaining({
						messageId: 'missingPropType',
						ruleId: 'react/prop-types',
					}),
					expect.objectContaining({
						messageId: 'newLine',
						ruleId: 'react/jsx-max-props-per-line',
					}),
				]),
			);
		});
	});
});
