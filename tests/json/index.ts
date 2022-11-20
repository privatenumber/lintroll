import path from 'path';
import { testSuite, expect } from 'manten';
import { eslint } from '../utils/eslint.js';

export default testSuite(({ describe }) => {
	describe('json', ({ test }) => {
		test('package.json', async () => {
			const fixturePath = path.join(__dirname, 'fixtures/package.json');
			const [results] = await eslint.lintFiles(fixturePath);

			expect(results.messages).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						messageId: 'wrongIndentation',
						ruleId: 'jsonc/indent',
					}),
					expect.objectContaining({
						messageId: 'sortKeys',
						ruleId: 'jsonc/sort-keys',
					}),
				]),
			);
		});

		test('random.json', async () => {
			const fixturePath = path.join(__dirname, 'fixtures/random.json');
			const [results] = await eslint.lintFiles(fixturePath);

			expect(results.messages).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						messageId: 'wrongIndentation',
						ruleId: 'jsonc/indent',
					}),
				]),
			);
		});
	});
});
