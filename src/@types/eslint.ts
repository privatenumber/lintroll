declare module 'eslint/use-at-your-own-risk' {
	import type { ESLint, Linter } from 'eslint';

	// Defined here: https://github.com/eslint/eslint/blob/54c3ca6f2dcd2a7afd53f42fc32055a25587259e/lib/eslint/flat-eslint.js#L66-L88
	export class FlatESLint extends ESLint {
		constructor(options: {
			cwd?: string;
			baseConfig?: Linter.FlatConfig[];
			overrideConfigFile?: boolean | string;
		});
	}
}