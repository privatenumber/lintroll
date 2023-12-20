import type { Linter } from 'eslint';

export type Options = {
	node?: boolean | Linter.FlatConfig['files'];
	react?: boolean;
	vue?: boolean;
};
