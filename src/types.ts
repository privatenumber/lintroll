import type { Linter } from 'eslint';
import type { Options as UnicornOptions } from './configs/unicorn.ts';

export type Options = {
	cwd?: string;
	mode?: 'full' | 'fast';
	node?: boolean | Linter.Config['files'];
} & UnicornOptions;
