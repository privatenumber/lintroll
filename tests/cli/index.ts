import { fileURLToPath } from 'node:url';
import { testSuite, expect } from 'manten';
import { lintroll } from '../utils/eslint.js';

export default testSuite(({ describe }) => {
	describe('cli', ({ test, describe }) => {
		test('implicitly lints cwd', async () => {
			const cwd = fileURLToPath(new URL('fixtures/', import.meta.url));
			const results = await lintroll([], cwd);

			expect(results.output).toContain('/fail.js');
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
