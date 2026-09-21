import type { FileTree } from 'fs-fixture';

/**
 * Deprecated and non-preferred Node APIs in each module syntax, so the node
 * configuration's rules are exercised for .cts, .mjs, and .mts files.
 */
export const unsupportedNodeUsageFixture: FileTree = {
	'fail.cts': `const fs = require('fs');

fs.readFile('filePath');

fs.exists('./foo.js');
`,
	'fail.mjs': `import fs from 'fs';
import '../index';

console.log(__dirname);

fs.readFile('filePath');

fs.exists('./foo.js');

process.exit();

new Buffer();
`,
	'fail.mts': `import fs from 'fs';

fs.readFile('filePath');

fs.exists('./foo.js');

console.log(__filename);
`,
};
