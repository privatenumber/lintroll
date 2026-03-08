import type { Linter } from 'eslint';
import stylisticPlugin from '@stylistic/eslint-plugin';
import { defineConfig } from '../utils/define-config.ts';
import { json } from '../configs/json.ts';
import { packageJson } from '../configs/package-json.ts';
import { yml } from '../configs/yml.ts';

/**
 * Slim ESLint config for non-JS files only.
 *
 * Used in hybrid mode where oxfmt + oxlint handle JS/TS files,
 * and ESLint only needs to lint JSON, YAML, and Vue templates.
 *
 * Note: Markdown code block linting is excluded because it requires
 * the full ESLint config (JS/TS rules for extracted code blocks).
 * Use --eslint-only mode for full Markdown support.
 */
export const getNonJsConfig = (): Linter.Config[] => [
	defineConfig({
		ignores: [
			'**/package-lock.json',
			'**/pnpm-lock.yaml',
			'{tmp,temp,.tmp,.temp,__tmp__,__temp__}/**',
			'**/dist/**',
			'**/node_modules/**',
			'**/vendor/**',
			'**/.cache/**',
			'**/.vitepress',
		],
	}),
	defineConfig({
		linterOptions: {
			reportUnusedDisableDirectives: true,
		},
	}),

	// Register @stylistic plugin (needed by json.ts config)
	defineConfig({
		plugins: {
			'@stylistic': stylisticPlugin,
		},
	}),

	...json,
	...packageJson,
	yml,
];
