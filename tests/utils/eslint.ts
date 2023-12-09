import { FlatESLint } from 'eslint/use-at-your-own-risk';
import { pvtnbr, type Options } from '../../src/index.js';

export const createEslint = (
	options?: Options,
	cwd?: string,
) => {
	const originalCwd = process.cwd();

	if (cwd) {
		// For https://github.com/eslint-community/eslint-plugin-n/blob/16657772886f047d0f967f1a4b0648da636b521a/lib/configs/recommended.js#L8
		process.chdir(cwd);
	}

	const eslint = new FlatESLint({
		cwd,

		baseConfig: pvtnbr(options),

		// Don't look up config file
		overrideConfigFile: true,
	});

	process.chdir(originalCwd);

	return eslint;
};

export const eslint = createEslint();
