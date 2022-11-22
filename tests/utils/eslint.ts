import path from 'path';
import { ESLint, type Linter } from 'eslint';

const baseConfigPath = path.resolve('./dist/index.js');

export const createEslint = (
	config?: Linter.Config,
	cwd?: string,
) => {
	const originalCwd = process.cwd();

	if (cwd) {
		// For https://github.com/eslint-community/eslint-plugin-n/blob/16657772886f047d0f967f1a4b0648da636b521a/lib/configs/recommended.js#L8
		process.chdir(cwd);
	}

	const eslint = new ESLint({
		cwd,
		baseConfig: {
			...config,
			extends: [
				baseConfigPath,
				config?.extends ?? [],
			].flat(),
		},
		useEslintrc: false,
	});

	process.chdir(originalCwd);

	return eslint;
};

export const eslint = createEslint();
