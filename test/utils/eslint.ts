import path from 'path';
import { ESLint } from 'eslint';

export const createEslint = (
	config?: Record<string, unknown>,
) => new ESLint({
	useEslintrc: false,
	baseConfig: {
		extends: path.join(__dirname, '../../index.js'),
		...config,
	},
});

export const eslint = createEslint();
