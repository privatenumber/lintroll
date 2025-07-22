import type { Linter } from 'eslint';
import type { Options as UnicornOptions } from './configs/unicorn.js';

export type Options = {
	cwd?: string;
	node?: boolean | Linter.Config['files'];
} & UnicornOptions;
