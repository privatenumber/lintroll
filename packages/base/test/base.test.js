const path = require('path');
const { ESLint } = require('eslint');
require('../../../test/jest-setup');

const passFixture = path.join(__dirname, 'fixtures/pass.js');
const failFixture = path.join(__dirname, 'fixtures/fail.js');
const swFixture = path.join(__dirname, 'fixtures/service-worker.sw.js');
const packageJsonFixture = path.join(__dirname, 'fixtures/package.json');

const eslint = new ESLint({
	useEslintrc: false,
	baseConfig: {
		extends: path.join(__dirname, '../index.js'),
	},
});

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

	expect(messages).toContainObject({
		ruleId: 'unicorn/no-process-exit',
		messageId: 'no-process-exit',
	});

	expect(messages).toContainObject({
		ruleId: 'unicorn/no-new-buffer',
		messageId: 'error',
	});

	expect(messages).toContainObject({
		ruleId: 'node/no-deprecated-api',
		message: "'new Buffer()' was deprecated since v6.0.0. Use 'Buffer.alloc()' or 'Buffer.from()' instead.",
	});

	expect(messages).toContainObject({
		ruleId: 'padding-line-between-statements',
		message: 'Expected blank line before this statement.',
		line: 2,
	});

	expect(messages).toContainObject({
		ruleId: 'semi',
		messageId: 'missingSemi',
	});

	expect(messages).toContainObject({
		ruleId: 'quotes',
		message: 'Strings must use singlequote.',
	});

	expect(messages).toContainObject({
		ruleId: 'no-console',
		messageId: 'unexpected',
	});

	expect(messages).toContainObject({
		ruleId: 'eol-last',
		messageId: 'missing',
	});

	expect(messages).toContainObject({
		ruleId: 'node/file-extension-in-import',
		messageId: 'requireExt',
	});

	expect(messages).toContainObject({
		ruleId: 'import/max-dependencies',
		severity: 1,
		message: 'Maximum number of dependencies (15) exceeded.',
	});

	expect(messages).toContainObject({
		ruleId: 'import/extensions',
		message: 'Missing file extension "js" for "./some-file"',
	});

	expect(messages).toContainObject({
		ruleId: 'func-call-spacing',
		messageId: 'unexpectedWhitespace',
	});

	expect(messages).toContainObject({
		ruleId: 'wrap-iife',
		messageId: 'wrapExpression',
	});

	expect(messages).toContainObject({
		ruleId: 'func-names',
		messageId: 'unnamed',
	});

	expect(messages).toContainObject({
		ruleId: 'unicorn/prefer-number-properties',
		message: 'Prefer `Number.isFinite()` over `isFinite()`.',
	});

	expect(messages).toContainObject({
		ruleId: 'unicorn/prefer-number-properties',
		message: 'Prefer `Number.isFinite()` over `isFinite()`.',
	});

	expect(messages).toContainObject({
		ruleId: 'unicorn/prefer-number-properties',
		message: 'Prefer `Number.isNaN()` over `isNaN()`.',
	});

	expect(messages).toContainObject({
		ruleId: 'curly',
		messageId: 'missingCurlyAfterCondition',
	});

	expect(messages).toContainObject({
		ruleId: 'regexp/prefer-d',
		messageId: 'unexpected',
	});

	expect(messages).toContainObject({
		ruleId: 'operator-linebreak',
		messageId: 'operatorAtBeginning',
	});
});

test('Service worker', async () => {
	const results = await eslint.lintFiles([swFixture]);
	const [result] = results;

	expect(result.errorCount).toBe(0);
	expect(result.warningCount).toBe(0);

	expect(result.messages).not.toContainObject({
		ruleId: 'no-restricted-globals',
		message: "Unexpected use of 'self'.",
	});
});

test('package.json', async () => {
	const results = await eslint.lintFiles([packageJsonFixture]);
	const { messages } = results[0];

	expect(messages).toContainObject({
		ruleId: 'jsonc/indent',
		messageId: 'wrongIndentation',
	});

	expect(messages).toContainObject({
		ruleId: 'jsonc/sort-keys',
		messageId: 'sortKeys',
	});
});
