import { fileURLToPath } from 'url';
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
						ruleId: 'jsonc/indent',
						messageId: 'wrongIndentation',
					}),
					expect.objectContaining({
						ruleId: 'jsonc/sort-keys',
						messageId: 'sortKeys',
					}),
				]),
			);
		});

		test('random.json', async () => {
			const [results] = await eslint.lintFiles(
				fileURLToPath(new URL('fixtures/fail/random.json', import.meta.url)),
			);

			expect(results.messages).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						ruleId: 'jsonc/indent',
						messageId: 'wrongIndentation',
					}),
				]),
			);
		});
	});
});
