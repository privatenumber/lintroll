import { testSuite, expect } from 'manten';
import { eslint } from '../utils/eslint.js';

export default testSuite(({ describe }) => {
	describe('eslint-comments', ({ test }) => {
		test('Fail cases', async ({ onTestFail }) => {
			const [result] = await eslint.lintFiles(
				new URL('fixtures/src/fail.js', import.meta.url).pathname,
			);

			onTestFail(() => {
				console.log(result);
			});

			expect(result.messages).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						ruleId: 'unicorn/no-abusive-eslint-disable',
						severity: 2,
						message: 'Specify the rules you want to disable.',
						messageId: 'no-abusive-eslint-disable',
					}),

					// TODO: Migrate to https://github.com/eslint-community/eslint-plugin-eslint-comments
					// expect.objectContaining({
					// 	ruleId: 'eslint-comments/no-unused-disable',
					// 	severity: 2,
					// }),
				]),
			);
		});
	});
});
