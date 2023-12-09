import path from 'path';
import { testSuite, expect } from 'manten';
import { eslint } from '../utils/eslint.js';

const passFixture = path.join(__dirname, 'fixtures/PassingComponent.vue');
const passSetupFixture = path.join(__dirname, 'fixtures/PassSetup.vue');
const failFixture = path.join(__dirname, 'fixtures/fail/fail.vue');
const failSetupFixture = path.join(__dirname, 'fixtures/fail/FailSetup.vue');

export default testSuite(({ describe }) => {
	describe('vue', ({ test }) => {
		test('Pass cases', async ({ onTestFail }) => {
			const results = await eslint.lintFiles([
				passFixture,
				passSetupFixture,
			]);
			const [result] = results;

			onTestFail(() => {
				console.dir(result);
				console.log(result.usedDeprecatedRules);
			});

			expect(result.errorCount).toBe(0);
			expect(result.warningCount).toBe(0);
			expect(result.usedDeprecatedRules.length).toBe(0);
		});

		test('Fail cases', async ({ onTestFail }) => {
			const results = await eslint.lintFiles(failFixture);
			const { messages } = results[0];

			onTestFail(() => {
				console.dir(results, { colors: true, depth: null, maxArrayLength: null });
			});

			expect(messages).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						ruleId: 'unicorn/filename-case',
						message: 'Filename is not in pascal case. Rename it to `Fail.vue`.',
					}),
					expect.objectContaining({
						ruleId: 'vue/html-quotes',
						message: 'Expected to be enclosed by double quotes.',
					}),
					expect.objectContaining({
						ruleId: '@stylistic/eol-last',
						messageId: 'missing',
					}),
				]),
			);
		});

		test('Fail setup', async ({ onTestFail }) => {
			const results = await eslint.lintFiles(failSetupFixture);
			const { messages } = results[0];

			onTestFail(() => {
				console.dir(results, { colors: true, depth: null, maxArrayLength: null });
			});

			expect(messages).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						ruleId: 'vue/block-order',
						message: "'<script setup>' should be above '<template>' on line 1.",
					}),
				]),
			);
		});
	});
});
