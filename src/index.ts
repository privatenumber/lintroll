import type { Linter } from 'eslint';
import { getTsconfig } from 'get-tsconfig';
import type { Options } from './types.js';
import { defineConfig } from './utils/define-config.js';
import { eslint } from './configs/eslint.js';
import { serviceWorkers } from './configs/service-workers.js';
import { eslintComments } from './configs/eslint-comments.js';
import { stylistic } from './configs/stylistic.js';
import { imports } from './configs/imports.js';
import { typescript, parseTypescript } from './configs/typescript.js';
import { regexp } from './configs/regexp.js';
import { node } from './configs/node.js';
import { promise } from './configs/promise.js';
import { jest } from './configs/jest.js';
import { markdown } from './configs/markdown.js';
import { json } from './configs/json.js';
import { yml } from './configs/yml.js';
import { noUseExtendNative } from './configs/no-use-extend-native.js';
import { unicorn } from './configs/unicorn.js';
import { react } from './configs/react.js';
import { vue, parseVue } from './configs/vue.js';
import { customConfigs } from './configs/custom-configs.js';

export const pvtnbr = (
	options?: Options,
): Linter.Config[] => {
	const cwd = options?.cwd ?? process.cwd();
	const tsconfig = getTsconfig(cwd);

	return [
		defineConfig({
			ignores: [
				'**/package-lock.json',
				'**/pnpm-lock.yaml',
				'{tmp,temp}/**',
				'**/*.min.js',
				'**/dist/**',
				'**/node_modules/**',
				'**/vendor/**',
				'**/.cache/**',

				// Ignore VitePress cache
				'**/.vitepress',

				// Ignore AI assistant documentation files
				'**/CLAUDE.md',
				'**/.claude',
				'**/AI.md',
				'**/AGENT.md',
				'**/PROMPT.md',
				'**/PROMPTING.md',

				// Cursor IDE
				'**/.cursorrules',
				'**/.cursorignore',
				'**/.cursormem.json',
				'**/.cursorhistory',

				// GitHub Copilot
				'**/copilot.json',
				'**/copilot.config.json',
				'**/copilot.md',
			],
		}),
		defineConfig({
			linterOptions: {
				reportUnusedDisableDirectives: true,
			},
			languageOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
			},
		}),

		/**
		 * Separating the parsers allows to test individual rules
		 * without applying the rules associated with the parsers
		 */
		parseVue,
		parseTypescript,

		eslint,
		serviceWorkers,
		eslintComments,
		...imports,
		...unicorn(options),
		typescript(tsconfig),
		...stylistic,
		regexp,
		promise,
		...node({
			...options,
			cwd,
		}),
		...noUseExtendNative,
		...json,
		yml,

		/**
		 * No options.vue because if *.vue files are detected, they
		 * should be linted regardless of whether `vue` is installed
		 */
		...vue,
		react(tsconfig),
		...markdown(),
		jest,
		customConfigs,
	].filter(Boolean);
};

export default pvtnbr();
export { defineConfig };
export type { Options };
