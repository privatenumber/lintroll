declare module '@stylistic/eslint-plugin' {
	import type { ESLint } from 'eslint';

	const plugin: ESLint.Plugin;
	export default plugin;
}

declare module 'eslint-plugin-markdown' {
	import type { ESLint } from 'eslint';

	const plugin: ESLint.Plugin & {
		configs: {
			recommended: ESLint.ConfigData;
		};
	};
	export default plugin;
}

declare module 'eslint-plugin-vue' {
	import type { ESLint } from 'eslint';

	const plugin: ESLint.Plugin;
	export default plugin;
}

declare module 'eslint-plugin-n' {
	import type { ESLint, Linter } from 'eslint';

	const plugin: ESLint.Plugin & {
		configs: {
			recommended: ESLint.ConfigData;
			'flat/mixed-esm-and-cjs': Linter.FlatConfig[];
		};
	};
	export default plugin;
}
