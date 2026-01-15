import { fileURLToPath } from 'node:url';
import { testSuite, expect } from 'manten';
import { eslint } from '../utils/eslint.js';

export default testSuite(({ describe }) => {
	describe('base', ({ test, describe }) => {
		describe('Pass', ({ test }) => {
			test('.js', async ({ onTestFail }) => {
				const [result] = await eslint.lintFiles(
					fileURLToPath(new URL('fixtures/pass.js', import.meta.url)),
				);

				onTestFail(() => {
					console.log(result);
					console.log(result.usedDeprecatedRules);
				});

				expect(result.errorCount).toBe(0);
				expect(result.warningCount).toBe(0);
				expect(result.usedDeprecatedRules.length).toBe(0);
			});

			test('.cjs', async ({ onTestFail }) => {
				const [result] = await eslint.lintFiles(
					fileURLToPath(new URL('fixtures/pass.cjs', import.meta.url)),
				);

				onTestFail(() => {
					console.log(result);
					console.log(result.usedDeprecatedRules);
				});

				expect(result.errorCount).toBe(0);
				expect(result.warningCount).toBe(0);
				expect(result.usedDeprecatedRules.length).toBe(0);
			});
		});

		test('Fail cases', async ({ onTestFail }) => {
			const [result] = await eslint.lintFiles(
				fileURLToPath(new URL('fixtures/fail.js', import.meta.url)),
			);

			onTestFail(() => {
				console.log(result);
			});

			[
				// Move to different test file
				expect.objectContaining({
					ruleId: '@stylistic/padding-line-between-statements',
					message: 'Expected blank line before this statement.',
					line: 2,
				}),
				expect.objectContaining({
					ruleId: '@stylistic/object-curly-newline',
					messageId: 'expectedLinebreakAfterOpeningBrace',
					line: 2,
				}),
				expect.objectContaining({
					ruleId: '@stylistic/object-curly-newline',
					messageId: 'expectedLinebreakBeforeClosingBrace',
					line: 2,
				}),
				expect.objectContaining({
					ruleId: '@stylistic/semi',
					messageId: 'missingSemi',
				}),
				expect.objectContaining({
					ruleId: '@stylistic/quotes',
					message: 'Strings must use singlequote.',
				}),
				expect.objectContaining({
					ruleId: '@stylistic/eol-last',
					messageId: 'missing',
				}),
				expect.objectContaining({
					ruleId: '@stylistic/function-call-spacing',
					messageId: 'unexpectedWhitespace',
				}),
				expect.objectContaining({
					ruleId: '@stylistic/wrap-iife',
					messageId: 'wrapExpression',
				}),
				expect.objectContaining({
					ruleId: '@stylistic/operator-linebreak',
					messageId: 'operatorAtBeginning',
				}),
				expect.objectContaining({
					ruleId: '@stylistic/object-property-newline',
					messageId: 'propertiesOnNewline',
				}),
				expect.objectContaining({
					ruleId: 'curly',
					messageId: 'missingCurlyAfterCondition',
				}),
				expect.objectContaining({
					ruleId: 'func-names',
					messageId: 'unnamed',
				}),
				expect.objectContaining({
					ruleId: 'no-console',
					messageId: 'unexpected',
				}),
				expect.objectContaining({
					ruleId: 'import-x/max-dependencies',
					severity: 1,
					message: 'Maximum number of dependencies (15) exceeded.',
				}),
				expect.objectContaining({
					ruleId: 'import-x/extensions',
					message: 'Missing file extension "js" for "./some-file"',
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
					ruleId: 'regexp/prefer-d',
					messageId: 'unexpected',
				}),
				expect.objectContaining({
					ruleId: 'regexp/prefer-d',
					message: String.raw`Unexpected character class '[0-9]'. Use '\d' instead.`,
				}),
				expect.objectContaining({
					ruleId: 'regexp/prefer-w',
				}),
				expect.objectContaining({
					ruleId: 'no-extend-native',
				}),
				expect.objectContaining({
					ruleId: 'no-use-extend-native/no-use-extend-native',
				}),
			].forEach((matcher) => {
				expect(result.messages).toEqual(
					expect.arrayContaining([matcher]),
				);
			});
		});

		// External packages may use non-camelCase exports (e.g. Cloudflare's wrangler)
		test('camelcase ignores imports', async ({ onTestFail }) => {
			const [result] = await eslint.lintFiles(
				fileURLToPath(new URL('fixtures/camelcase-imports.js', import.meta.url)),
			);

			onTestFail(() => {
				console.log(result.messages);
			});

			const hasCamelcaseError = result.messages.some(
				message => message.ruleId === 'camelcase',
			);

			expect(hasCamelcaseError).toBe(false);
		});

		test('Service worker', async () => {
			const [result] = await eslint.lintFiles(
				fileURLToPath(new URL('fixtures/service-worker.sw.js', import.meta.url)),
			);

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
