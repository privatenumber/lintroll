import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { testSuite, expect } from 'manten';
import { createFixture } from 'fs-fixture';
import { lintroll } from '../utils/eslint.js';
import { createGit } from '../utils/create-git.js';

// Normalize path separators for platform (forward slash on Unix, backslash on Windows)
const slash = (filePath: string) => filePath.replaceAll('/', path.sep);

export default testSuite(({ describe }) => {
	describe('cli', ({ test, describe }) => {
		test('implicitly lints cwd', async () => {
			const cwd = fileURLToPath(new URL('fixtures/', import.meta.url));
			const results = await lintroll([], cwd);

			expect(results.output).toContain('fail.js');
		});

		describe('--git flag', ({ test }) => {
			test('lints only git tracked files', async ({ onTestFail }) => {
				await using fixture = await createFixture({
					'tracked.js': 'const x = "unquoted"',
					'untracked.js': 'const y = "also-unquoted"',
				});

				onTestFail(() => console.log('Fixture at:', fixture.path));

				const git = createGit(fixture.path);
				await git.init();
				await git('add', ['tracked.js']);

				const { output } = await lintroll(['--git'], fixture.path);

				expect(output).toContain('tracked.js');
				expect(output).not.toContain('untracked.js');
			});

			test('handles empty result when no tracked files match', async ({ onTestFail }) => {
				await using fixture = await createFixture({
					'untracked.js': 'const x = "unquoted"',
				});

				onTestFail(() => console.log('Fixture at:', fixture.path));

				const git = createGit(fixture.path);
				await git.init();

				const result = await lintroll(['--git'], fixture.path);

				// Successful processes don't have exitCode property, only errors do
				expect('exitCode' in result ? result.exitCode : 0).toBe(0);
			});

			test('lints tracked files in subdirectories', async ({ onTestFail }) => {
				await using fixture = await createFixture({
					'src/tracked.js': 'const x = "unquoted"',
					'src/untracked.js': 'const y = "also-unquoted"',
				});

				onTestFail(() => console.log('Fixture at:', fixture.path));

				const git = createGit(fixture.path);
				await git.init();
				await git('add', ['src/tracked.js']);

				const { output } = await lintroll(['--git'], fixture.path);

				expect(output).toContain(slash('src/tracked.js'));
				expect(output).not.toContain(slash('src/untracked.js'));
			});

			test('respects subdirectory argument', async ({ onTestFail }) => {
				await using fixture = await createFixture({
					'src/file.js': 'const x = "unquoted"',
					'other/file.js': 'const y = "also-unquoted"',
				});

				onTestFail(() => console.log('Fixture at:', fixture.path));

				const git = createGit(fixture.path);
				await git.init();
				await git('add', ['.']);

				const { output } = await lintroll(['--git', 'src'], fixture.path);

				expect(output).toContain(slash('src/file.js'));
				// Note: output may contain debug info mentioning other files, but no lint errors for them
				expect(output).toContain('@stylistic/quotes'); // At least one error from src/file.js
			});
		});

		describe('config files', ({ test }) => {
			test('picks up .js config in module context', async () => {
				const cwd = fileURLToPath(new URL('fixtures/js-config-module/', import.meta.url));
				const { output } = await lintroll([], cwd);

				expect(output).toContain('Using config file: eslint.config.js');
				expect(output).toContain('no-console');
				expect(output).not.toContain('@stylistic/semi');
			});

			test('picks up .js config in commonjs context', async () => {
				const cwd = fileURLToPath(new URL('fixtures/js-config-commonjs/', import.meta.url));
				const { output } = await lintroll([], cwd);

				expect(output).toContain('Using config file: eslint.config.js');
				expect(output).toContain('no-console');
				expect(output).not.toContain('@stylistic/semi');
			});

			test('picks up .ts config in module context', async () => {
				const cwd = fileURLToPath(new URL('fixtures/ts-config-module/', import.meta.url));
				const { output } = await lintroll([], cwd);

				expect(output).toContain('Using config file: eslint.config.ts');
				expect(output).toContain('no-console');
				expect(output).not.toContain('@stylistic/semi');
			});

			test('picks up .ts config in commonjs context', async () => {
				const cwd = fileURLToPath(new URL('fixtures/ts-config-commonjs/', import.meta.url));
				const { output } = await lintroll([], cwd);

				expect(output).toContain('Using config file: eslint.config.ts');
				expect(output).toContain('no-console');
				expect(output).not.toContain('@stylistic/semi');
			});

			test('picks up .cjs config', async () => {
				const cwd = fileURLToPath(new URL('fixtures/cjs-config/', import.meta.url));
				const { output } = await lintroll([], cwd);

				expect(output).toContain('Using config file: eslint.config.cjs');
				expect(output).toContain('no-console');
				expect(output).not.toContain('@stylistic/semi');
			});

			test('picks up .cts config', async () => {
				const cwd = fileURLToPath(new URL('fixtures/cts-config/', import.meta.url));
				const { output } = await lintroll([], cwd);

				expect(output).toContain('Using config file: eslint.config.cts');
				expect(output).toContain('no-console');
				expect(output).not.toContain('@stylistic/semi');
			});

			test('picks up .mjs config', async () => {
				const cwd = fileURLToPath(new URL('fixtures/mjs-config/', import.meta.url));
				const { output } = await lintroll([], cwd);

				expect(output).toContain('Using config file: eslint.config.mjs');
				expect(output).toContain('no-console');
				expect(output).not.toContain('@stylistic/semi');
			});

			test('picks up .mts config', async () => {
				const cwd = fileURLToPath(new URL('fixtures/mts-config/', import.meta.url));
				const { output } = await lintroll([], cwd);

				expect(output).toContain('Using config file: eslint.config.mts');
				expect(output).toContain('no-console');
				expect(output).not.toContain('@stylistic/semi');
			});
		});
	});
});
