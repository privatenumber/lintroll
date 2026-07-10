import type { Linter } from 'eslint';
import ymlPlugin from 'eslint-plugin-yml';
import * as ymlParser from 'yaml-eslint-parser';
import { defineConfig } from '../utils/define-config.ts';
import { getRules } from '../utils/get-rules.ts';

export const yml = defineConfig({
	files: ['**/*.{yml,yaml}'],
	plugins: {
		yml: ymlPlugin,
	},
	languageOptions: {
		parser: ymlParser as Linter.Parser,
	},
	rules: {
		...getRules(ymlPlugin.configs['flat/standard']),

		// GitHub Actions supports empty values to enable features
		'yml/no-empty-mapping-value': 'off',
	},
});
