import { fileURLToPath } from 'url';
import eslintApi from 'eslint/use-at-your-own-risk';
import { execaNode } from 'execa';
import { pvtnbr, type Options } from '#pvtnbr';

export const createEslint = (
	options?: Options,
) => new eslintApi.FlatESLint({
	baseConfig: pvtnbr(options),

	// Don't look up config file
	overrideConfigFile: true,
});

export const eslint = createEslint({
	vue: true,
});

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
