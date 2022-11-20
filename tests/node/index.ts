import path from 'path';
import { testSuite, expect } from 'manten';
import { createEslint } from '../utils/eslint.js';

const eslint = createEslint({
	extends: [
		path.resolve('./dist/node.js'),
	],
});

export default testSuite(({ describe }) => {
	describe('node', ({ describe }) => {
		describe('Pass cases', ({ test }) => {
			test('CommonJS', async ({ onTestFail }) => {
				const fixturePath = path.join(__dirname, 'fixtures/pass.js');
				const [result] = await eslint.lintFiles(fixturePath);

				onTestFail(() => {
					console.log(result);
				});

				expect(result.errorCount).toBe(0);
				expect(result.warningCount).toBe(0);
				expect(result.usedDeprecatedRules.length).toBe(0);
			});

			test('ESM', async ({ onTestFail }) => {
				const fixturePath = path.join(__dirname, 'fixtures/pass.mjs');
				const [result] = await eslint.lintFiles(fixturePath);

				onTestFail(() => {
					console.log(result);
				});

				expect(result.errorCount).toBe(0);
				expect(result.warningCount).toBe(0);
				expect(result.usedDeprecatedRules.length).toBe(0);
			});
		});

		describe('Fail cases', ({ describe }) => {
			describe('module', ({ test }) => {
				test('mjs', async () => {
					const fixturePath = path.join(__dirname, 'fixtures/fail.mjs');
					const [result] = await eslint.lintFiles(fixturePath);

					expect(result.messages).toEqual(
						expect.arrayContaining([
							expect.objectContaining({
								ruleId: 'no-undef',
								messageId: 'undef',
								message: "'__dirname' is not defined.",
							}),

							// expect.objectContaining({
							// 	ruleId: 'n/prefer-promises/fs',
							// 	messageId: 'preferPromises',
							// }),

							// expect.objectContaining({
							// 	ruleId: 'n/no-deprecated-api',
							// 	messageId: 'deprecated',
							// }),
						]),
					);
				});

				test('mts', async ({ onTestFail }) => {
					const fixturePath = path.join(__dirname, 'fixtures/fail.mts');
					const [result] = await eslint.lintFiles(fixturePath);

					onTestFail(() => {
						console.log(result);
					});

					expect(result.messages).toEqual(
						expect.arrayContaining([
							// Disabled by TypeScript plugin
							// https://github.com/typescript-eslint/typescript-eslint/blob/f25a94fa75e497/packages/eslint-plugin/src/configs/eslint-recommended.ts#L24
							// expect.objectContaining({
							// 	ruleId: 'no-undef',
							// 	messageId: 'undef',
							// 	message: "'__dirname' is not defined.",
							// }),

							// expect.objectContaining({
							// 	ruleId: 'n/prefer-promises/fs',
							// 	messageId: 'preferPromises',
							// }),

							// expect.objectContaining({
							// 	ruleId: 'n/no-deprecated-api',
							// 	messageId: 'deprecated',
							// }),
						]),
					);
				});
			});
		});
	});
});
// expect.objectContaining({
// 	ruleId: 'n/no-process-exit',
// 	messageId: 'noProcessExit',
// }),
// expect.objectContaining({
// 	ruleId: 'n/no-deprecated-api',
// 	messageId: 'deprecated',
// 	message:
// "'new Buffer()' was deprecated since v6.0.0. Use 'Buffer.alloc()' or 'Buffer.from()' instead.",
// }),
// expect.objectContaining({
// 	ruleId: 'n/no-deprecated-api',
// 	message:
// "'new Buffer()' was deprecated since v6.0.0. Use 'Buffer.alloc()' or 'Buffer.from()' instead.",
// }),
// expect.objectContaining({
// 	ruleId: 'n/file-extension-in-import',
// 	messageId: 'requireExt',
// }),
