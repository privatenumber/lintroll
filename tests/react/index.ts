import path from 'path';
import { testSuite, expect } from 'manten';
import { createEslint } from '../utils/eslint';

const eslint = createEslint({
	rules: {
		'import/no-extraneous-dependencies': 'off',
	},
});

const passFixture = path.join(__dirname, 'fixtures/InputComponent.tsx');
const failFixture = path.join(__dirname, 'fixtures/fail.tsx');

export default testSuite(({ describe }) => {
	describe('react', ({ test }) => {
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

			expect(messages).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						ruleId: 'jsx-quotes',
						messageId: 'unexpected',
					}),
					expect.objectContaining({
						ruleId: 'unicorn/filename-case',
						messageId: 'filename-case',
					}),
					expect.objectContaining({
						ruleId: 'react/react-in-jsx-scope',
						messageId: 'notInScope',
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
