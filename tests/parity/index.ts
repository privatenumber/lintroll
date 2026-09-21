import { fileURLToPath } from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';
import { describe, expect, test } from 'manten';
import { ESLint } from 'eslint';
import { createFixture } from 'fs-fixture';
import { pvtnbr } from '#pvtnbr';
import { eslintGapConfig } from '../../bench/eslint-gap-config.ts';
import { runOxlint } from '../../src/cli/run-oxlint.ts';
import { eslintDirectivesFixture } from '../fixtures/eslint-directives.ts';
import { createEslint } from '../utils/eslint.ts';
import { diagnosticCorpusFixture, diagnosticCorpusFiles } from './fixtures/diagnostic-corpus.ts';

const createGapEslint = (cwd: string) => new ESLint({
	cwd,
	baseConfig: [
		...pvtnbr({ node: true }),
		...eslintGapConfig,
	],
	ignore: false,
	overrideConfigFile: true,
});

// A corpus file with directives that Oxlint-owned rules would otherwise report
const migratedDirectivesFile = fileURLToPath(new URL('../base/fixtures/pass.js', import.meta.url));

type Diagnostic = {
	filePath: string;
	ruleId: string;
	severity: 1 | 2;
};

const normalizeDiagnostics = (
	results: ESLint.LintResult[],
	fixtureRoot: string,
) => {
	const diagnostics: Diagnostic[] = [];

	for (const result of results) {
		const filePath = path.relative(fixtureRoot, result.filePath).replaceAll(path.sep, '/');
		for (const message of result.messages) {
			assert.ok(message.ruleId);
			assert.ok(message.severity === 1 || message.severity === 2);
			diagnostics.push({
				filePath,
				ruleId: message.ruleId,
				severity: message.severity,
			});
		}
	}

	diagnostics.sort((diagnosticA, diagnosticB) => {
		if (diagnosticA.filePath !== diagnosticB.filePath) {
			return diagnosticA.filePath < diagnosticB.filePath ? -1 : 1;
		}

		if (diagnosticA.ruleId !== diagnosticB.ruleId) {
			return diagnosticA.ruleId < diagnosticB.ruleId ? -1 : 1;
		}

		return diagnosticA.severity - diagnosticB.severity;
	});

	return diagnostics;
};

describe('linter parity corpus', () => {
	test('captures JavaScript, TypeScript, and React diagnostics', async () => {
		await using fixture = await createFixture(diagnosticCorpusFixture);

		const results = await createEslint(fixture.path).lintFiles(
			diagnosticCorpusFiles.map(filePath => fixture.getPath(filePath)),
		);

		expect(normalizeDiagnostics(results, fixture.path)).toStrictEqual([
			{
				filePath: 'fail/Input.tsx',
				ruleId: 'react/prop-types',
				severity: 2,
			},
			{
				filePath: 'fail/javascript.js',
				ruleId: '@stylistic/quotes',
				severity: 2,
			},
			{
				filePath: 'fail/javascript.js',
				ruleId: '@stylistic/semi',
				severity: 2,
			},
			{
				filePath: 'fail/javascript.js',
				ruleId: 'eqeqeq',
				severity: 2,
			},
			{
				filePath: 'fail/javascript.js',
				ruleId: 'import-x/order',
				severity: 2,
			},
			{
				filePath: 'fail/javascript.js',
				ruleId: 'no-console',
				severity: 1,
			},
			{
				filePath: 'fail/javascript.js',
				ruleId: 'prefer-const',
				severity: 2,
			},
			{
				filePath: 'fail/javascript.js',
				ruleId: 'promise/no-return-wrap',
				severity: 2,
			},
			{
				filePath: 'fail/javascript.js',
				ruleId: 'regexp/prefer-d',
				severity: 2,
			},
			{
				filePath: 'fail/javascript.js',
				ruleId: 'unicorn/no-useless-promise-resolve-reject',
				severity: 2,
			},
			{
				filePath: 'fail/javascript.js',
				ruleId: 'unicorn/prefer-number-properties',
				severity: 2,
			},
			{
				filePath: 'fail/typescript.ts',
				ruleId: '@typescript-eslint/consistent-type-definitions',
				severity: 2,
			},
			{
				filePath: 'fail/typescript.ts',
				ruleId: '@typescript-eslint/no-explicit-any',
				severity: 2,
			},
		]);
	});

	test('captures Node.js diagnostics', async () => {
		await using fixture = await createFixture(diagnosticCorpusFixture);

		const results = await createEslint(fixture.path, { node: true }).lintFiles([
			fixture.getPath('fail/node.mjs'),
		]);

		expect(normalizeDiagnostics(results, fixture.path)).toStrictEqual([
			{
				filePath: 'fail/node.mjs',
				ruleId: 'n/prefer-node-protocol',
				severity: 2,
			},
			{
				filePath: 'fail/node.mjs',
				ruleId: 'n/prefer-promises/fs',
				severity: 2,
			},
		]);
	});

	test('captures the native Oxlint subset', async () => {
		await using fixture = await createFixture(diagnosticCorpusFixture);

		const report = await runOxlint({
			cwd: fixture.path,
			files: diagnosticCorpusFiles,
			noIgnore: true,
		});

		expect(report.diagnostics.map(({ filePath, ruleId, severity }) => ({
			filePath,
			ruleId,
			severity,
		}))).toStrictEqual([
			{
				filePath: 'fail/javascript.js',
				ruleId: 'eqeqeq',
				severity: 2,
			},
			{
				filePath: 'fail/javascript.js',
				ruleId: 'no-console',
				severity: 1,
			},
			{
				filePath: 'fail/javascript.js',
				ruleId: 'prefer-const',
				severity: 2,
			},
			{
				filePath: 'fail/javascript.js',
				ruleId: 'promise/no-return-wrap',
				severity: 2,
			},
			{
				filePath: 'fail/javascript.js',
				ruleId: 'unicorn/no-useless-promise-resolve-reject',
				severity: 2,
			},
			{
				filePath: 'fail/javascript.js',
				ruleId: 'unicorn/prefer-number-properties',
				severity: 2,
			},
			{
				filePath: 'fail/typescript.ts',
				ruleId: '@typescript-eslint/consistent-type-definitions',
				severity: 2,
			},
			{
				filePath: 'fail/typescript.ts',
				ruleId: '@typescript-eslint/no-explicit-any',
				severity: 2,
			},
		]);
	});

	test('reports unused ESLint directives', async () => {
		await using fixture = await createFixture(eslintDirectivesFixture);

		const report = await runOxlint({
			cwd: fixture.path,
			files: ['src/fail.js'],
			noIgnore: true,
		});

		expect(report.diagnostics.map(({ message, severity }) => ({
			message,
			severity: severity === 2 ? 'error' : 'warning',
		}))).toStrictEqual([
			{
				message: 'Unused eslint-disable directive (no problems were reported).',
				severity: 'warning',
			},
			{
				message: 'Unused eslint-enable directive (no matching eslint-disable directives were found for some-rule).',
				severity: 'warning',
			},
		]);
	});

	test('applies the private config from another cwd', async () => {
		await using fixture = await createFixture({
			'src/file.ts': 'interface Payload {\n\tvalue: any;\n}\n\nexport type { Payload };\n',
		});
		const report = await runOxlint({
			cwd: fixture.path,
			files: ['src/file.ts'],
			noIgnore: true,
		});

		expect(report.diagnostics.map(diagnostic => diagnostic.ruleId)).toStrictEqual([
			'@typescript-eslint/consistent-type-definitions',
			'@typescript-eslint/no-explicit-any',
		]);
	});

	test('preserves warning counts in quiet mode', async () => {
		await using fixture = await createFixture({
			'file.js': "console.log('warning');\n",
		});
		const report = await runOxlint({
			cwd: fixture.path,
			files: ['file.js'],
			noIgnore: true,
			quiet: true,
		});

		expect(report.warningCount).toBe(1);
		expect(report.diagnostics).toStrictEqual([]);
	});

	test('classifies parser diagnostics as fatal', async () => {
		await using fixture = await createFixture({
			'broken.js': 'const =;\n',
		});
		const report = await runOxlint({
			cwd: fixture.path,
			files: ['broken.js'],
			noIgnore: true,
		});

		expect(report.errorCount).toBe(1);
		expect(report.fatalErrorCount).toBe(1);
	});

	test('preserves non-diagnostic Oxlint failures', async () => {
		await expect(runOxlint({
			cwd: process.cwd(),
			files: ['missing-file.js'],
		})).rejects.toThrow('No files found');
	});

	test('leaves only ESLint gap diagnostics', async () => {
		await using fixture = await createFixture(diagnosticCorpusFixture);

		const results = await createGapEslint(fixture.path).lintFiles(
			diagnosticCorpusFiles.map(filePath => fixture.getPath(filePath)),
		);

		expect(normalizeDiagnostics(results, fixture.path)).toStrictEqual([
			{
				filePath: 'fail/Input.tsx',
				ruleId: 'react/prop-types',
				severity: 2,
			},
			{
				filePath: 'fail/javascript.js',
				ruleId: '@stylistic/quotes',
				severity: 2,
			},
			{
				filePath: 'fail/javascript.js',
				ruleId: '@stylistic/semi',
				severity: 2,
			},
			{
				filePath: 'fail/javascript.js',
				ruleId: 'import-x/order',
				severity: 2,
			},
			{
				filePath: 'fail/javascript.js',
				ruleId: 'regexp/prefer-d',
				severity: 2,
			},
			{
				filePath: 'fail/node.mjs',
				ruleId: 'n/prefer-node-protocol',
				severity: 2,
			},
			{
				filePath: 'fail/node.mjs',
				ruleId: 'n/prefer-promises/fs',
				severity: 2,
			},
		]);
	});

	test('does not report migrated directives as unused', async () => {
		const [result] = await createGapEslint(process.cwd()).lintFiles([
			migratedDirectivesFile,
		]);

		expect(result.messages.filter(message => (
			message.ruleId === null && message.message.includes('eslint-disable')
		))).toStrictEqual([]);
	});

	test('disables all known Oxlint-owned core overlaps', async () => {
		await using fixture = await createFixture(diagnosticCorpusFixture);

		const config = await createGapEslint(fixture.path).calculateConfigForFile(
			fixture.getPath('fail/javascript.js'),
		);

		expect(config?.rules['no-implied-eval']?.[0]).toBe(0);
		expect(config?.rules['prefer-promise-reject-errors']?.[0]).toBe(0);
	});
});
