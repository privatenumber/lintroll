import {
	describe, test, expect, onTestFail,
} from 'manten';
import { createFixture } from 'fs-fixture';
import { ESLint } from 'eslint';
import { pvtnbr } from '#pvtnbr';
import { createEslint } from '../utils/eslint.ts';
import { createPackageJson } from '../utils/json.ts';

describe('package-json', () => {
	test('no empty dependencies objects', async () => {
		await using fixture = await createFixture({
			'package.json': `{
	"name": "test-package",
	"version": "1.0.0",
	"description": "Test package",
	"license": "MIT",
	"type": "module",
	"dependencies": {}
}
`,
		});

		const [result] = await createEslint(fixture.path).lintFiles(
			fixture.getPath('package.json'),
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

	test('exports-subpaths-style prefers implicit format', async () => {
		await using fixture = await createFixture({
			'package.json': `{
	"name": "test-package",
	"version": "1.0.0",
	"description": "Test package",
	"license": "MIT",
	"type": "module",
	"exports": {
		".": "./index.js"
	}
}
`,
		});

		const [result] = await createEslint(fixture.path).lintFiles(
			fixture.getPath('package.json'),
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

	test('exports-subpaths-style leaves null root exports unchanged', async () => {
		await using fixture = await createFixture({
			'package.json': `{
	"name": "cli-package",
	"version": "1.0.0",
	"description": "Package that encapsulates its entry points",
	"license": "MIT",
	"type": "module",
	"exports": {
		".": null
	}
}
`,
		});

		const [result] = await createEslint(fixture.path).lintFiles(
			fixture.getPath('package.json'),
		);

		onTestFail(() => {
			console.log(result.messages);
		});

		// `{ ".": null }` encapsulates the package; rewriting it to `null`
		// would restore legacy resolution (different Node.js semantics)
		const hasExportsStyleError = result.messages.some(
			message => message.ruleId === 'package-json/exports-subpaths-style',
		);

		expect(hasExportsStyleError).toBe(false);
	});

	test('no-redundant-publishConfig flags unscoped packages', async () => {
		await using fixture = await createFixture({
			'package.json': `{
	"name": "test-package",
	"version": "1.0.0",
	"description": "Test package",
	"license": "MIT",
	"type": "module",
	"publishConfig": {
		"access": "public"
	},
	"dependencies": {
		"lodash": "^4.17.21"
	}
}
`,
		});

		const [result] = await createEslint(fixture.path).lintFiles(
			fixture.getPath('package.json'),
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

	test('valid package.json passes', async () => {
		await using fixture = await createFixture({
			'package.json': `{
	"name": "@scope/test-package",
	"version": "1.0.0",
	"description": "Test package",
	"license": "MIT",
	"publishConfig": {
		"access": "public"
	},
	"type": "module",
	"exports": "./index.js",
	"dependencies": {
		"lodash": "^4.17.21"
	}
}
`,
		});

		const [result] = await createEslint(fixture.path).lintFiles(
			fixture.getPath('package.json'),
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

	test('private packages do not require description', async () => {
		await using fixture = await createFixture({
			'package.json': `{
	"name": "private-package",
	"version": "1.0.0",
	"private": true
}
`,
		});

		const [result] = await createEslint(fixture.path).lintFiles(
			fixture.getPath('package.json'),
		);

		onTestFail(() => {
			console.log(result.messages);
		});

		const hasDescriptionError = result.messages.some(
			message => message.ruleId === 'package-json/require-description',
		);

		expect(hasDescriptionError).toBe(false);
	});

	// CJS is still valid - not all packages need "type": "module"
	test('packages do not require type field', async () => {
		await using fixture = await createFixture({
			'package.json': `{
	"name": "cjs-package",
	"version": "1.0.0",
	"description": "Package without type field (CJS default)",
	"license": "MIT",
	"exports": "./index.js"
}
`,
		});

		const [result] = await createEslint(fixture.path).lintFiles(
			fixture.getPath('package.json'),
		);

		onTestFail(() => {
			console.log(result.messages);
		});

		const hasTypeError = result.messages.some(
			message => message.ruleId === 'package-json/require-type',
		);

		expect(hasTypeError).toBe(false);
	});

	/**
	 * Test: no-extraneous-dependencies behavior
	 *
	 * The rule is configured to allow devDependencies everywhere (devDependencies: ['**\/*'])
	 * because modern JS apps are bundled and the deps vs devDeps distinction doesn't matter
	 * at runtime. This also supports private packages where all deps can be in devDeps.
	 *
	 * Expected behavior:
	 * - Importing a package in devDependencies → ALLOWED (no error)
	 * - Importing a package not in package.json at all → ERROR (catches missing deps)
	 */
	test('no-extraneous-dependencies allows devDeps but catches missing deps', async () => {
		// Create isolated fixture with symlinked node_modules
		await using fixture = await createFixture({
			'package.json': createPackageJson({
				name: 'private-app',
				version: '1.0.0',
				description: 'Node app fixture',
				license: 'MIT',
				private: true,
				type: 'module',
				devDependencies: {
					// manten is listed - importing it should be ALLOWED
					manten: '^1.0.0',
					// fs-fixture is NOT listed - importing it should ERROR
				},
			}),
			// Root level file (not in src/, tests/, etc.)
			// Tests that devDeps are allowed from ANY file location
			'app.js': 'import { testSuite } from \'manten\';\nimport { createFixture } from \'fs-fixture\';\n\nexport { testSuite, createFixture };\n',
			// Symlink node_modules so imports can be resolved
			node_modules: ({ symlink }) => symlink(`${process.cwd()}/node_modules`),
		});

		onTestFail(() => console.log('Fixture at:', fixture.path));

		const fixtureEslint = new ESLint({
			cwd: fixture.path,
			baseConfig: pvtnbr({ node: true }),
			overrideConfigFile: true,
		});

		const results = await fixtureEslint.lintFiles(['app.js']);

		const allMessages = results.flatMap(r => r.messages);

		// fs-fixture is missing from package.json → should error
		const hasMissingDepError = allMessages.some(
			message => message.ruleId === 'import-x/no-extraneous-dependencies'
				&& message.message.includes('fs-fixture'),
		);
		expect(hasMissingDepError).toBe(true);

		// manten is in devDeps, which is allowed everywhere → should NOT error
		const hasDevDepError = allMessages.some(
			message => message.ruleId === 'import-x/no-extraneous-dependencies'
				&& message.message.includes('manten'),
		);
		expect(hasDevDepError).toBe(false);

		const hasDuplicateMissingDepError = allMessages.some(
			message => message.ruleId === 'n/no-extraneous-import'
				&& message.message.includes('fs-fixture'),
		);
		expect(hasDuplicateMissingDepError).toBe(false);
	});

	test('no-extraneous-dependencies checks type-only imports', async () => {
		await using fixture = await createFixture({
			'package.json': createPackageJson({
				name: 'typescript-app',
				version: '1.0.0',
				description: 'TypeScript app fixture',
				license: 'MIT',
				private: true,
				type: 'module',
			}),
			'app.ts': "import type { createFixture } from 'fs-fixture';\n\nexport type Fixture = typeof createFixture;\n",
			node_modules: ({ symlink }) => symlink(`${process.cwd()}/node_modules`),
		});

		onTestFail(() => console.log('Fixture at:', fixture.path));

		const fixtureEslint = new ESLint({
			cwd: fixture.path,
			baseConfig: pvtnbr({ node: true }),
			overrideConfigFile: true,
		});
		const [result] = await fixtureEslint.lintFiles(['app.ts']);

		onTestFail(() => console.log(result.messages));

		expect(result.messages).toEqual(expect.arrayContaining([
			expect.objectContaining({
				ruleId: 'import-x/no-extraneous-dependencies',
				message: expect.stringContaining('fs-fixture'),
			}),
		]));
	});

	test('Node rules check require.resolve dependencies', async () => {
		const fixtureEslint = new ESLint({
			baseConfig: pvtnbr({ node: true }),
			overrideConfigFile: true,
		});
		const [result] = await fixtureEslint.lintText(
			"require.resolve('missing-package');\n",
			{ filePath: 'app.cjs' },
		);

		expect(result.messages).toEqual(expect.arrayContaining([
			expect.objectContaining({
				ruleId: 'n/no-missing-require',
				message: expect.stringContaining('missing-package'),
			}),
		]));
	});
});
