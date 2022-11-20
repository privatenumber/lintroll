import path from 'path';
import { ESLint, type Linter } from 'eslint';

export const createEslint = (
	config?: Linter.Config,
) => new ESLint({
	baseConfig: {
		...config,
		extends: [
			path.resolve('./dist/index.js'),
			...config?.extends ?? [],
		],
	},
	useEslintrc: false,
});

export const eslint = createEslint();
