import { fileURLToPath } from 'node:url';
import { ESLint } from 'eslint';
import { execaNode } from 'execa';
import { pvtnbr, type Options } from '#pvtnbr';

export const createEslint = (
	options?: Options,
) => new ESLint({
	baseConfig: pvtnbr(options),

	// Don't look up config file
	overrideConfigFile: true,
});

export const eslint = createEslint();

export const eslintCli = (
	file: string,
	cwd: string,
) => execaNode(
	fileURLToPath(import.meta.resolve('#cli')),
	[
		'--node=true',
		file,
	],
	{
		cwd,
		env: {
			NODE_OPTIONS: '--import tsx',
		},
	},
);
