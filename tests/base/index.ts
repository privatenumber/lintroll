import path from 'path';
import { testSuite, expect } from 'manten';
import { eslint } from '../utils/eslint.js';

export default testSuite(({ describe }) => {
	describe('base', ({ test }) => {
		test('Pass cases', async ({ onTestFail }) => {
			const fixturePath = path.join(__dirname, 'fixtures/pass.js');
			const [result] = await eslint.lintFiles(fixturePath);

			onTestFail(() => {
				console.log(result);
			});

			expect(result.errorCount).toBe(0);
			expect(result.warningCount).toBe(0);
			expect(result.usedDeprecatedRules.length).toBe(0);
		});

		test('Fail cases', async ({ onTestFail }) => {
			const fixturePath = path.join(__dirname, 'fixtures/fail.js');
			const [result] = await eslint.lintFiles(fixturePath);

			onTestFail(() => {
				console.log(result);
			});

			expect(result.messages).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						line: 2,
						message: 'Expected blank line before this statement.',
						ruleId: 'padding-line-between-statements',
					}),
					expect.objectContaining({
						messageId: 'missingSemi',
						ruleId: 'semi',
					}),
					expect.objectContaining({
						message: 'Strings must use singlequote.',
						ruleId: 'quotes',
					}),
					expect.objectContaining({
						messageId: 'unexpected',
						ruleId: 'no-console',
					}),
					expect.objectContaining({
						messageId: 'missing',
						ruleId: 'eol-last',
					}),
					expect.objectContaining({
						message: 'Maximum number of dependencies (15) exceeded.',
						ruleId: 'import/max-dependencies',
						severity: 1,
					}),
					expect.objectContaining({
						message: 'Missing file extension "js" for "./some-file"',
						ruleId: 'import/extensions',
					}),
					expect.objectContaining({
						messageId: 'unexpectedWhitespace',
						ruleId: 'func-call-spacing',
					}),
					expect.objectContaining({
						messageId: 'wrapExpression',
						ruleId: 'wrap-iife',
					}),
					expect.objectContaining({
						messageId: 'unnamed',
						ruleId: 'func-names',
					}),
					expect.objectContaining({
						message: 'Prefer `Number.isFinite` over `isFinite`.',
						ruleId: 'unicorn/prefer-number-properties',
					}),
					expect.objectContaining({
						message: 'Prefer `Number.isNaN` over `isNaN`.',
						ruleId: 'unicorn/prefer-number-properties',
					}),
					expect.objectContaining({
						messageId: 'missingCurlyAfterCondition',
						ruleId: 'curly',
					}),
					expect.objectContaining({
						messageId: 'unexpected',
						ruleId: 'regexp/prefer-d',
					}),
					expect.objectContaining({
						messageId: 'operatorAtBeginning',
						ruleId: 'operator-linebreak',
					}),
					expect.objectContaining({
						message: 'Unexpected character class \'[0-9]\'. Use \'\\d\' instead.',
						ruleId: 'regexp/prefer-d',
					}),
					expect.objectContaining({
						ruleId: 'regexp/prefer-w',
					}),
				]),
			);
		});

		test('Service worker', async () => {
			const fixturePath = path.join(__dirname, 'fixtures/service-worker.sw.js');
			const [result] = await eslint.lintFiles(fixturePath);

			expect(result.errorCount).toBe(0);
			expect(result.warningCount).toBe(0);
			expect(result.messages).not.toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						message: "Unexpected use of 'self'.",
						ruleId: 'no-restricted-globals',
					}),
				]),
			);
		});
	});
});
