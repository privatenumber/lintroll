import { pvtnbrPlugin } from '../custom-rules';
import { defineConfig } from '../utils/define-config';

export const customConfigs = defineConfig({
	plugins: {
		pvtnbr: pvtnbrPlugin,
	},
	rules: pvtnbrPlugin.configs.base.rules,
});
