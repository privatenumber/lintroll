import {
	describe, test, expect, onTestFail,
} from 'manten';
import { createFixture } from 'fs-fixture';
import { eslintDirectivesFixture } from '../fixtures/eslint-directives.ts';
import { createEslint } from '../utils/eslint.ts';

describe('eslint-comments', () => {
	test('Fail cases', async () => {
		await using fixture = await createFixture(eslintDirectivesFixture);

		const [result] = await createEslint(fixture.path).lintFiles(fixture.getPath('src/fail.js'));

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
