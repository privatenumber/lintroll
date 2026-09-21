import { fileURLToPath } from 'node:url';
import { ESLint } from 'eslint';
import spawn, { type SubprocessError } from 'nano-spawn';
import { pvtnbr, type Options } from '#pvtnbr';

/**
 * ESLint rooted at `cwd`, so a fixture outside the repository can be linted.
 * ESLint refuses to lint files outside of its base path.
 *
 * Two directories are in play. `cwd` scopes the files ESLint accepts, while
 * `options.cwd` decides where configuration discovery reads from and defaults
 * to the process working directory.
 */
export const createEslint = (
	cwd: string,
	options?: Options,
) => new ESLint({
	cwd,
	baseConfig: pvtnbr(options),

	// Don't look up config file
	overrideConfigFile: true,
});

export const eslint = createEslint(process.cwd());

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
	},
).catch(error => error as SubprocessError);
