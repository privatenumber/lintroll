import regexpPlugin from 'eslint-plugin-regexp';
import { defineConfig } from '../utils/define-config.js';

export const regexp = [defineConfig({
	plugins: {
		regexp: regexpPlugin,
	},
	rules: regexpPlugin.configs.recommended.rules,
})];
