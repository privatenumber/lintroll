import { fileURLToPath } from 'node:url';
import { testSuite, expect } from 'manten';
import { lintroll } from '../utils/eslint.js';

export default testSuite(({ describe }) => {
	describe('cli', ({ test }) => {
		test('implicitly lints cwd', async () => {
			const cwd = fileURLToPath(new URL('fixtures/', import.meta.url));
			const results = await lintroll([], cwd);

			expect(results.output).toContain('fail.js');
		});
	});
});
