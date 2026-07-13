import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'manten';
import type { ESLint } from 'eslint';
import { createFixture } from 'fs-fixture';
import { runOxlint } from '../../src/cli/run-oxlint.ts';
import { createEslint } from '../utils/eslint.ts';

const fixturesDirectory = fileURLToPath(new URL('fixtures/', import.meta.url));

type Diagnostic = {
	filePath: string;
	ruleId: string;
	severity: 1 | 2;
};

const normalizeDiagnostics = (
	results: ESLint.LintResult[],
) => {
	const diagnostics: Diagnostic[] = [];

	for (const result of results) {
		const filePath = path.relative(fixturesDirectory, result.filePath).replaceAll(path.sep, '/');
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
		const results = await createEslint().lintFiles([
			path.join(fixturesDirectory, 'fail/javascript.js'),
			path.join(fixturesDirectory, 'fail/typescript.ts'),
			path.join(fixturesDirectory, 'fail/Input.tsx'),
		]);

		expect(normalizeDiagnostics(results)).toStrictEqual([
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
		const results = await createEslint({ node: true }).lintFiles([
			path.join(fixturesDirectory, 'fail/node.mjs'),
		]);

		expect(normalizeDiagnostics(results)).toStrictEqual([
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
		const fixturePaths = [
			'fail/javascript.js',
			'fail/typescript.ts',
			'fail/Input.tsx',
			'fail/node.mjs',
		].map(filePath => path.relative(process.cwd(), path.join(fixturesDirectory, filePath)));
		const report = await runOxlint({
			cwd: process.cwd(),
			files: fixturePaths,
			noIgnore: true,
		});

		expect(report.diagnostics.map(({ filePath, ruleId, severity }) => ({
			filePath,
			ruleId,
			severity,
		}))).toStrictEqual([
			{
				filePath: 'tests/parity/fixtures/fail/javascript.js',
				ruleId: 'eqeqeq',
				severity: 2,
			},
			{
				filePath: 'tests/parity/fixtures/fail/javascript.js',
				ruleId: 'no-console',
				severity: 1,
			},
			{
				filePath: 'tests/parity/fixtures/fail/javascript.js',
				ruleId: 'prefer-const',
				severity: 2,
			},
			{
				filePath: 'tests/parity/fixtures/fail/javascript.js',
				ruleId: 'promise/no-return-wrap',
				severity: 2,
			},
			{
				filePath: 'tests/parity/fixtures/fail/javascript.js',
				ruleId: 'unicorn/no-useless-promise-resolve-reject',
				severity: 2,
			},
			{
				filePath: 'tests/parity/fixtures/fail/javascript.js',
				ruleId: 'unicorn/prefer-number-properties',
				severity: 2,
			},
			{
				filePath: 'tests/parity/fixtures/fail/typescript.ts',
				ruleId: '@typescript-eslint/consistent-type-definitions',
				severity: 2,
			},
			{
				filePath: 'tests/parity/fixtures/fail/typescript.ts',
				ruleId: '@typescript-eslint/no-explicit-any',
				severity: 2,
			},
		]);
	});

	test('reports unused ESLint directives', async () => {
		const report = await runOxlint({
			cwd: process.cwd(),
			files: ['tests/eslint-comments/fixtures/src/fail.js'],
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
});
