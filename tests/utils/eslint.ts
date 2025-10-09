import { fileURLToPath } from 'node:url';
import { ESLint } from 'eslint';
import spawn, { type SubprocessError } from 'nano-spawn';
import { pvtnbr, type Options } from '#pvtnbr';

export const createEslint = (
	options?: Options,
) => new ESLint({
	baseConfig: pvtnbr(options),

	// Don't look up config file
	overrideConfigFile: true,
});

export const eslint = createEslint();

// Keep tsx loader as file:// URL for cross-platform compatibility
// Windows requires file:// URLs, not absolute paths
const tsxLoaderUrl = import.meta.resolve('tsx');

export const lintroll = (
	args: string[],
	cwd: string,
) => spawn(
	process.execPath,
	[
		fileURLToPath(import.meta.resolve('#cli')),
		...args,
	],
	{
		cwd,
		env: {
			...process.env,
			NODE_OPTIONS: `--import ${tsxLoaderUrl}`,
		},
	},
).catch(error => error as SubprocessError);
