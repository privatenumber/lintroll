import path from 'path';
import { testSuite, expect } from 'manten';
import { eslint } from '../utils/eslint.js';

export default testSuite(({ describe }) => {
	describe('json', ({ test }) => {
		test('package.json', async () => {
			const fixturePath = path.join(__dirname, 'fixtures/fail/package.json');
			const [results] = await eslint.lintFiles(fixturePath);

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
			const fixturePath = path.join(__dirname, 'fixtures/fail/random.json');
			const [results] = await eslint.lintFiles(fixturePath);

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
