import type { Linter } from 'eslint';
import type { Options as UnicornOptions } from './configs/unicorn.js';

export type Options = {
	node?: boolean | Linter.FlatConfig['files'];
} & UnicornOptions;
