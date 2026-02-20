import type { Linter } from 'eslint';
import { getTsconfig } from 'get-tsconfig';
import type { Options } from './types.ts';
import { defineConfig } from './utils/define-config.ts';
import { eslint } from './configs/eslint.ts';
import { serviceWorkers } from './configs/service-workers.ts';
import { eslintComments } from './configs/eslint-comments.ts';
import { stylistic } from './configs/stylistic.ts';
import { imports } from './configs/imports.ts';
import { typescript, parseTypescript } from './configs/typescript.ts';
import { regexp } from './configs/regexp.ts';
import { node } from './configs/node.ts';
import { promise } from './configs/promise.ts';
import { jest } from './configs/jest.ts';
import { markdown } from './configs/markdown.ts';
import { json } from './configs/json.ts';
import { packageJson } from './configs/package-json.ts';
import { yml } from './configs/yml.ts';
import { noUseExtendNative } from './configs/no-use-extend-native.ts';
import { unicorn } from './configs/unicorn.ts';
import { react } from './configs/react.ts';
import { vue, parseVue } from './configs/vue.ts';
import { customConfigs } from './configs/custom-configs.ts';

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
				'{tmp,temp,.tmp,.temp,__tmp__,__temp__}/**',
				'**/*.min.js',
				'**/dist/**',
				'**/node_modules/**',
				'**/vendor/**',
				'**/.cache/**',

				// Ignore VitePress cache
				'**/.vitepress',

				// Ignore AI assistant documentation files
				'**/CLAUDE.md',
				'**/CLAUDE.local.md',
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
		...stylistic,
		typescript(tsconfig),
		regexp,
		promise,
		...node({
			...options,
			cwd,
		}),
		...noUseExtendNative,
		...json,
		...packageJson,
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

export default pvtnbr() as Linter.Config[];
export { defineConfig };
export type { Options };
