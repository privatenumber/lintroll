import path from 'path';
import { ESLint, type Linter } from 'eslint';

export const createEslint = (
	config?: Linter.Config,
) => new ESLint({
	useEslintrc: false,
	baseConfig: {
		extends: path.join(__dirname, '../../dist/index.js'),
		...config,
	},
});

export const eslint = createEslint();
