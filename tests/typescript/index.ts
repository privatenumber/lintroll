import { readFile } from 'node:fs/promises';
import {
	describe, test, expect, onTestFail,
} from 'manten';
import { createFixture } from 'fs-fixture';
import { createEslint } from '../utils/eslint.ts';

/**
 * The TypeScript corpus stays in the repository as readable files. Each test
 * copies only the files it lints, keeping the relative layout the imports need.
 */
const createCorpusFixture = async (
	...names: string[]
) => createFixture(
	Object.fromEntries(
		await Promise.all(
			names.map(async name => [
				name,
				await readFile(new URL(`fixtures/${name}`, import.meta.url), 'utf8'),
			]),
		),
	),
);

describe('typescript', () => {
	test('Pass ts', async () => {
		await using fixture = await createCorpusFixture(
			'pass.ts',
			'cts.cts',
			'mts.mts',
			'some-file.ts',
		);

		const [result] = await createEslint(fixture.path).lintFiles(
			fixture.getPath('pass.ts'),
		);

		onTestFail(() => {
			console.log(result);
		});

		expect(result.errorCount).toBe(0);
		expect(result.warningCount).toBe(0);
		expect(result.usedDeprecatedRules.length).toBe(0);
	});

	test('Pass d.ts', async () => {
		await using fixture = await createCorpusFixture('pass.d.ts');

		const [result] = await createEslint(fixture.path).lintFiles(
			fixture.getPath('pass.d.ts'),
		);

		onTestFail(() => {
			console.log(result);
		});

		expect(result.errorCount).toBe(0);
		expect(result.warningCount).toBe(0);
		expect(result.usedDeprecatedRules.length).toBe(0);
	});

	test('Pass mts', async () => {
		await using fixture = await createCorpusFixture(
			'pass.mts',
			'cts.cts',
			'mts.mts',
		);

		const [result] = await createEslint(fixture.path).lintFiles(
			fixture.getPath('pass.mts'),
		);

		onTestFail(() => {
			console.log(result.messages);
		});

		expect(result.errorCount).toBe(0);
		expect(result.warningCount).toBe(0);
		expect(result.usedDeprecatedRules.length).toBe(0);
	});

	test('Pass ts imports with .ts extension when allowImportingTsExtensions is enabled', async () => {
		await using fixture = await createCorpusFixture(
			'allow-ts-extensions/allow-ts-extensions.ts',
			'allow-ts-extensions/module.ts',
			'allow-ts-extensions/tsconfig.json',
			'some-file.ts',
		);

		// The fixture's own tsconfig enables allowImportingTsExtensions, so
		// options.cwd points discovery at it while ESLint is rooted in the fixture
		const [result] = await createEslint(fixture.path, {
			cwd: fixture.getPath('allow-ts-extensions'),
		}).lintFiles(fixture.getPath('allow-ts-extensions/allow-ts-extensions.ts'));

		onTestFail(() => {
			console.log(result.messages);
		});

		expect(result.errorCount).toBe(0);
		expect(result.warningCount).toBe(0);
	});

	test('Fail cases', async () => {
		await using fixture = await createCorpusFixture(
			'fail.ts',
			'some-file.ts',
		);

		const [result] = await createEslint(fixture.path).lintFiles(
			fixture.getPath('fail.ts'),
		);

		[
			expect.objectContaining({
				ruleId: '@typescript-eslint/consistent-type-imports',
				severity: 2,
				message: 'All imports in the declaration are only used as types. Use `import type`.',
				messageId: 'typeOverValue',
			}),
			expect.objectContaining({
				ruleId: 'import-x/no-duplicates',
				severity: 2,
				messageId: 'duplicate',
			}),
			expect.objectContaining({
				ruleId: '@typescript-eslint/no-import-type-side-effects',
				severity: 2,
				messageId: 'useTopLevelQualifier',
			}),
			expect.objectContaining({
				ruleId: '@typescript-eslint/no-unused-vars',
				messageId: 'unusedVar',
				severity: 2,
			}),
			expect.objectContaining({
				ruleId: '@stylistic/member-delimiter-style',
				messageId: 'expectedSemi',
			}),
			expect.not.objectContaining({
				ruleId: '@stylistic/member-delimiter-style',
				messageId: 'expectedSemi',
			}),
			expect.not.objectContaining({
				ruleId: '@stylistic/comma-dangle',
				nodeType: 'TSTypeParameter',
				messageId: 'missing',
			}),
			expect.objectContaining({
				ruleId: '@typescript-eslint/consistent-type-definitions',
				severity: 2,
			}),
		].forEach((matcher) => {
			expect(result.messages).toEqual(
				expect.arrayContaining([matcher]),
			);
		});

		[
			expect.objectContaining({
				ruleId: 'no-unused-vars',
			}),
		].forEach((matcher) => {
			expect(result.messages).toEqual(
				expect.not.arrayContaining([matcher]),
			);
		});

		// Check that TypeScript-aware rules catch truly useless constructors
		expect(result.messages).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					ruleId: '@typescript-eslint/no-useless-constructor',
					severity: 2,
				}),
			]),
		);

		expect(result.messages).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					ruleId: '@typescript-eslint/no-empty-function',
					severity: 2,
				}),
			]),
		);

		// Ensure base rules are disabled for TypeScript files
		[
			expect.objectContaining({
				ruleId: 'no-useless-constructor',
			}),
			expect.objectContaining({
				ruleId: 'no-empty-function',
			}),
		].forEach((matcher) => {
			expect(result.messages).toEqual(
				expect.not.arrayContaining([matcher]),
			);
		});
	});
});
