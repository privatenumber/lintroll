import * as regexpPlugin from 'eslint-plugin-regexp';
import { defineConfig } from '../utils/define-config';

export const regexp = defineConfig({
	plugins: {
		regexp: regexpPlugin,
	},
	rules: regexpPlugin.configs.recommended.rules,
});
