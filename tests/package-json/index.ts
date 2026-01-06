import { fileURLToPath } from 'node:url';
import { testSuite, expect } from 'manten';
import { createFixture } from 'fs-fixture';
import { ESLint } from 'eslint';
import { pvtnbr } from '#pvtnbr';
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
		test('no-extraneous-dependencies allows devDeps but catches missing deps', async ({ onTestFail }) => {
			// Create isolated fixture with symlinked node_modules
			await using fixture = await createFixture({
				'package.json': JSON.stringify({
					name: 'private-app',
					version: '1.0.0',
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
				'app.js': `import { testSuite } from 'manten';\nimport { createFixture } from 'fs-fixture';\n\nexport { testSuite, createFixture };\n`,
				// Symlink node_modules so imports can be resolved
				'node_modules': ({ symlink }) => symlink(`${process.cwd()}/node_modules`),
			});

			onTestFail(() => console.log('Fixture at:', fixture.path));

			const fixtureEslint = new ESLint({
				cwd: fixture.path,
				baseConfig: pvtnbr(),
				overrideConfigFile: true,
			});

			const results = await fixtureEslint.lintFiles(['app.js']);

			const allMessages = results.flatMap(r => r.messages);
			const extraneousErrors = allMessages.filter(
				message => message.ruleId === 'import-x/no-extraneous-dependencies',
			);

			// Should have exactly 1 error: fs-fixture (missing from package.json)
			// Should NOT have error for: manten (in devDeps, which is allowed everywhere)
			expect(extraneousErrors.length).toBe(1);
			expect(extraneousErrors[0].message).toContain('fs-fixture');
			expect(extraneousErrors[0].message).toContain("should be listed in the project's dependencies");
		});
	});
});
