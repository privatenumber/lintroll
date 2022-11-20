import path from 'path';
import { testSuite, expect } from 'manten';
import { eslint } from '../utils/eslint.js';

const passFixture = path.join(__dirname, 'fixtures/PassingComponent.vue');
const passSetupFixture = path.join(__dirname, 'fixtures/PassSetup.vue');
const failFixture = path.join(__dirname, 'fixtures/fail.vue');

export default testSuite(({ describe }) => {
	describe('vue', ({ test }) => {
		test('Pass cases', async () => {
			const results = await eslint.lintFiles([
				passFixture,
				passSetupFixture,
			]);
			const [result] = results;

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
						message: 'Filename is not in pascal case. Rename it to `Fail.vue`.',
						ruleId: 'unicorn/filename-case',
					}),
					expect.objectContaining({
						message: 'Expected to be enclosed by double quotes.',
						ruleId: 'vue/html-quotes',
					}),
					expect.objectContaining({
						messageId: 'missing',
						ruleId: 'eol-last',
					}),
				]),
			);
		});
	});
});
