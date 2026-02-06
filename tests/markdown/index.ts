import { fileURLToPath } from 'node:url';
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

				// Should only have warnings, no errors
				expect(result.errorCount).toBe(0);

				// no-shadow should be disabled for markdown TS code fences
				// (allows idiomatic patterns like manten's scoped test function)
				expect(messages).not.toEqual(
					expect.arrayContaining([
						expect.objectContaining({
							ruleId: '@typescript-eslint/no-shadow',
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

			test('.json', async ({ onTestFail }) => {
				const [result] = await eslint.lintFiles(
					fileURLToPath(new URL('fixtures/pass.json.md', import.meta.url)),
				);
				const { messages } = result;

				onTestFail(() => {
					console.log(messages);
				});

				expect(result.usedDeprecatedRules.length).toBe(0);
				expect(result.errorCount).toBe(0);
			});
		});

		describe('Instructional markdown', ({ test }) => {
			test('ignores code blocks in skill files', async ({ onTestFail }) => {
				const results = await eslint.lintFiles(
					fileURLToPath(new URL('fixtures/skills/example-skill/SKILL.md', import.meta.url)),
				);

				onTestFail(() => {
					console.log(results.map(r => ({
						filePath: r.filePath,
						messages: r.messages,
					})));
				});

				for (const result of results) {
					expect(result.errorCount).toBe(0);
					expect(result.warningCount).toBe(0);
				}
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
