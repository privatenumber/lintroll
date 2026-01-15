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

		// Disabled due to false positives on string properties named 'size'
		// https://github.com/sindresorhus/eslint-plugin-unicorn/issues/1266
		test('explicit-length-check is disabled', async ({ onTestFail }) => {
			const [result] = await eslint.lintFiles(
				fileURLToPath(new URL('fixtures/explicit-length-check.js', import.meta.url)),
			);

			onTestFail(() => {
				console.log(result.messages);
			});

			const hasLengthCheckError = result.messages.some(
				message => message.ruleId === 'unicorn/explicit-length-check',
			);

			expect(hasLengthCheckError).toBe(false);
		});
	});
});
