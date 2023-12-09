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

declare module 'eslint-plugin-*' {
	import type { ESLint } from 'eslint';

	const plugin: ESLint.Plugin;
	export default plugin;
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

declare module 'eslint-plugin-promise' {
	import type { ESLint } from 'eslint';

	const plugin: ESLint.Plugin & {
		configs: {
			recommended: ESLint.ConfigData;
		};
	};
	export default plugin;
}

declare module 'eslint-plugin-regexp' {
	import type { ESLint } from 'eslint';

	export const rules: ESLint.Plugin['rules'];
	export const configs: ESLint.Plugin['configs'] & {
		recommended: ESLint.ConfigData;
	};
}

declare module 'eslint-plugin-no-use-extend-native' {
	import type { ESLint } from 'eslint';

	export const rules: ESLint.Plugin['rules'];
	export const configs: ESLint.Plugin['configs'] & {
		recommended: ESLint.ConfigData;
	};
}

declare module 'eslint-plugin-unicorn' {
	import type { ESLint } from 'eslint';

	const plugin: ESLint.Plugin & {
		configs: {
			recommended: ESLint.ConfigData;
		};
	};
	export default plugin;
}

declare module 'eslint-plugin-react' {
	import type { ESLint } from 'eslint';
	import type { ParserOptions } from 'eslint-define-config';

	const plugin: ESLint.Plugin & {
		configs: {
			recommended: ESLint.ConfigData & {
				parserOptions: ParserOptions;
			};
			'jsx-runtime': ESLint.ConfigData;
		};
	};
	export default plugin;
}

declare module '@stylistic/eslint-plugin' {
	import type { ESLint } from 'eslint';

	const plugin: ESLint.Plugin;
	export default plugin;
}

declare module 'eslint-plugin-react-hooks' {
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

	const plugin: ESLint.Plugin & {
		configs: {
			'vue3-recommended': ESLint.ConfigData;
		};
	};
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

declare module 'eslint-plugin-n/lib/configs/recommended-*.js' {
	import type { LanguageOptions } from 'eslint-define-config';

	const recommended: {
		eslintrc: LanguageOptions;
	};
	export default recommended;
}
