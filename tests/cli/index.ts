import { fileURLToPath } from 'node:url';
import { testSuite, expect } from 'manten';
import { eslint, createEslint } from '../utils/eslint.js';

// test('cli', async () => {
// 	const linted = await lintroll(
// 		'pass.js',
// 		fileURLToPath(new URL('fixtures/package-commonjs/', import.meta.url)),
// 	);

// 	expect(linted.stdout).toBe('');
// 	expect(linted.stderr).toBe('');
// });

export default testSuite(({ describe }) => {
	describe('cli', ({ test }) => {});
});
