import { readFile } from 'node:fs/promises';
import { ESLint } from 'eslint';
import {
	describe, test, expect, onTestFail,
} from 'manten';
import { createFixture } from 'fs-fixture';
import { pvtnbr } from '#pvtnbr';
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
	test('Explicit return types require named object types', async () => {
		const eslint = createEslint(process.cwd());
		for (const [code, count] of [
			['function read(): { value: string } { throw new Error(); }', 1],
			['const read = (): { value: string } => ({ value: "" });', 1],
			['const read = function (): { value: string } { throw new Error(); };', 1],
			['class Reader { read(): { value: string } { throw new Error(); } }', 1],
			['const reader = { read(): { value: string } { throw new Error(); } };', 1],
			['declare function read(): { value: string };', 1],
			['type Read = () => { value: string };', 1],
			['type Reader = { read(): { value: string } };', 1],
			['type Reader = { (): { value: string } };', 1],
			['type Reader = { new (): { value: string } };', 1],
			['declare function read(): Promise<{ value: string }>;', 1],
			['declare function read(): { value: string }[];', 1],
			['declare function read(): { value: string } | { error: Error };', 2],
			['declare function read(): Result & { value: string };', 1],
			['type Result = { value: string }; declare function read(): Result;', 0],
			['declare function read(): Promise<Result[]>;', 0],
			['function read(input: { value: string }) { return input; }', 0],
			['const read = () => ({ value: "" });', 0],
		] satisfies [string, number][]) {
			const [result] = await eslint.lintText(code, { filePath: 'return-types.ts' });
			expect(result.fatalErrorCount).toBe(0);
			const restrictions = result.messages.filter(message => message.ruleId === 'no-restricted-syntax');
			expect(restrictions.map(message => ({
				message: message.message,
				nodeType: message.nodeType,
				severity: message.severity,
				fix: message.fix,
			}))).toStrictEqual(Array.from({ length: count }, () => ({
				message: 'Extract this object return type into a named type alias.',
				nodeType: 'TSTypeLiteral',
				severity: 2,
				fix: undefined,
			})));
		}
	});

	test('Type literal brace formatting autofixes consistently', async () => {
		const fixingEslint = new ESLint({
			baseConfig: pvtnbr(),
			overrideConfigFile: true,
			overrideConfig: {
				rules: {
					'pvtnbr/prefer-arrow-functions': 'off',
				},
			},
			fix: true,
		});

		for (const [input, expected] of [
			[
				'export class Renderers {\n\tindentText({ text, spaces }: { text: string;\n\t\tspaces: number; }) {\n\t\treturn text.repeat(spaces);\n\t}\n}\n',
				'export class Renderers {\n\tindentText({ text, spaces }: {\n\t\ttext: string;\n\t\tspaces: number;\n\t}) {\n\t\treturn text.repeat(spaces);\n\t}\n}\n',
			],
			[
				'export type TextOptions = { text: string };\n',
				'export type TextOptions = { text: string };\n',
			],
			[
				'export type TextOptions = { text: string; spaces: number };\n',
				'export type TextOptions = {\n\ttext: string;\n\tspaces: number;\n};\n',
			],
			[
				'export type TextOptions = { text: string; spaces: number; prefix: string; suffix: string };\n',
				'export type TextOptions = {\n\ttext: string;\n\tspaces: number;\n\tprefix: string;\n\tsuffix: string;\n};\n',
			],
		]) {
			const [result] = await fixingEslint.lintText(input, { filePath: 'type-literal.ts' });
			const output = result.output ?? input;
			expect(result.messages).toStrictEqual([]);
			expect(output).toBe(expected);

			const [secondPass] = await fixingEslint.lintText(output, { filePath: 'type-literal.ts' });
			expect(secondPass.messages).toStrictEqual([]);
			expect(secondPass.output).toBeUndefined();
		}
	});

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
