import { fileURLToPath } from 'url';
import { testSuite, expect } from 'manten';
import { eslint, createEslint } from '../utils/eslint.js';

export default testSuite(({ describe }) => {
	describe('markdown', ({ describe }) => {
		describe('Pass', ({ test }) => {
			test('.js', async ({ onTestFail }) => {
				const [result] = await eslint.lintFiles(
					fileURLToPath(new URL('fixtures/pass.js.md', import.meta.url)),
				);

				onTestFail(() => {
					console.log(result);
				});

				expect(result.usedDeprecatedRules.length).toBe(0);
				expect(result.errorCount).toBe(0);
			});

			test('.js with node', async ({ onTestFail }) => {
				const [result] = await createEslint({ node: true }).lintFiles(
					fileURLToPath(new URL('fixtures/pass.js.md', import.meta.url)),
				);

				onTestFail(() => {
					console.log(result);
				});

				expect(result.usedDeprecatedRules.length).toBe(0);
				expect(result.errorCount).toBe(0);
			});

			test('.ts', async ({ onTestFail }) => {
				const [result] = await eslint.lintFiles(
					fileURLToPath(new URL('fixtures/pass.ts.md', import.meta.url)),
				);
				const { messages } = result;

				onTestFail(() => {
					console.log(messages);
				});

				expect(result.usedDeprecatedRules.length).toBe(0);
				expect(messages.length).toBe(1);
				expect(messages).toEqual(
					expect.arrayContaining([
						expect.objectContaining({
							ruleId: '@typescript-eslint/no-unused-vars',
							severity: 1,
						}),
					]),
				);
			});

			test('.vue', async ({ onTestFail }) => {
				const [result] = await eslint.lintFiles(
					fileURLToPath(new URL('fixtures/pass.vue.md', import.meta.url)),
				);
				const { messages } = result;

				onTestFail(() => {
					console.log(messages);
				});

				expect(result.usedDeprecatedRules.length).toBe(0);
				expect(messages.length).toBe(1);
				expect(messages).toEqual(
					expect.arrayContaining([
						expect.objectContaining({
							ruleId: 'vue/no-undef-components',
							severity: 1,
						}),
					]),
				);
			});
		});

		describe('Fail', ({ test }) => {
			test('.js', async () => {
				const [result] = await eslint.lintFiles(
					fileURLToPath(new URL('fixtures/fail.js.md', import.meta.url)),
				);

				[
					expect.objectContaining({
						ruleId: '@stylistic/semi',
						messageId: 'extraSemi',
						severity: 2,
					}),

					expect.objectContaining({
						ruleId: '@stylistic/comma-dangle',
						messageId: 'unexpected',
						severity: 2,
					}),

					expect.objectContaining({
						ruleId: '@stylistic/indent',
						messageId: 'wrongIndentation',
						severity: 2,
					}),

					expect.objectContaining({
						ruleId: '@stylistic/no-multiple-empty-lines',
						messageId: 'blankEndOfFile',
						severity: 2,
					}),

					expect.objectContaining({
						ruleId: 'no-unused-vars',
						messageId: 'unusedVar',
						severity: 1,
					}),
				].forEach((matcher) => {
					expect(result.messages).toEqual(
						expect.arrayContaining([matcher]),
					);
				});
			});

			test('.ts', async () => {
				const [result] = await eslint.lintFiles(
					fileURLToPath(new URL('fixtures/fail.ts.md', import.meta.url)),
				);

				[
					expect.objectContaining({
						ruleId: '@stylistic/semi',
						messageId: 'extraSemi',
						severity: 2,
					}),

					expect.objectContaining({
						ruleId: '@stylistic/comma-dangle',
						messageId: 'unexpected',
						severity: 2,
					}),

					expect.objectContaining({
						ruleId: '@stylistic/indent',
						messageId: 'wrongIndentation',
						severity: 2,
					}),

					expect.objectContaining({
						ruleId: '@stylistic/no-multiple-empty-lines',
						messageId: 'blankEndOfFile',
						severity: 2,
					}),

					expect.objectContaining({
						ruleId: '@typescript-eslint/no-unused-vars',
						messageId: 'unusedVar',
						severity: 1,
					}),
				].forEach((matcher) => {
					expect(result.messages).toEqual(
						expect.arrayContaining([matcher]),
					);
				});
			});
		});
	});
});
