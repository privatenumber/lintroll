import { fileURLToPath } from 'node:url';
import type { FileTree } from 'fs-fixture';
import { createPackageJson } from '../../utils/json.ts';

// The fixture imports manten, which it resolves from the repository's install
const repoNodeModules = fileURLToPath(new URL('../../../node_modules', import.meta.url));

/**
 * A project that imports a non-JavaScript asset, so the bundler resolver is
 * exercised against a real dependency.
 */
export const assetImportFixture: FileTree = {
	'package.json': createPackageJson({
		name: 'bundler-fixture',
		version: '0.0.0',
		private: true,
		type: 'module',
		devDependencies: {
			manten: '*',
		},
	}),
	node_modules: ({ symlink }) => symlink(repoNodeModules),
	'src/pass.js': `import { ESLint } from 'manten';
import box from './box.svg';

// eslint-disable-next-line no-console
console.log(
	ESLint,
	box,
);
`,
	'src/box.svg': `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" fill="red" />
</svg>
`,
};
