import { fileURLToPath } from 'node:url';
import { testSuite, expect } from 'manten';
import {
	eslint, createEslint, eslintCli,
} from '../utils/eslint.js';

const eslintNode = createEslint({
	node: true,
});

export default testSuite(({ describe }) => {
	describe('node', ({ describe }) => {
		describe('Pass cases', ({ describe }) => {
			describe('CommonJS', ({ test }) => {
				test('.js file', async () => {
					const linted = await eslintCli(
						'pass.js',
						fileURLToPath(new URL('fixtures/package-commonjs/', import.meta.url)),
					);

					expect(linted.failed).toBe(false);
					expect(linted.stdout).toBe('');
					expect(linted.stderr).toBe('');
				});

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
				test('.js file', async ({ onTestFail }) => {
					const fixturePath = fileURLToPath(new URL('fixtures/package-module/pass.js', import.meta.url));
					const [result] = await eslintNode.lintFiles(fixturePath);

					onTestFail(() => {
						console.log(result);
					});

					expect(result.errorCount).toBe(0);
					expect(result.warningCount).toBe(0);
					expect(result.usedDeprecatedRules.length).toBe(0);
				});

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

		describe('Fail cases', ({ describe }) => {
			describe('module', ({ test }) => {
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
});
