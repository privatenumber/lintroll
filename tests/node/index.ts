import {
	describe, test, expect, onTestFail,
} from 'manten';
import { createFixture } from 'fs-fixture';
import { createEslint } from '../utils/eslint.ts';
import { commonjsPackageFixture, modulePackageFixture } from './fixtures/package-types.ts';
import { unsupportedNodeUsageFixture } from './fixtures/unsupported-node-usage.ts';

// TEST: n/no-missing-import only on js,mjs,cjs files
describe('node', () => {
	describe('Pass cases', () => {
		describe('CommonJS', () => {
			test('.js file', async () => {
				await using fixture = await createFixture(commonjsPackageFixture);

				// The fixture's package.json determines the module system
				const [result] = await createEslint(fixture.path, {
					node: true,
					cwd: fixture.path,
				}).lintFiles(fixture.getPath('pass.js'));

				onTestFail(() => {
					console.log(result);
				});

				expect(result.errorCount).toBe(0);
				expect(result.warningCount).toBe(0);
				expect(result.usedDeprecatedRules.length).toBe(0);
			});

			// CJS files are always treated as Node.js files
			test('.cjs file', async () => {
				await using fixture = await createFixture(commonjsPackageFixture);

				const [result] = await createEslint(fixture.path).lintFiles(
					fixture.getPath('pass.cjs'),
				);

				onTestFail(() => {
					console.log(result);
				});

				expect(result.errorCount).toBe(0);
				expect(result.warningCount).toBe(0);
				expect(result.usedDeprecatedRules.length).toBe(0);
			});

			test('.mjs file', async () => {
				await using fixture = await createFixture(commonjsPackageFixture);

				const [result] = await createEslint(fixture.path, {
					node: true,
				}).lintFiles(fixture.getPath('pass.mjs'));

				onTestFail(() => {
					console.log(result);
				});

				expect(result.errorCount).toBe(0);
				expect(result.warningCount).toBe(0);
				expect(result.usedDeprecatedRules.length).toBe(0);
			});
		});

		describe('Module', () => {
			test('.js file', async () => {
				await using fixture = await createFixture(modulePackageFixture);

				// The fixture's package.json determines the module system
				const [result] = await createEslint(fixture.path, {
					node: true,
					cwd: fixture.path,
				}).lintFiles(fixture.getPath('pass.js'));

				onTestFail(() => {
					console.log(result);
				});

				expect(result.errorCount).toBe(0);
				expect(result.warningCount).toBe(0);
				expect(result.usedDeprecatedRules.length).toBe(0);
			});

			// CJS files are always treated as Node.js files
			test('.cjs file', async () => {
				await using fixture = await createFixture(modulePackageFixture);

				const [result] = await createEslint(fixture.path).lintFiles(
					fixture.getPath('pass.cjs'),
				);

				onTestFail(() => {
					console.log(result);
				});

				expect(result.errorCount).toBe(0);
				expect(result.warningCount).toBe(0);
				expect(result.usedDeprecatedRules.length).toBe(0);
			});

			// CLI files are always treated as Node.js
			test('CLI file', async () => {
				await using fixture = await createFixture(modulePackageFixture);

				const [result] = await createEslint(fixture.path).lintFiles(
					fixture.getPath('cli.js'),
				);

				onTestFail(() => {
					console.log(result);
				});

				expect(result.errorCount).toBe(0);
				expect(result.warningCount).toBe(0);
				expect(result.usedDeprecatedRules.length).toBe(0);
			});

			// Scripts are always treated as Node.js (no-console allowed)
			test('scripts file', async () => {
				await using fixture = await createFixture(modulePackageFixture);

				const [result] = await createEslint(fixture.path).lintFiles(
					fixture.getPath('scripts/build.js'),
				);

				onTestFail(() => {
					console.log(result);
				});

				expect(result.errorCount).toBe(0);
				expect(result.warningCount).toBe(0);
				expect(result.usedDeprecatedRules.length).toBe(0);
			});
		});
	});

	describe('Fail cases', () => {
		test('cts', async () => {
			await using fixture = await createFixture(unsupportedNodeUsageFixture);

			const [result] = await createEslint(fixture.path, {
				node: true,
			}).lintFiles(fixture.getPath('fail.cts'));

			onTestFail(() => {
				console.log(result);
			});

			[
				// Disabled by TypeScript plugin - espected to be caught by type checking
				// https://github.com/typescript-eslint/typescript-eslint/blob/f25a94fa75e497/packages/eslint-plugin/src/configs/eslint-recommended.ts#L24
				// expect.objectContaining({
				// 	ruleId: 'no-undef',
				// 	messageId: 'undef',
				// 	message: "'__dirname' is not defined.",
				// }),

				// In .cts files, TS compiles ESM imports to require
				// TODO: Unless verbatimModuleSyntax is enabled
				expect.objectContaining({
					ruleId: '@typescript-eslint/no-require-imports',
					messageId: 'noRequireImports',
				}),

				expect.objectContaining({
					ruleId: 'n/prefer-node-protocol',
					messageId: 'preferNodeProtocol',
				}),

				expect.objectContaining({
					ruleId: 'n/prefer-promises/fs',
					messageId: 'preferPromises',
				}),

				expect.objectContaining({
					ruleId: 'n/no-deprecated-api',
					messageId: 'deprecated',
				}),
			].forEach((matcher) => {
				expect(result.messages).toEqual(
					expect.arrayContaining([matcher]),
				);
			});
		});

		test('mjs', async () => {
			await using fixture = await createFixture(unsupportedNodeUsageFixture);

			const [result] = await createEslint(fixture.path, {
				node: true,
			}).lintFiles(fixture.getPath('fail.mjs'));

			onTestFail(() => {
				console.log(result);
			});

			[
				expect.objectContaining({
					ruleId: 'no-undef',
					messageId: 'undef',
					message: "'__dirname' is not defined.",
				}),

				expect.objectContaining({
					ruleId: 'n/prefer-promises/fs',
					messageId: 'preferPromises',
				}),

				expect.objectContaining({
					ruleId: 'n/no-deprecated-api',
					messageId: 'deprecated',
				}),

				expect.objectContaining({
					ruleId: 'n/no-process-exit',
					messageId: 'noProcessExit',
				}),

				expect.objectContaining({
					ruleId: 'n/no-deprecated-api',
					messageId: 'deprecated',
					message: "'new Buffer()' was deprecated since v6.0.0. Use 'Buffer.alloc()' or 'Buffer.from()' instead.",
				}),
			].forEach((matcher) => {
				expect(result.messages).toEqual(
					expect.arrayContaining([matcher]),
				);
			});
		});

		test('mts', async () => {
			await using fixture = await createFixture(unsupportedNodeUsageFixture);

			const [result] = await createEslint(fixture.path, {
				node: true,
			}).lintFiles(fixture.getPath('fail.mts'));

			onTestFail(() => {
				console.log(result);
			});

			[
				// Disabled by TypeScript plugin - espected to be caught by type checking
				// https://github.com/typescript-eslint/typescript-eslint/blob/f25a94fa75e497/packages/eslint-plugin/src/configs/eslint-recommended.ts#L24
				// expect.objectContaining({
				// 	ruleId: 'no-undef',
				// 	messageId: 'undef',
				// 	message: "'__dirname' is not defined.",
				// }),

				expect.objectContaining({
					ruleId: 'n/prefer-node-protocol',
					messageId: 'preferNodeProtocol',
				}),

				expect.objectContaining({
					ruleId: 'n/prefer-promises/fs',
					messageId: 'preferPromises',
				}),

				expect.objectContaining({
					ruleId: 'n/no-deprecated-api',
					messageId: 'deprecated',
				}),
			].forEach((matcher) => {
				expect(result.messages).toEqual(
					expect.arrayContaining([matcher]),
				);
			});
		});
	});
});
