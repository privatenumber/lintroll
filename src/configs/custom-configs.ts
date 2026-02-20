import { pvtnbrPlugin } from '../custom-rules/index.ts';
import { defineConfig } from '../utils/define-config.ts';

export const customConfigs = defineConfig({
	plugins: {
		pvtnbr: pvtnbrPlugin,
	},
	rules: pvtnbrPlugin.configs.base.rules,
});
