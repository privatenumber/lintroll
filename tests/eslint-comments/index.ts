import { fileURLToPath } from 'node:url';
import {
	describe, test, expect, onTestFail,
} from 'manten';
import { eslint } from '../utils/eslint.js';

describe('eslint-comments', () => {
	test('Fail cases', async () => {
		const [result] = await eslint.lintFiles(
			fileURLToPath(new URL('fixtures/src/fail.js', import.meta.url)),
		);

		onTestFail(() => {
			console.log(result);
		});

		[
			expect.objectContaining({
				ruleId: 'some-rule',
				message: "Definition for rule 'some-rule' was not found.",
				severity: 2,
			}),
			expect.objectContaining({
				ruleId: null,
				message: "Unused eslint-disable directive (no problems were reported from 'eqeqeq').",
				severity: 1,
			}),
			expect.objectContaining({
				ruleId: '@eslint-community/eslint-comments/no-unlimited-disable',
				messageId: 'unexpected',
				severity: 2,
			}),
		].forEach((matcher) => {
			expect(result.messages).toEqual(
				expect.arrayContaining([matcher]),
			);
		});
	});
});
