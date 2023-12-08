declare module '@eslint/js' {
	import type { Rules } from 'eslint-define-config';

	const rules: {
		configs: {
			recommended: {
				rules: Rules;
			};
		};
	};

	export default rules;
}

declare module 'eslint-plugin-import' {
	import type { ESLint } from 'eslint';

	export const rules: ESLint.Plugin['rules'];
	export const configs: ESLint.Plugin['configs'] & {
		typescript: ESLint.ConfigData;
	};
}

declare module '@typescript-eslint/eslint-plugin' {
	import type { ESLint } from 'eslint';

	const plugin: ESLint.Plugin & {
		configs: {
			recommended: ESLint.ConfigData;
			'eslint-recommended': ESLint.ConfigData;
		};
	};
	export default plugin;
}

declare module 'eslint-plugin-eslint-comments' {
	import type { ESLint } from 'eslint';

	const plugin: ESLint.Plugin & {
		configs: {
			recommended: ESLint.ConfigData;
		};
	};
	export default plugin;
}
