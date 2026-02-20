import regexpPlugin from 'eslint-plugin-regexp';
import { defineConfig } from '../utils/define-config.ts';
import { jsAndTs } from '../utils/globs.ts';

export const regexp = defineConfig({
	files: jsAndTs,
	plugins: {
		regexp: regexpPlugin,
	},
	rules: regexpPlugin.configs.recommended.rules,
});
