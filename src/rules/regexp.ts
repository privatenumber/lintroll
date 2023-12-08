import type { FlatESLintConfig } from 'eslint-define-config';
import * as regexpPlugin from 'eslint-plugin-regexp';

export const regexp: FlatESLintConfig ={
	plugins: {
		regexp: regexpPlugin,
	},
	rules: regexpPlugin.configs.recommended.rules,
};
