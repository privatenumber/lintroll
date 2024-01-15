import { fileURLToPath } from 'url';
import { testSuite, expect } from 'manten';
import { eslint } from '../utils/eslint.js';

export default testSuite(({ describe }) => {
	describe('vue', ({ describe }) => {
		describe('Pass', ({ test }) => {
			test('SFC', async ({ onTestFail }) => {
				const results = await eslint.lintFiles(
					fileURLToPath(new URL('fixtures/PassingComponent.vue', import.meta.url)),
				);

				const [result] = results;

				onTestFail(() => {
					console.dir(result);
					console.log(result.usedDeprecatedRules);
				});

				expect(result.errorCount).toBe(0);
				expect(result.warningCount).toBe(0);
				expect(result.usedDeprecatedRules.length).toBe(0);
			});

			test('SFC setup', async ({ onTestFail }) => {
				const results = await eslint.lintFiles(
					fileURLToPath(new URL('fixtures/PassSetup.vue', import.meta.url)),
				);

				const [result] = results;

				onTestFail(() => {
					console.dir(result);
					console.log(result.usedDeprecatedRules);
				});

				expect(result.errorCount).toBe(0);
				expect(result.warningCount).toBe(0);
				expect(result.usedDeprecatedRules.length).toBe(0);
			});
		});

		describe('Fail', ({ test }) => {
			test('SFC', async ({ onTestFail }) => {
				const [result] = await eslint.lintFiles(
					fileURLToPath(new URL('fixtures/fail/fail.vue', import.meta.url)),
				);

				onTestFail(() => {
					console.dir(result, {
						colors: true,
						depth: null,
						maxArrayLength: null,
					});
				});

				[
					expect.objectContaining({
						ruleId: 'unicorn/filename-case',
						message: 'Filename is not in pascal case. Rename it to `Fail.vue`.',
					}),
					expect.objectContaining({
						ruleId: 'vue/comment-directive',
						messageId: 'unusedRule',
					}),
					expect.objectContaining({
						ruleId: 'vue/html-quotes',
						message: 'Expected to be enclosed by double quotes.',
					}),
					expect.objectContaining({
						ruleId: '@stylistic/eol-last',
						messageId: 'missing',
					}),
				].forEach((matcher) => {
					expect(result.messages).toEqual(
						expect.arrayContaining([matcher]),
					);
				});
			});

			test('SFC setup', async ({ onTestFail }) => {
				const [result] = await eslint.lintFiles(
					fileURLToPath(new URL('fixtures/fail/Setup.vue', import.meta.url)),
				);

				onTestFail(() => {
					console.dir(result, {
						colors: true,
						depth: null,
						maxArrayLength: null,
					});
				});

				[
					expect.objectContaining({
						ruleId: 'vue/block-order',
						messageId: 'unexpected',
					}),

					expect.objectContaining({
						ruleId: 'vue/no-dupe-keys',
						messageId: 'duplicateKey',
					}),

					expect.objectContaining({
						ruleId: '@stylistic/semi',
						messageId: 'missingSemi',
					}),

					expect.objectContaining({
						ruleId: '@stylistic/no-multiple-empty-lines',
						messageId: 'consecutiveBlank',
					}),
				].forEach((matcher) => {
					expect(result.messages).toEqual(
						expect.arrayContaining([matcher]),
					);
				});
			});

			test('SFC parsing TS in setup with no lang="ts"', async ({ onTestFail }) => {
				const [result] = await eslint.lintFiles(
					fileURLToPath(new URL('fixtures/fail/SetupNoLangTs.vue', import.meta.url)),
				);

				onTestFail(() => {
					console.dir(result, {
						colors: true,
						depth: null,
						maxArrayLength: null,
					});
				});

				[
					expect.objectContaining({
						ruleId: null,
						fatal: true,
						line: 2,
						message: 'Parsing error: Unexpected token )',
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
