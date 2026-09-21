import { readFile } from 'node:fs/promises';
import type { FileTree } from 'fs-fixture';
import { createPackageJson } from '../../utils/json.ts';

/**
 * The node configuration reads the supported Node version from the nearest
 * .nvmrc. These fixtures live outside the repository, so they carry a copy of
 * it.
 */
const nvmrc = await readFile(new URL('../../../.nvmrc', import.meta.url), 'utf8');

/**
 * The package.json in each fixture determines the module system applied to its
 * .js files.
 */
export const commonjsPackageFixture: FileTree = {
	'.nvmrc': nvmrc,
	'package.json': createPackageJson({
		type: 'commonjs',
		engines: {
			node: '>=14',
		},
	}),
	'pass.js': `const fs = require('node:fs/promises');

fs.readFile(__filename);
`,
	'pass.cjs': `const fs = require('node:fs/promises');

fs.readFile(__filename);
`,
	'pass.mjs': `import fs from 'node:fs/promises';

fs.readFile('__filename');
`,
};

export const modulePackageFixture: FileTree = {
	'.nvmrc': nvmrc,
	'package.json': createPackageJson({
		type: 'module',
		engines: {
			node: '>=14',
		},
	}),
	'pass.js': `import fs from 'node:fs/promises';

fs.readFile('__filename');
`,
	'pass.cjs': `const fs = require('node:fs/promises');

fs.readFile(__filename);
`,
	'cli.js': `process.exit();
`,
	'scripts/build.js': `console.log('Building...');
`,
};
