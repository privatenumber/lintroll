import { fileURLToPath } from 'node:url';
import { testSuite, expect } from 'manten';
import { eslint, createEslint } from '../utils/eslint.js';

const eslintNode = createEslint({
	node: true,
});

// TEST: n/no-missing-import only on js,mjs,cjs files
export default testSuite(({ describe }) => {
	describe('node', ({ describe }) => {
		describe('Pass cases', ({ describe }) => {
			describe('CommonJS', ({ test }) => {
				const fixtureDirectoryPath = new URL('fixtures/package-commonjs/', import.meta.url);

				// For linting that requires package.json
				const eslintCjs = createEslint({
					node: true,
					cwd: fileURLToPath(fixtureDirectoryPath),
				});

				test('.js file', async ({ onTestFail }) => {
					const fixturePath = fileURLToPath(new URL('pass.js', fixtureDirectoryPath));
					const [result] = await eslintCjs.lintFiles(fixturePath);

					onTestFail(() => {
						console.log(result);
					});

					expect(result.errorCount).toBe(0);
					expect(result.warningCount).toBe(0);
					expect(result.usedDeprecatedRules.length).toBe(0);
				});

				// CJS files are always treated as Node.js files
				test('.cjs file', async ({ onTestFail }) => {
					const fixturePath = fileURLToPath(new URL('fixtures/package-commonjs/pass.cjs', import.meta.url));
					const [result] = await eslint.lintFiles(fixturePath);

					onTestFail(() => {
						console.log(result);
					});

					expect(result.errorCount).toBe(0);
					expect(result.warningCount).toBe(0);
					expect(result.usedDeprecatedRules.length).toBe(0);
				});

				test('.mjs file', async ({ onTestFail }) => {
					const fixturePath = fileURLToPath(new URL('fixtures/package-commonjs/pass.mjs', import.meta.url));
					const [result] = await eslintNode.lintFiles(fixturePath);

					onTestFail(() => {
						console.log(result);
					});

					expect(result.errorCount).toBe(0);
					expect(result.warningCount).toBe(0);
					expect(result.usedDeprecatedRules.length).toBe(0);
				});
			});

			describe('Module', ({ test }) => {
				const fixtureDirectoryPath = new URL('fixtures/package-module/', import.meta.url);

				// For linting that requires package.json
				const eslintMjs = createEslint({
					node: true,
					cwd: fileURLToPath(fixtureDirectoryPath),
				});

				test('.js file', async ({ onTestFail }) => {
					const fixturePath = fileURLToPath(new URL('pass.js', fixtureDirectoryPath));
					const [result] = await eslintMjs.lintFiles(fixturePath);

					onTestFail(() => {
						console.log(result);
					});

					expect(result.errorCount).toBe(0);
					expect(result.warningCount).toBe(0);
					expect(result.usedDeprecatedRules.length).toBe(0);
				});

				// CJS files are always treated as Node.js files
				test('.cjs file', async ({ onTestFail }) => {
					const fixturePath = fileURLToPath(new URL('fixtures/package-module/pass.cjs', import.meta.url));
					const [result] = await eslint.lintFiles(fixturePath);

					onTestFail(() => {
						console.log(result);
					});

					expect(result.errorCount).toBe(0);
					expect(result.warningCount).toBe(0);
					expect(result.usedDeprecatedRules.length).toBe(0);
				});

				// CLI files are always treated as Node.js
				test('CLI file', async ({ onTestFail }) => {
					const fixturePath = fileURLToPath(new URL('fixtures/package-module/cli.js', import.meta.url));
					const [result] = await eslint.lintFiles(fixturePath);

					onTestFail(() => {
						console.log(result);
					});

					expect(result.errorCount).toBe(0);
					expect(result.warningCount).toBe(0);
					expect(result.usedDeprecatedRules.length).toBe(0);
				});
			});
		});

		describe('Fail cases', ({ test }) => {
			test('mjs', async ({ onTestFail }) => {
				const fixturePath = fileURLToPath(new URL('fixtures/fail.mjs', import.meta.url));
				const [result] = await eslintNode.lintFiles(fixturePath);

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

			test('cts', async ({ onTestFail }) => {
				const fixturePath = fileURLToPath(new URL('fixtures/fail.cts', import.meta.url));
				const [result] = await eslintNode.lintFiles(fixturePath);

				onTestFail(() => {
					console.log(result);
				});

				[
					// Disabled by TypeScript plugin
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

			test('mts', async ({ onTestFail }) => {
				const fixturePath = fileURLToPath(new URL('fixtures/fail.mts', import.meta.url));
				const [result] = await eslintNode.lintFiles(fixturePath);

				onTestFail(() => {
					console.log(result);
				});

				[
					// Disabled by TypeScript plugin
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
});
