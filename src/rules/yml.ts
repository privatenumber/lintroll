import ymlPlugin from 'eslint-plugin-yml';
import ymlParser from 'yaml-eslint-parser';
import { defineConfig } from '../utils/define-config.js';

export const yml = [
	defineConfig({
		files: ['**/*.{yml,yaml}'],
		plugins: {
			yml: ymlPlugin,
		},
		languageOptions: {
			parser: ymlParser,
		},
		rules: {
			...ymlPlugin.configs.base.rules,
			...ymlPlugin.configs.standard.rules,
		},
	}),
];
