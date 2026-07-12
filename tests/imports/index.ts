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

	test('fast mode detects direct cycles', async () => {
		await using fixture = await createFixture({
			'package.json': `${JSON.stringify({
				name: 'direct-cycle-fixture',
				version: '1.0.0',
				license: 'MIT',
				private: true,
				type: 'module',
			}, null, '\t')}\n`,
			'a.js': "import { b } from './b.js';\n\nexport const a = b;\n",
			'b.js': "import { a } from './a.js';\n\nexport const b = a;\n",
		});

		const fixtureEslint = new ESLint({
			cwd: fixture.path,
			baseConfig: pvtnbr({ mode: 'fast' }),
			overrideConfigFile: true,
		});
		const results = await fixtureEslint.lintFiles([
			fixture.getPath('a.js'),
			fixture.getPath('b.js'),
		]);
		const messages = results.flatMap(result => result.messages);

		onTestFail(() => {
			console.log(messages);
		});

		expect(hasCycle(messages)).toBe(true);
	});

	test('fast mode does not reuse full mode cache entries', async () => {
		await using fixture = await createFixture({
			'package.json': `${JSON.stringify({
				name: 'cached-cycle-fixture',
				version: '1.0.0',
				license: 'MIT',
				private: true,
				type: 'module',
			}, null, '\t')}\n`,
			'a.js': "import { b } from './b.js';\n\nexport const a = b;\n",
			'b.js': "import { c } from './c.js';\n\nexport const b = c;\n",
			'c.js': "import { a } from './a.js';\n\nexport const c = a;\n",
		});

		const files = [
			fixture.getPath('a.js'),
			fixture.getPath('b.js'),
			fixture.getPath('c.js'),
		];
		const cacheLocation = fixture.getPath('.eslintcache');
		const full = new ESLint({
			cache: true,
			cacheLocation,
			cwd: fixture.path,
			baseConfig: pvtnbr(),
			overrideConfigFile: true,
		});
		const fullResults = await full.lintFiles(files);
		const fullMessages = fullResults.flatMap(result => result.messages);

		expect(hasCycle(fullMessages)).toBe(true);

		const fast = new ESLint({
			cache: true,
			cacheLocation,
			cwd: fixture.path,
			baseConfig: pvtnbr({ mode: 'fast' }),
			overrideConfigFile: true,
		});
		const fastResults = await fast.lintFiles(files);
		const fastMessages = fastResults.flatMap(result => result.messages);

		onTestFail(() => {
			console.log({
				fullMessages,
				fastMessages,
			});
		});

		expect(hasCycle(fastMessages)).toBe(false);
	});
});
