declare module '@stylistic/eslint-plugin' {
	import type { ESLint } from 'eslint';

	const plugin: ESLint.Plugin;
	export default plugin;
}

declare module 'eslint-plugin-import' {
	import type { ESLint, Linter } from 'eslint';

	const plugin: ESLint.Plugin & {
		configs: {
			recommended: ESLint.ConfigData & {
				rules: Linter.RulesRecord;
			};
			typescript: ESLint.ConfigData & {
				rules: Linter.RulesRecord;
				settings: {
					'import/resolver': object;
				};
			};
		};
	};

	export default plugin;
}
declare module '@eslint-community/eslint-plugin-eslint-comments' {
	import type { ESLint, Linter } from 'eslint';

	const plugin: ESLint.Plugin & {
		configs: {
			recommended: ESLint.ConfigData & {
				rules: Linter.RulesRecord;
			};
		};
	};

	export default plugin;
}

declare module 'eslint-plugin-no-use-extend-native' {
	import type { ESLint, Linter } from 'eslint';

	const plugin: ESLint.Plugin & {
		configs: {
			recommended: ESLint.ConfigData & {
				rules: Linter.RulesRecord;
			};
		};
	};

	export default plugin;
}

declare module 'eslint-plugin-promise' {
	import type { ESLint, Linter } from 'eslint';

	const plugin: ESLint.Plugin & {
		configs: {
			recommended: ESLint.ConfigData & {
				rules: Linter.RulesRecord;
			};
		};
	};

	export default plugin;
}

declare module 'eslint-plugin-unicorn' {
	import type { ESLint, Linter } from 'eslint';

	const plugin: ESLint.Plugin & {
		configs: {
			recommended: ESLint.ConfigData & {
				rules: Linter.RulesRecord;
			};
		};
	};

	export default plugin;
}

declare module 'eslint-plugin-vue' {
	import type { ESLint, Linter } from 'eslint';

	const plugin: ESLint.Plugin & {
		configs: {
			base: ESLint.ConfigData & {
				rules: Linter.RulesRecord;
			};
			'vue3-essential': ESLint.ConfigData & {
				rules: Linter.RulesRecord;
			};
			'vue3-strongly-recommended': ESLint.ConfigData & {
				rules: Linter.RulesRecord;
			};
			'vue3-recommended': ESLint.ConfigData & {
				rules: Linter.RulesRecord;
			};
		};

		processors: {
			'.vue': Linter.Processor;
		};

		environments: {
			'setup-compiler-macros': {
				globals: ESLint.Environment['globals'];
			};
		};
	};

	export default plugin;
}

declare module 'vue-eslint-parser' {
	import type { Linter } from 'eslint';

	const parser: Linter.ParserModule;
	export default parser;
}

declare module 'eslint-plugin-regexp' {
	import type { ESLint, Linter } from 'eslint';

	const plugin: ESLint.Plugin & {
		configs: {
			recommended: ESLint.ConfigData & {
				rules: Linter.RulesRecord;
			};
		};
	};

	export default plugin;
}
declare module '@typescript-eslint/eslint-plugin' {
	import type { ESLint, Linter } from 'eslint';

	const plugin: ESLint.Plugin & {
		configs: {
			recommended: ESLint.ConfigData & {
				rules: Linter.RulesRecord;
			};

			'eslint-recommended': ESLint.ConfigData & {
				overrides: [{
					rules: Linter.RulesRecord;
				}];
			};
		};
	};

	export default plugin;
}
declare module '@typescript-eslint/parser' {
	import type { Linter } from 'eslint';

	const parser: Linter.ParserModule;
	export default parser;
}

declare module 'eslint-plugin-react' {
	import type { ESLint, Linter } from 'eslint';

	const plugin: ESLint.Plugin & {
		configs: {
			recommended: ESLint.ConfigData & {
				rules: Linter.RulesRecord;
			};
			'jsx-runtime': ESLint.ConfigData & {
				rules: Linter.RulesRecord;
			};
		};
	};

	export default plugin;
}

declare module 'eslint-plugin-react-hooks' {
	import type { ESLint, Linter } from 'eslint';

	const plugin: ESLint.Plugin & {
		configs: {
			recommended: ESLint.ConfigData & {
				rules: Linter.RulesRecord;
			};
		};
	};

	export default plugin;
}

declare module 'eslint-plugin-markdown' {
	import type { ESLint, Linter } from 'eslint';

	const plugin: ESLint.Plugin & {
		configs: {
			recommended: ESLint.ConfigData & {
				overrides: [{
					rules: Linter.RulesRecord;
				}];
			};
		};
		processors: {
			markdown: Linter.Processor;
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

declare module 'eslint-plugin-prefer-arrow-functions' {
	import type { ESLint } from 'eslint';

	const plugin: ESLint.Plugin;

	export default plugin;
}
