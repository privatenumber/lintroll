import path from 'path';
import { ESLint, type Linter } from 'eslint';

export const createEslint = (
	config?: Linter.Config,
) => new ESLint({
	baseConfig: {
		extends: path.join(__dirname, '../../dist/index.js'),
		...config,
	},
	useEslintrc: false,
});

export const eslint = createEslint();
