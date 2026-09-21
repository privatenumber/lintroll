import { fileURLToPath } from 'node:url';
import type { FileTree } from 'fs-fixture';

// eslint-plugin-react detects the React version by resolving it from the linted file
const repoNodeModules = fileURLToPath(new URL('../../../node_modules', import.meta.url));

export const passingComponentFixture: FileTree = {
	'InputComponent.tsx': `const InputComponent = (): JSX.Element => (
	<input
		title="value"
		disabled
	/>
);

export default InputComponent;
`,
	node_modules: ({ symlink }) => symlink(repoNodeModules),
};

export const failingComponentFixture: FileTree = {
	'fail.tsx': `
export const InputComponent = ({ value }) => (
	<input value={value} title='some-title' disabled />
);

export const Button = ({ value }) => (
  <button value={value}>
    Label
  </button>
);
`,
	node_modules: ({ symlink }) => symlink(repoNodeModules),
};
