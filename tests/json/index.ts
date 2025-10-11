import { fileURLToPath } from 'node:url';
import { testSuite, expect } from 'manten';
import { eslint } from '../utils/eslint.js';

export default testSuite(({ describe }) => {
	describe('json', ({ test }) => {
		test('package.json', async () => {
			const [results] = await eslint.lintFiles(
				fileURLToPath(new URL('fixtures/fail/package.json', import.meta.url)),
			);

			expect(results.messages).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						ruleId: 'jsonc/sort-keys',
						message: "Expected object keys to be in specified order. 'description' should be after 'version'.",
					}),
					expect.objectContaining({
						ruleId: 'jsonc/sort-keys',
						message: "Expected object keys to be in ascending order. 'a' should be before 'b'.",
					}),
					expect.objectContaining({
						ruleId: 'jsonc/sort-keys',
						message: "Expected object keys to be in ascending order. 'b' should be after 'a'.",
					}),
					expect.objectContaining({
						ruleId: 'jsonc/indent',
						messageId: 'wrongIndentation',
					}),
				]),
			);
		});

		test('random.json', async () => {
			const [result] = await eslint.lintFiles(
				fileURLToPath(new URL('fixtures/fail/random.json', import.meta.url)),
			);

			[
				expect.objectContaining({
					ruleId: 'jsonc/indent',
					messageId: 'wrongIndentation',
				}),
			].forEach((matcher) => {
				expect(result.messages).toEqual(
					expect.arrayContaining([matcher]),
				);
			});
		});

		test('renovate.json allows comments', async ({ onTestFail }) => {
			const [result] = await eslint.lintFiles(
				fileURLToPath(new URL('fixtures/pass/renovate.json', import.meta.url)),
			);

			onTestFail(() => {
				console.log(result);
			});

			expect(result.errorCount).toBe(0);
			expect(result.warningCount).toBe(0);
		});
	});
});
