declare module 'eslint/use-at-your-own-risk' {
	import type { ESLint, Linter } from 'eslint';

	// Defined here: https://github.com/eslint/eslint/blob/54c3ca6f2dcd2a7afd53f42fc32055a25587259e/lib/eslint/flat-eslint.js#L66-L88
	type FlatESLintOptions = {
		allowInlineConfig?: boolean;
		baseConfig?: Linter.Config[];
		cache?: boolean;
		cacheLocation?: string;
		cacheStrategy?: 'metadata' | 'content';
		cwd?: string;
		errorOnUnmatchedPattern?: boolean;
		fix?: boolean | ((filePath: string) => boolean);
		fixTypes?: string[];
		globInputPaths?: boolean;
		ignore?: boolean;
		ignorePatterns?: string[];
		overrideConfig?: Linter.Config[];
		overrideConfigFile?: boolean | string;
		plugins?: Record<string, Plugin>;
		reportUnusedDisableDirectives?: 'error' | 'warn' | 'off';
		warnIgnored?: boolean;
	};

	export class FlatESLint extends ESLint {
		constructor(options: FlatESLintOptions);
	}
}
