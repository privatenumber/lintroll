import type { FileTree } from 'fs-fixture';

/**
 * ESLint directive corpus that both the ESLint and Oxlint suites lint. Both
 * linters must see identical input, so the definition is shared instead of
 * copied into each fixture.
 */
export const eslintDirectivesFixture: FileTree = {
	'src/fail.js': `/* eslint-enable some-rule */

// eslint-disable-next-line eqeqeq
Math.random();

// eslint-disable-next-line
console.log();
`,
};
