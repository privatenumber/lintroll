import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'manten';
import type { ESLint } from 'eslint';
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
});
