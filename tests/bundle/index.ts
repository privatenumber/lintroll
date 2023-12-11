import { fileURLToPath } from 'url';
import { testSuite, expect } from 'manten';
import { eslint } from '../utils/eslint.js';

export default testSuite(({ describe }) => {
	describe('bundle', ({ test }) => {
		test('Pass cases', async ({ onTestFail }) => {
			const [result] = await eslint.lintFiles(
				fileURLToPath(new URL('fixtures/src/pass.js', import.meta.url)),
			);

			onTestFail(() => {
				console.log(result);
				console.log(result.usedDeprecatedRules);
			});

			expect(result.errorCount).toBe(0);
			expect(result.warningCount).toBe(0);
			expect(result.usedDeprecatedRules.length).toBe(0);
		});

		test('Fail cases', async ({ onTestFail }) => {
			const [result] = await eslint.lintFiles(
				fileURLToPath(new URL('fixtures/src/fail.cjs', import.meta.url)),
			);

			onTestFail(() => {
				console.log(result);
			});

			expect(result.messages).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						ruleId: 'import/no-dynamic-require',
						nodeType: 'CallExpression',
						severity: 2,
					}),
				]),
			);
		});
		test('Fail cases .mjs', async ({ onTestFail }) => {
			const [result] = await eslint.lintFiles(
				fileURLToPath(new URL('fixtures/src/fail.mjs', import.meta.url)),
			);

			onTestFail(() => {
				console.log(result);
			});

			expect(result.messages).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						ruleId: 'no-undef',
						messageId: 'undef',
						message: "'require' is not defined.",
						severity: 2,
					}),
					expect.objectContaining({
						ruleId: 'import/no-dynamic-require',
						nodeType: 'CallExpression',
						severity: 2,
					}),
				]),
			);
		});
	});
});
