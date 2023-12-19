import { fileURLToPath } from 'url';
import eslintApi from 'eslint/use-at-your-own-risk';
import { execa } from 'execa';
import { pvtnbr, type Options } from '#pvtnbr';

export const createEslint = (
	options?: Options,
	cwd?: string,
) => {
	const originalCwd = process.cwd();

	if (cwd) {
		// For https://github.com/eslint-community/eslint-plugin-n/blob/16657772886f047d0f967f1a4b0648da636b521a/lib/configs/recommended.js#L8
		process.chdir(cwd);
	}

	const flatEsLint = new eslintApi.FlatESLint({
		cwd,

		baseConfig: pvtnbr(options),

		// Don't look up config file
		overrideConfigFile: true,
	});

	process.chdir(originalCwd);

	return flatEsLint;
};

export const eslint = createEslint({
	vue: true,
});

export const eslintCli = (
	file: string,
	cwd: string,
) => execa(
	// Couldn't use execaNode because Windows expects file:// path for mjs files, but execaNode didn't accept it
	process.execPath,
	[
		fileURLToPath(import.meta.resolve('#cli')),
		'--no-ignore',
		file,
	],
	{
		cwd,
		env: {
			NODE_OPTIONS: '--import tsx',
		},
	},
);
