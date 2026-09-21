import {
	describe, test, expect, onTestFail,
} from 'manten';
import { createFixture } from 'fs-fixture';
import { createEslint } from '../utils/eslint.ts';

describe('unicorn', () => {
	test('allows slice().sort() pattern', async () => {
		await using fixture = await createFixture({
			'array-sort.js': `// slice().sort() is preferred over toSorted() for ES2022 compatibility
const numbers = [3, 1, 2];
const sorted = numbers.slice().sort();
console.log(sorted);
`,
		});

		const [result] = await createEslint(fixture.path).lintFiles(fixture.getPath('array-sort.js'));

		onTestFail(() => {
			console.log(result.messages);
		});

		// no-array-sort is disabled, so slice().sort() should pass
		const hasArraySortError = result.messages.some(
			message => message.ruleId === 'unicorn/no-array-sort',
		);

		expect(hasArraySortError).toBe(false);
		expect(result.errorCount).toBe(0);
	});

	test('does not check directory names', async () => {
		await using fixture = await createFixture({
			'PascalDir/filename-case.js': 'export const value = 1;\n',
		});

		const [result] = await createEslint(fixture.path).lintFiles(fixture.getPath('PascalDir/filename-case.js'));

		onTestFail(() => {
			console.log(result.messages);
		});

		expect(result.messages).toStrictEqual([]);
	});

	test('allows certain abbreviations', async () => {
		await using fixture = await createFixture({
			'abbreviations.js': `export const tempDir = '/tmp/test';
export const srcDir = './src';
export const db = 'my-database';
export const docsPath = './docs';
export const ColumnDef = { id: 'name' };
export const relX = 100;
export const el = 'element';
`,
		});

		const [result] = await createEslint(fixture.path).lintFiles(fixture.getPath('abbreviations.js'));

		onTestFail(() => {
			console.log(result.messages);
		});

		// Should not have any errors about prevent-abbreviations
		const abbreviationErrors = result.messages.filter(
			message => message.ruleId === 'unicorn/prevent-abbreviations',
		);

		expect(abbreviationErrors.length).toBe(0);
		expect(result.errorCount).toBe(0);
	});

	// Disabled due to false positives on string properties named 'size'
	// https://github.com/sindresorhus/eslint-plugin-unicorn/issues/1266
	test('explicit-length-check is disabled', async () => {
		await using fixture = await createFixture({
			'explicit-length-check.js': `// String property named 'size' should not trigger explicit-length-check
// https://github.com/sindresorhus/eslint-plugin-unicorn/issues/1266
const props = { size: 'medium' };
const size = props.size || 'large';

export { size };
`,
		});

		const [result] = await createEslint(fixture.path).lintFiles(fixture.getPath('explicit-length-check.js'));

		onTestFail(() => {
			console.log(result.messages);
		});

		const hasLengthCheckError = result.messages.some(
			message => message.ruleId === 'unicorn/explicit-length-check',
		);

		expect(hasLengthCheckError).toBe(false);
	});
});
