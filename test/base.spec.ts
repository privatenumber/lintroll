import path from 'path';
import { test, expect } from 'vitest';
import { eslint } from './utils/eslint';
import './utils/chai-contain-object';

const passFixture = path.join(__dirname, 'fixtures/base/pass.js');
const failFixture = path.join(__dirname, 'fixtures/base/fail.js');
const swFixture = path.join(__dirname, 'fixtures/base/service-worker.sw.js');

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

	expect(messages).to.containObject({
		ruleId: 'unicorn/no-process-exit',
		messageId: 'no-process-exit',
	});

	expect(messages).to.containObject({
		ruleId: 'unicorn/no-new-buffer',
		messageId: 'error',
	});

	expect(messages).to.containObject({
		ruleId: 'node/no-deprecated-api',
		message: "'new Buffer()' was deprecated since v6.0.0. Use 'Buffer.alloc()' or 'Buffer.from()' instead.",
	});

	expect(messages).to.containObject({
		ruleId: 'padding-line-between-statements',
		message: 'Expected blank line before this statement.',
		line: 2,
	});

	expect(messages).to.containObject({
		ruleId: 'semi',
		messageId: 'missingSemi',
	});

	expect(messages).to.containObject({
		ruleId: 'quotes',
		message: 'Strings must use singlequote.',
	});

	expect(messages).to.containObject({
		ruleId: 'no-console',
		messageId: 'unexpected',
	});

	expect(messages).to.containObject({
		ruleId: 'eol-last',
		messageId: 'missing',
	});

	expect(messages).to.containObject({
		ruleId: 'node/file-extension-in-import',
		messageId: 'requireExt',
	});

	expect(messages).to.containObject({
		ruleId: 'import/max-dependencies',
		severity: 1,
		message: 'Maximum number of dependencies (15) exceeded.',
	});

	expect(messages).to.containObject({
		ruleId: 'import/extensions',
		message: 'Missing file extension "js" for "./some-file"',
	});

	expect(messages).to.containObject({
		ruleId: 'func-call-spacing',
		messageId: 'unexpectedWhitespace',
	});

	expect(messages).to.containObject({
		ruleId: 'wrap-iife',
		messageId: 'wrapExpression',
	});

	expect(messages).to.containObject({
		ruleId: 'func-names',
		messageId: 'unnamed',
	});

	expect(messages).to.containObject({
		ruleId: 'unicorn/prefer-number-properties',
		message: 'Prefer `Number.isFinite()` over `isFinite()`.',
	});

	expect(messages).to.containObject({
		ruleId: 'unicorn/prefer-number-properties',
		message: 'Prefer `Number.isFinite()` over `isFinite()`.',
	});

	expect(messages).to.containObject({
		ruleId: 'unicorn/prefer-number-properties',
		message: 'Prefer `Number.isNaN()` over `isNaN()`.',
	});

	expect(messages).to.containObject({
		ruleId: 'curly',
		messageId: 'missingCurlyAfterCondition',
	});

	expect(messages).to.containObject({
		ruleId: 'regexp/prefer-d',
		messageId: 'unexpected',
	});

	expect(messages).to.containObject({
		ruleId: 'operator-linebreak',
		messageId: 'operatorAtBeginning',
	});

	expect(messages).to.containObject({
		ruleId: 'regexp/prefer-d',
		message: 'Unexpected character class \'[0-9]\'. Use \'\\d\' instead.',
	});

	expect(messages).to.containObject({
		ruleId: 'regexp/prefer-w',
	});
});

test('Service worker', async () => {
	const results = await eslint.lintFiles([swFixture]);
	const [result] = results;

	expect(result.errorCount).toBe(0);
	expect(result.warningCount).toBe(0);

	expect(result.messages).not.to.containObject({
		ruleId: 'no-restricted-globals',
		message: "Unexpected use of 'self'.",
	});
});
