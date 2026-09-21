import {
	describe, test, expect, onTestFail,
} from 'manten';
import { createFixture } from 'fs-fixture';
import { createEslint } from '../utils/eslint.ts';
import { assetImportFixture } from './fixtures/asset-import.ts';

describe('bundle', () => {
	test('Pass cases', async () => {
		await using fixture = await createFixture(assetImportFixture);

		const [result] = await createEslint(fixture.path).lintFiles(
			fixture.getPath('src/pass.js'),
		);

		onTestFail(() => {
			console.log(result);
			console.log(result.usedDeprecatedRules);
		});

		expect(result.errorCount).toBe(0);
		expect(result.warningCount).toBe(0);
		expect(result.usedDeprecatedRules.length).toBe(0);
	});

	test('Fail cases', async () => {
		await using fixture = await createFixture({
			'src/fail.cjs': `require(Math.random());
`,
		});

		const [result] = await createEslint(fixture.path).lintFiles(
			fixture.getPath('src/fail.cjs'),
		);

		onTestFail(() => {
			console.log(result);
		});

		expect(result.messages).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					ruleId: 'import-x/no-dynamic-require',
					nodeType: 'CallExpression',
					severity: 2,
				}),
			]),
		);
	});
	test('Fail cases .mjs', async () => {
		await using fixture = await createFixture({
			'src/fail.mjs': `require(Math.random());
`,
		});

		const [result] = await createEslint(fixture.path).lintFiles(
			fixture.getPath('src/fail.mjs'),
		);

		onTestFail(() => {
			console.log(result);
		});

		[
			expect.objectContaining({
				ruleId: 'no-undef',
				messageId: 'undef',
				message: "'require' is not defined.",
				severity: 2,
			}),
			expect.objectContaining({
				ruleId: 'import-x/no-dynamic-require',
				nodeType: 'CallExpression',
				severity: 2,
			}),
		].forEach((matcher) => {
			expect(result.messages).toEqual(
				expect.arrayContaining([matcher]),
			);
		});
	});
});
