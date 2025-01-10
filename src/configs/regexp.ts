import regexpPlugin from 'eslint-plugin-regexp';
import { defineConfig } from '../utils/define-config.js';
import { jsAndTs } from '../utils/globs.js';

export const regexp = defineConfig({
	files: jsAndTs,
	plugins: {
		regexp: regexpPlugin,
	},
	rules: regexpPlugin.configs.recommended.rules,
});
