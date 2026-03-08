import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import {
	describe, test, expect, onTestFail,
} from 'manten';
import { createFixture } from 'fs-fixture';
import { lintroll } from '../utils/eslint.ts';
import { createGit } from '../utils/create-git.ts';

// Normalize path separators for platform (forward slash on Unix, backslash on Windows)
const slash = (filePath: string) => filePath.replaceAll('/', path.sep);

describe('cli', () => {
	test('implicitly lints cwd', async () => {
		const cwd = fileURLToPath(new URL('fixtures/', import.meta.url));
		const results = await lintroll([], cwd);

		expect(results.output).toContain('fail.js');
	});

	describe('--git flag', () => {
		test('errors when not in a git repository', async () => {
			await using fixture = await createFixture({
				'file.js': 'const x = "unquoted"',
			});

			onTestFail(() => console.log('Fixture at:', fixture.path));

			const result = await lintroll(['--git'], fixture.path);

			assert.ok('exitCode' in result);
			expect(result.exitCode).toBe(1);
			expect(result.stderr).toContain('The current working directory is not a git repository');
		});

		test('lints only git tracked files', async () => {
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

		test('handles empty result when no tracked files match', async () => {
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

		test('lints tracked files in subdirectories', async () => {
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

		test('respects subdirectory argument', async () => {
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
			// In hybrid mode: oxfmt flags formatting issues
			// In ESLint-only mode: @stylistic/quotes flags quote style
			// Both modes should report an issue for this file
		});

		test('handles manually deleted files gracefully', async () => {
			await using fixture = await createFixture({
				'tracked.js': 'const x = "unquoted"',
				'deleted.js': 'const y = "also-unquoted"',
			});

			onTestFail(() => console.log('Fixture at:', fixture.path));

			const git = createGit(fixture.path);
			await git.init();
			await git('add', ['.']);
			await git('commit', ['-m', 'Initial commit']);

			// Manually delete the file (not with git rm) - file is still tracked but doesn't exist
			await fs.unlink(path.join(fixture.path, 'deleted.js'));

			const { output } = await lintroll(['--git'], fixture.path);

			expect(output).toContain('tracked.js');
			expect(output).not.toContain('deleted.js');
		});

		test('filters out git-tracked unsupported files', async () => {
			await using fixture = await createFixture({
				'supported.js': 'const x = "unquoted"',
				'.gitignore': 'node_modules/',
				'.npmrc': 'registry=https://registry.npmjs.org/',
			});

			onTestFail(() => console.log('Fixture at:', fixture.path));

			const git = createGit(fixture.path);
			await git.init();
			await git('add', ['.']);

			const { output } = await lintroll(['--git'], fixture.path);

			// Should lint the JS file
			expect(output).toContain('supported.js');
			// Should NOT attempt to lint unsupported files (no errors about them)
			expect(output).not.toContain('.gitignore');
			expect(output).not.toContain('.npmrc');
		});

		test('respects ESLint ignore rules for git-tracked files', async () => {
			await using fixture = await createFixture({
				'src/included.js': 'const x = "unquoted"',
				'dist/ignored.js': 'const y = "also-unquoted"',
			});

			onTestFail(() => console.log('Fixture at:', fixture.path));

			const git = createGit(fixture.path);
			await git.init();
			await git('add', ['.']);

			// ESLint config already ignores dist/ by default in lintroll
			const { output } = await lintroll(['--git'], fixture.path);

			expect(output).toContain(slash('src/included.js'));
			// dist/ should be ignored by ESLint, even though it's git-tracked
			expect(output).not.toContain(slash('dist/ignored.js'));
		});

		test('with path argument filters ESLint-discovered files', async () => {
			await using fixture = await createFixture({
				'src/file.js': 'const x = "unquoted"',
				'tests/file.test.js': 'const y = "also-unquoted"',
				'.gitignore': 'node_modules/',
			});

			onTestFail(() => console.log('Fixture at:', fixture.path));

			const git = createGit(fixture.path);
			await git.init();
			await git('add', ['.']);

			const { output } = await lintroll(['--git', 'src'], fixture.path);

			// Should lint JS files in src/ that ESLint discovers
			expect(output).toContain(slash('src/file.js'));
			// Should NOT lint files outside src/, even though they're git-tracked
			expect(output).not.toContain(slash('tests/file.test.js'));
			// Should NOT lint unsupported files, even in src/
			expect(output).not.toContain('.gitignore');
		});

		test('works when cwd is a subdirectory of git root', async () => {
			await using fixture = await createFixture({
				'src/file.js': 'const x = "unquoted"',
			});

			onTestFail(() => console.log('Fixture at:', fixture.path));

			const git = createGit(fixture.path);
			await git.init();
			await git('add', ['.']);

			// Run from src/ subdirectory instead of git root
			const srcDir = fixture.getPath('src');
			const { output } = await lintroll(['--git', '.'], srcDir);

			expect(output).toContain('file.js');
			// In hybrid mode: oxfmt flags formatting issues
			// In ESLint-only mode: @stylistic/quotes flags quote style
		});
	});

	describe('--fix flag', () => {
		test('fixes formatting issues', async () => {
			await using fixture = await createFixture({
				// Double quotes → oxfmt fixes to single quotes
				'fixable.mjs': 'export default "hello";\n',
			});

			onTestFail(() => console.log('Fixture at:', fixture.path));

			const git = createGit(fixture.path);
			await git.init();
			await git('add', ['.']);

			await lintroll(['--fix'], fixture.path);

			// Verify file was actually fixed
			const content = await fs.readFile(
				fixture.getPath('fixable.mjs'),
				'utf8',
			);
			expect(content).toContain("'hello'");
		});

		test('does not modify already-clean files', async () => {
			await using fixture = await createFixture({
				'clean.mjs': "export default 'hello';\n",
			});

			onTestFail(() => console.log('Fixture at:', fixture.path));

			const git = createGit(fixture.path);
			await git.init();
			await git('add', ['.']);

			const { output } = await lintroll(['--fix'], fixture.path);

			expect(output).not.toContain('oxfmt: fixed');
		});
	});

	describe('--ignore-pattern flag', () => {
		test('skips files matching pattern', async () => {
			await using fixture = await createFixture({
				// var triggers no-var error in oxlint
				'src/file.js': 'var x = 1;\n',
				'ignored/file.js': 'var y = 1;\n',
			});

			onTestFail(() => console.log('Fixture at:', fixture.path));

			const git = createGit(fixture.path);
			await git.init();
			await git('add', ['.']);

			const { output } = await lintroll(
				['--ignore-pattern', 'ignored/**'],
				fixture.path,
			);

			// src/file.js should be linted (has var error)
			expect(output).toContain('no-var');
			// ignored/ should not appear in output
			expect(output).not.toContain(slash('ignored/file.js'));
		});
	});

	// ESLint config file loading tests removed — lintroll uses lintroll.config.ts now
});
