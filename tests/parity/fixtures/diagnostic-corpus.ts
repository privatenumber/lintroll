import { fileURLToPath } from 'node:url';
import type { FileTree } from 'fs-fixture';
import { createPackageJson } from '../../utils/json.ts';

// The corpus imports manten, which it resolves from the repository's install
const repoNodeModules = fileURLToPath(new URL('../../../node_modules', import.meta.url));

export const diagnosticCorpusFiles = [
	'fail/javascript.js',
	'fail/typescript.ts',
	'fail/Input.tsx',
	'fail/node.mjs',
];

/**
 * Diagnostics are compared by path relative to the fixture root, so both
 * linters report matching relative paths.
 */
export const diagnosticCorpusFixture: FileTree = {
	'package.json': createPackageJson({
		name: 'parity-corpus',
		version: '0.0.0',
		private: true,
		type: 'module',
		devDependencies: {
			manten: '*',
		},
	}),
	node_modules: ({ symlink }) => symlink(repoNodeModules),
	'fail/javascript.js': `import { expect as _expect } from 'manten';
import path from 'node:path';

export { _expect, path };

export const isZero = (value) => {
	let number = Number(value);
	return number == 0;
};

export const wrapped = Promise.resolve(1).then(value => Promise.resolve(value));
export const digitPattern = /[0-9]/u;
console.log('warning');
export const parsed = parseInt("1", 10)
`,
	'fail/typescript.ts': `interface Payload {
	value: any;
}

export type { Payload };
`,
	'fail/Input.tsx': `export const Input = ({ value }) => <input value={value} />;
`,
	'fail/node.mjs': `import fs from 'fs';

export const read = () => fs.readFile('file', () => {});
`,
};
