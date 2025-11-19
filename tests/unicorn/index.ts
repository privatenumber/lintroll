import { fileURLToPath } from 'node:url';
import { testSuite, expect } from 'manten';
import { eslint } from '../utils/eslint.js';

export default testSuite(({ describe }) => {
	describe('unicorn', ({ test }) => {
		test('no-array-sort is a warning', async ({ onTestFail }) => {
			const [result] = await eslint.lintFiles(
				fileURLToPath(new URL('fixtures/array-sort.js', import.meta.url)),
			);

			onTestFail(() => {
				console.log(result);
			});

			expect(result.messages).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						ruleId: 'unicorn/no-array-sort',
						severity: 1, // 1 = warning, 2 = error
					}),
				]),
			);

			// Verify it's not an error
			expect(result.errorCount).toBe(0);
			expect(result.warningCount).toBeGreaterThan(0);
		});

		test('allows certain abbreviations', async ({ onTestFail }) => {
			const [result] = await eslint.lintFiles(
				fileURLToPath(new URL('fixtures/abbreviations.js', import.meta.url)),
			);

			onTestFail(() => {
				console.log(result.messages);
			});

			// Should not have any errors about prevent-abbreviations
			const abbreviationErrors = result.messages.filter(
				message => message.ruleId === 'unicorn/prevent-abbreviations',
			);

			expect(abbreviationErrors.length).toBe(0);
			expect(result.errorCount).toBe(0);
		});
	});
});
