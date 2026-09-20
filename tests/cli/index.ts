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

	test('--staged exits cleanly when no files are staged', async () => {
		await using fixture = await createFixture({
			'file.js': 'const value = 1;\n',
		});
		const git = createGit(fixture.path);
		await git.init();

		const result = await lintroll(['--staged'], fixture.path);

		assert.ok(!('exitCode' in result));
		expect(result.output).toBe('');
	});

	test('--staged --git lints only staged tracked files', async () => {
		await using fixture = await createFixture({
			'staged.js': "export const staged = 'clean';\n",
			'unstaged.js': "export const unstaged = 'clean';\n",
		});
		const git = createGit(fixture.path);
		await git.init();
		await git('add', ['.']);
		await git('commit', ['-m', 'Initial commit']);
		await fs.writeFile(fixture.getPath('staged.js'), 'const staged = "changed";\n');
		await fs.writeFile(fixture.getPath('unstaged.js'), 'const unstaged = "changed";\n');
		await git('add', ['staged.js']);

		const result = await lintroll(['--staged', '--git'], fixture.path);

		expect(result.output).toContain('staged.js');
		expect(result.output).not.toContain('unstaged.js');
	});

	test('--quiet hides warnings without changing a successful exit', async () => {
		await using fixture = await createFixture({
			'file.js': "console.log('warning');\n",
		});

		const regular = await lintroll([], fixture.path);
		const quiet = await lintroll(['--quiet'], fixture.path);

		expect(regular.output).toContain('no-console');
		expect(quiet.output).not.toContain('no-console');
		assert.ok(!('exitCode' in quiet));
	});

	test('forwards --cache and --cache-location', async () => {
		await using fixture = await createFixture({
			'file.js': 'export const value = 1;\n',
		});
		const cacheLocation = fixture.getPath('cache/eslint');

		await lintroll(['--cache', '--cache-location', cacheLocation], fixture.path);

		await expect(fs.access(cacheLocation)).resolves.toBeUndefined();
	});

	test('returns exit code 2 for fatal syntax errors', async () => {
		await using fixture = await createFixture({
			'broken.js': 'const =;\n',
		});

		const result = await lintroll([], fixture.path);

		assert.ok('exitCode' in result);
		expect(result.exitCode).toBe(2);
		expect(result.output).toContain('Parsing error');
	});

	test('prints config, git, fix, and formatter output in order', async () => {
		await using fixture = await createFixture({
			'package.json': JSON.stringify({ type: 'module' }),
			'eslint.config.js': `export { default } from ${JSON.stringify(import.meta.resolve('#pvtnbr'))};\n`,
			'mixed.js': 'const value = "hello";\n',
		});
		const git = createGit(fixture.path);
		await git.init();
		await git('add', ['.']);

		const { output } = await lintroll(['--git', '--fix'], fixture.path);

		onTestFail(() => console.log(output));

		const configIndex = output.indexOf('Using config file: eslint.config.js');
		const gitIndex = output.indexOf('Linting 3 git-tracked files');
		const fixedIndex = output.indexOf('Applied auto-fixes to ');
		const formatterIndex = output.indexOf('no-unused-vars');

		expect(configIndex).toBeGreaterThanOrEqual(0);
		expect(gitIndex).toBeGreaterThan(configIndex);
		expect(fixedIndex).toBeGreaterThan(gitIndex);
		expect(formatterIndex).toBeGreaterThan(fixedIndex);
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
			// Note: output may contain debug info mentioning other files, but no lint errors for them
			expect(output).toContain('@stylistic/quotes'); // At least one error from src/file.js
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
			expect(output).toContain('@stylistic/quotes');
		});
	});

	describe('--fix flag', () => {
		test('logs a file fixed to empty', async () => {
			await using fixture = await createFixture({
				'eslint.config.js': `export default [{
	plugins: { test: { rules: { remove: {
		meta: { type: 'problem', fixable: 'code', schema: [] },
		create: context => ({
			DebuggerStatement: node => context.report({
				node,
				message: 'Remove debugger',
				fix: fixer => fixer.replaceTextRange([0, context.sourceCode.text.length], ''),
			}),
		}),
	} } } },
	rules: { 'test/remove': 'error' },
}];\n`,
				'empty.js': 'debugger;\n',
			});

			const { stdout } = await lintroll(['--fix', 'empty.js'], fixture.path);

			expect(stdout).toContain('Applied auto-fixes to 1 file:\n  empty.js');
			expect(await fs.readFile(fixture.getPath('empty.js'), 'utf8')).toBe('');
		});

		test('logs single fixed file', async () => {
			await using fixture = await createFixture({
				// Double quotes → fixable to single quotes by @stylistic/quotes
				'fixable.mjs': 'export default "hello";\n',
			});

			onTestFail(() => console.log('Fixture at:', fixture.path));

			const { stdout } = await lintroll(['--fix'], fixture.path);

			expect(stdout).toContain('Applied auto-fixes to 1 file:\n  fixable.mjs');
		});

		test('logs multiple fixed files', async () => {
			await using fixture = await createFixture({
				'a.mjs': 'export default "hello";\n',
				'b.mjs': 'export default "world";\n',
			});

			onTestFail(() => console.log('Fixture at:', fixture.path));

			const { stdout } = await lintroll(['--fix'], fixture.path);

			expect(stdout).toContain('Applied auto-fixes to 2 files:');
			expect(stdout).toContain('  a.mjs');
			expect(stdout).toContain('  b.mjs');
		});

		test('does not log when nothing was fixed', async () => {
			await using fixture = await createFixture({
				// Already uses single quotes — nothing to fix
				'clean.mjs': "export default 'hello';\n",
			});

			onTestFail(() => console.log('Fixture at:', fixture.path));

			const { stdout } = await lintroll(['--fix'], fixture.path);

			expect(stdout).not.toContain('Applied auto-fixes');
		});

		test('logs fixed files alongside remaining errors', async () => {
			await using fixture = await createFixture({
				// Double quotes → fixable, but no-unused-vars is not
				'mixed.js': 'const x = "hello";\n',
			});

			onTestFail(() => console.log('Fixture at:', fixture.path));

			const result = await lintroll(['--fix'], fixture.path);

			// Fixed files are logged before ESLint error output
			expect(result.stdout).toContain('Applied auto-fixes to 1 file:\n  mixed.js');
			expect(result.stdout).toContain('no-unused-vars');
		});
	});

	describe('--ignore-pattern flag', () => {
		test('ignores matching files', async () => {
			await using fixture = await createFixture({
				'included.js': 'const included = "included";\n',
				'ignored.js': 'const ignored = "ignored";\n',
			});

			const { output } = await lintroll(['--ignore-pattern', 'ignored.js'], fixture.path);

			expect(output).toContain('included.js');
			expect(output).not.toContain('ignored.js');
		});

		test('errors when no value is provided', async () => {
			await using fixture = await createFixture({
				'file.js': 'const x = 1;',
			});

			onTestFail(() => console.log('Fixture at:', fixture.path));

			const result = await lintroll(['--ignore-pattern'], fixture.path);

			assert.ok('exitCode' in result);
			expect(result.exitCode).toBe(1);
			expect(result.stderr).toContain("'ignorePatterns' must be an array of non-empty strings or null");
		});
	});

	describe('config files', () => {
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

		test('picks up .ts config that imports an ES module in commonjs context', async () => {
			const cwd = fileURLToPath(new URL('fixtures/ts-config-commonjs-esm-dep/', import.meta.url));
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
