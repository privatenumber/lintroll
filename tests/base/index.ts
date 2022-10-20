import path from 'path';
import { testSuite, expect } from 'manten';
import { eslint } from '../utils/eslint';

const passFixture = path.join(__dirname, 'fixtures/pass.js');
const failFixture = path.join(__dirname, 'fixtures/fail.js');
const swFixture = path.join(__dirname, 'fixtures/service-worker.sw.js');
const packageJsonFixture = path.join(__dirname, 'fixtures/package.json');
const jsonFixture = path.join(__dirname, 'fixtures/random.json');

export default testSuite(({ describe }) => {
	describe('base', ({ test }) => {
		test('Pass cases', async () => {
			const results = await eslint.lintFiles([passFixture]);
			const [result] = results;

			expect(result.errorCount).toBe(0);
			expect(result.warningCount).toBe(0);
			expect(result.usedDeprecatedRules.length).toBe(0);
		});

		test('Fail cases', async () => {
			const results = await eslint.lintFiles([failFixture]);
			const { messages } = results[0];

			expect(messages).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						ruleId: 'unicorn/no-process-exit',
						messageId: 'no-process-exit',
					}),
					expect.objectContaining({
						ruleId: 'unicorn/no-new-buffer',
						messageId: 'error',
					}),
					expect.objectContaining({
						ruleId: 'node/no-deprecated-api',
						message: "'new Buffer()' was deprecated since v6.0.0. Use 'Buffer.alloc()' or 'Buffer.from()' instead.",
					}),
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
						ruleId: 'node/file-extension-in-import',
						messageId: 'requireExt',
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
			const results = await eslint.lintFiles([swFixture]);
			const [result] = results;

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

	describe('json', ({ test }) => {
		test('package.json', async () => {
			const results = await eslint.lintFiles([packageJsonFixture]);
			const { messages } = results[0];

			expect(messages).toEqual(
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
			const results = await eslint.lintFiles([jsonFixture]);
			const { messages } = results[0];

			expect(messages).toEqual(
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
