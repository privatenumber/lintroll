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
						ruleId: 'padding-line-between-statements',
						message: 'Expected blank line before this statement.',
						line: 2,
					}),
					expect.objectContaining({
						ruleId: 'semi',
						messageId: 'missingSemi',
					}),
					expect.objectContaining({
						ruleId: 'quotes',
						message: 'Strings must use singlequote.',
					}),
					expect.objectContaining({
						ruleId: 'no-console',
						messageId: 'unexpected',
					}),
					expect.objectContaining({
						ruleId: 'eol-last',
						messageId: 'missing',
					}),
					expect.objectContaining({
						ruleId: 'import/max-dependencies',
						severity: 1,
						message: 'Maximum number of dependencies (15) exceeded.',
					}),
					expect.objectContaining({
						ruleId: 'import/extensions',
						message: 'Missing file extension "js" for "./some-file"',
					}),
					expect.objectContaining({
						ruleId: 'func-call-spacing',
						messageId: 'unexpectedWhitespace',
					}),
					expect.objectContaining({
						ruleId: 'wrap-iife',
						messageId: 'wrapExpression',
					}),
					expect.objectContaining({
						ruleId: 'func-names',
						messageId: 'unnamed',
					}),
					expect.objectContaining({
						ruleId: 'unicorn/prefer-number-properties',
						message: 'Prefer `Number.isFinite` over `isFinite`.',
					}),
					expect.objectContaining({
						ruleId: 'unicorn/prefer-number-properties',
						message: 'Prefer `Number.isNaN` over `isNaN`.',
					}),
					expect.objectContaining({
						ruleId: 'curly',
						messageId: 'missingCurlyAfterCondition',
					}),
					expect.objectContaining({
						ruleId: 'regexp/prefer-d',
						messageId: 'unexpected',
					}),
					expect.objectContaining({
						ruleId: 'operator-linebreak',
						messageId: 'operatorAtBeginning',
					}),
					expect.objectContaining({
						ruleId: 'regexp/prefer-d',
						message: 'Unexpected character class \'[0-9]\'. Use \'\\d\' instead.',
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
						ruleId: 'no-restricted-globals',
						message: "Unexpected use of 'self'.",
					}),
				]),
			);
		});
	});
});
