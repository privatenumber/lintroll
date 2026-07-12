import {
	describe, test, expect, onTestFail,
} from 'manten';
import { ESLint } from 'eslint';
import { createFixture } from 'fs-fixture';
import { pvtnbr } from '#pvtnbr';
import { eslint } from '../utils/eslint.ts';

const orderMessages = (
	messages: { ruleId: string | null }[],
) => messages.filter(message => message.ruleId === 'import-x/order');

const resolutionMessages = (
	messages: { ruleId: string | null }[],
) => messages.filter(message => (
	message.ruleId === 'import-x/extensions'
	|| message.ruleId === 'import-x/no-unresolved'
));

const hasCycle = (
	messages: { ruleId: string | null }[],
) => messages.some(message => message.ruleId === 'import-x/no-cycle');

/**
 * ESLint instance with internal-regex to classify `@internal/*` as internal imports.
 * This simulates the behavior when a package self-references its own name
 * (e.g. `import x from 'my-pkg'` inside my-pkg), which the resolver classifies
 * as internal since it resolves to a local path.
 */
const eslintWithInternal = new ESLint({
	baseConfig: [
		...pvtnbr(),
		{
			settings: {
				'import-x/internal-regex': '^@internal/',
			},
		},
	],
	overrideConfigFile: true,
});

describe('imports', () => {
	describe('import order', () => {
		test('pass: builtin > external > parent > sibling', async () => {
			const [result] = await eslint.lintText(
				[
					"import path from 'node:path'",
					"import { expect as _expect } from 'manten'",
					"import { eslint as _eslint } from '../utils/eslint.js'",
					"import { orderMessages as _orderMessages } from './index.js'",
					'',
					'void [path, _expect, _eslint, _orderMessages]',
					'',
				].join('\n'),
				{ filePath: 'tests/imports/test.ts' },
			);

			onTestFail(() => {
				console.log(orderMessages(result.messages));
			});

			expect(orderMessages(result.messages).length).toBe(0);
		});

		test('pass: builtin > external > internal > parent > sibling', async () => {
			const [result] = await eslintWithInternal.lintText(
				[
					"import path from 'node:path'",
					"import { expect as _expect } from 'manten'",
					"import { foo } from '@internal/utils'",
					"import { eslint as _eslint } from '../utils/eslint.js'",
					"import { orderMessages as _orderMessages } from './index.js'",
					'',
					'void [path, _expect, foo, _eslint, _orderMessages]',
					'',
				].join('\n'),
				{ filePath: 'tests/imports/test.ts' },
			);

			onTestFail(() => {
				console.log(orderMessages(result.messages));
			});

			expect(orderMessages(result.messages).length).toBe(0);
		});

		test('fail: sibling before external', async () => {
			const [result] = await eslint.lintText(
				[
					"import { orderMessages } from './index.js'",
					"import { expect as _expect } from 'manten'",
					'',
					'void [orderMessages, _expect]',
					'',
				].join('\n'),
				{ filePath: 'tests/imports/test.ts' },
			);

			onTestFail(() => {
				console.log(orderMessages(result.messages));
			});

			expect(orderMessages(result.messages).length).toBeGreaterThan(0);
		});

		test('fail: parent before external', async () => {
			const [result] = await eslint.lintText(
				[
					"import { eslint as _eslint } from '../utils/eslint.js'",
					"import { expect as _expect } from 'manten'",
					'',
					'void [_eslint, _expect]',
					'',
				].join('\n'),
				{ filePath: 'tests/imports/test.ts' },
			);

			onTestFail(() => {
				console.log(orderMessages(result.messages));
			});

			expect(orderMessages(result.messages).length).toBeGreaterThan(0);
		});

		test('fail: parent before internal', async () => {
			const [result] = await eslintWithInternal.lintText(
				[
					"import { eslint as _eslint } from '../utils/eslint.js'",
					"import { foo } from '@internal/utils'",
					'',
					'void [_eslint, foo]',
					'',
				].join('\n'),
				{ filePath: 'tests/imports/test.ts' },
			);

			onTestFail(() => {
				console.log(orderMessages(result.messages));
			});

			expect(orderMessages(result.messages).length).toBeGreaterThan(0);
		});

		test('fail: external before builtin', async () => {
			const [result] = await eslint.lintText(
				[
					"import { expect as _expect } from 'manten'",
					"import path from 'node:path'",
					'',
					'void [_expect, path]',
					'',
				].join('\n'),
				{ filePath: 'tests/imports/test.ts' },
			);

			onTestFail(() => {
				console.log(orderMessages(result.messages));
			});

			expect(orderMessages(result.messages).length).toBeGreaterThan(0);
		});
	});

	test('resolves TypeScript paths and package imports', async () => {
		await using fixture = await createFixture({
			'package.json': `${JSON.stringify({
				name: 'resolution-fixture',
				version: '1.0.0',
				license: 'MIT',
				private: true,
				type: 'module',
				imports: {
					'#package-import': './src/package-import.ts',
				},
			}, null, '\t')}\n`,
			'tsconfig.json': `${JSON.stringify({
				compilerOptions: {
					baseUrl: '.',
					paths: {
						'@/*': ['./src/*'],
					},
				},
			}, null, '\t')}\n`,
			'src/index.ts': "import '@/path-alias';\nimport '#package-import';\n",
			'src/package-import.ts': 'export const packageImport = true;\n',
			'src/path-alias.ts': 'export const pathAlias = true;\n',
		});

		const fixtureEslint = new ESLint({
			cwd: fixture.path,
			baseConfig: pvtnbr({ cwd: fixture.path }),
			overrideConfigFile: true,
		});
		const [result] = await fixtureEslint.lintFiles(fixture.getPath('src/index.ts'));

		onTestFail(() => {
			console.log(result.messages);
		});

		expect(resolutionMessages(result.messages)).toEqual([]);
	});

	test('detects TypeScript cycles through three modules', async () => {
		await using fixture = await createFixture({
			'package.json': `${JSON.stringify({
				name: 'cycle-fixture',
				version: '1.0.0',
				license: 'MIT',
				private: true,
				type: 'module',
			}, null, '\t')}\n`,
			'tsconfig.json': `${JSON.stringify({
				compilerOptions: {
					allowImportingTsExtensions: true,
					noEmit: true,
				},
			}, null, '\t')}\n`,
			'a.ts': "import { b } from './b.ts';\n\nexport const a = b;\n",
			'b.ts': "import { c } from './c.ts';\n\nexport const b = c;\n",
			'c.ts': "import { a } from './a.ts';\n\nexport const c = a;\n",
		});

		const fixtureEslint = new ESLint({
			cwd: fixture.path,
			baseConfig: pvtnbr({ cwd: fixture.path }),
			overrideConfigFile: true,
		});
		const results = await fixtureEslint.lintFiles([
			fixture.getPath('a.ts'),
			fixture.getPath('b.ts'),
			fixture.getPath('c.ts'),
		]);
		const messages = results.flatMap(result => result.messages);

		onTestFail(() => {
			console.log(messages);
		});

		expect(hasCycle(messages)).toBe(true);
	});
});
