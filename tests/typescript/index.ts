import { fileURLToPath } from 'node:url';
import { testSuite, expect } from 'manten';
import { eslint, createEslint } from '../utils/eslint.js';

const passFixtureTs = fileURLToPath(new URL('fixtures/pass.ts', import.meta.url));
const passFixtureDTs = fileURLToPath(new URL('fixtures/pass.d.ts', import.meta.url));
const passFixtureMts = fileURLToPath(new URL('fixtures/pass.mts', import.meta.url));
const failFixture = fileURLToPath(new URL('fixtures/fail.ts', import.meta.url));
const rewriteExtensionsFixture = fileURLToPath(new URL('fixtures/rewrite-extensions/import-ts-extension.ts', import.meta.url));

export default testSuite(({ describe }) => {
	describe('typescript', ({ test }) => {
		test('Pass ts', async ({ onTestFail }) => {
			const results = await eslint.lintFiles(passFixtureTs);
			const [result] = results;

			onTestFail(() => {
				console.log(result);
			});

			expect(result.errorCount).toBe(0);
			expect(result.warningCount).toBe(0);
			expect(result.usedDeprecatedRules.length).toBe(0);
		});

		test('Pass d.ts', async ({ onTestFail }) => {
			const results = await eslint.lintFiles(passFixtureDTs);
			const [result] = results;

			onTestFail(() => {
				console.log(result);
			});

			expect(result.errorCount).toBe(0);
			expect(result.warningCount).toBe(0);
			expect(result.usedDeprecatedRules.length).toBe(0);
		});

		test('Pass mts', async ({ onTestFail }) => {
			const results = await eslint.lintFiles(passFixtureMts);
			const [result] = results;

			onTestFail(() => {
				console.log(result.messages);
			});

			expect(result.errorCount).toBe(0);
			expect(result.warningCount).toBe(0);
			expect(result.usedDeprecatedRules.length).toBe(0);
		});

		test('Pass ts with rewriteRelativeImportExtensions', async ({ onTestFail }) => {
			const rewriteExtensionsDir = fileURLToPath(new URL('fixtures/rewrite-extensions', import.meta.url));
			const eslintWithCwd = createEslint({ cwd: rewriteExtensionsDir });
			const results = await eslintWithCwd.lintFiles(rewriteExtensionsFixture);
			const [result] = results;

			onTestFail(() => {
				console.log(result.messages);
			});

			expect(result.errorCount).toBe(0);
			expect(result.warningCount).toBe(0);
		});

		test('Fail cases', async () => {
			const [result] = await eslint.lintFiles(failFixture);

			[
				expect.objectContaining({
					ruleId: 'import-x/extensions',
					message: 'Unexpected use of file extension "ts" for "./module.ts"',
					severity: 2,
				}),
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
});
