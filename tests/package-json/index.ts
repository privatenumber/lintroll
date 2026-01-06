import { fileURLToPath } from 'node:url';
import { testSuite, expect } from 'manten';
import { eslint } from '../utils/eslint.js';

export default testSuite(({ describe }) => {
	describe('package-json', ({ test }) => {
		test('no empty dependencies objects', async ({ onTestFail }) => {
			const [result] = await eslint.lintFiles(
				fileURLToPath(new URL('fixtures/fail/empty-dependencies/package.json', import.meta.url)),
			);

			onTestFail(() => {
				console.log(result.messages);
			});

			expect(result.messages).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						ruleId: 'package-json/no-empty-fields',
					}),
				]),
			);
		});

		test('exports-subpaths-style prefers implicit format', async ({ onTestFail }) => {
			const [result] = await eslint.lintFiles(
				fileURLToPath(new URL('fixtures/fail/explicit-exports/package.json', import.meta.url)),
			);

			onTestFail(() => {
				console.log(result.messages);
			});

			expect(result.messages).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						ruleId: 'package-json/exports-subpaths-style',
					}),
				]),
			);
		});

		test('no-redundant-publishConfig flags unscoped packages', async ({ onTestFail }) => {
			const [result] = await eslint.lintFiles(
				fileURLToPath(new URL('fixtures/fail/redundant-publishConfig/package.json', import.meta.url)),
			);

			onTestFail(() => {
				console.log(result.messages);
			});

			expect(result.messages).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						ruleId: 'package-json/no-redundant-publishConfig',
					}),
				]),
			);
		});

		test('valid package.json passes', async ({ onTestFail }) => {
			const [result] = await eslint.lintFiles(
				fileURLToPath(new URL('fixtures/pass/valid/package.json', import.meta.url)),
			);

			onTestFail(() => {
				console.log(result.messages);
			});

			// Filter out sorting-related errors since we're not testing that
			const relevantErrors = result.messages.filter(
				message => !message.ruleId?.includes('sort'),
			);

			expect(relevantErrors.length).toBe(0);
		});

		test('private packages do not require description', async ({ onTestFail }) => {
			const [result] = await eslint.lintFiles(
				fileURLToPath(new URL('fixtures/pass/private-no-description/package.json', import.meta.url)),
			);

			onTestFail(() => {
				console.log(result.messages);
			});

			const hasDescriptionError = result.messages.some(
				message => message.ruleId === 'package-json/require-description',
			);

			expect(hasDescriptionError).toBe(false);
		});
	});
});
