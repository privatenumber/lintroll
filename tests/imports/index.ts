import { testSuite, expect } from 'manten';
import { ESLint } from 'eslint';
import { pvtnbr } from '#pvtnbr';
import { eslint } from '../utils/eslint.js';

const orderMessages = (
	messages: { ruleId: string | null }[],
) => messages.filter(message => message.ruleId === 'import-x/order');

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

export default testSuite(({ describe }) => {
	describe('imports', ({ describe }) => {
		describe('import order', ({ test }) => {
			test('pass: builtin > external > parent > sibling', async ({ onTestFail }) => {
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

			test('pass: builtin > external > internal > parent > sibling', async ({ onTestFail }) => {
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

			test('fail: sibling before external', async ({ onTestFail }) => {
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

			test('fail: parent before external', async ({ onTestFail }) => {
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

			test('fail: parent before internal', async ({ onTestFail }) => {
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

			test('fail: external before builtin', async ({ onTestFail }) => {
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
	});
});
