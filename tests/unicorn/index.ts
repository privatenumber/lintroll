import { fileURLToPath } from 'node:url';
import { testSuite, expect } from 'manten';
import { eslint } from '../utils/eslint.js';

export default testSuite(({ describe }) => {
	describe('unicorn', ({ test }) => {
		test('allows slice().sort() pattern', async ({ onTestFail }) => {
			const [result] = await eslint.lintFiles(
				fileURLToPath(new URL('fixtures/array-sort.js', import.meta.url)),
			);

			onTestFail(() => {
				console.log(result.messages);
			});

			// no-array-sort is disabled, so slice().sort() should pass
			const hasArraySortError = result.messages.some(
				message => message.ruleId === 'unicorn/no-array-sort',
			);

			expect(hasArraySortError).toBe(false);
			expect(result.errorCount).toBe(0);
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
