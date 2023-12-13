import { Linter } from 'eslint';

type Options = {
    node?: boolean;
    react?: boolean;
    vue?: boolean;
};

/**
 * These specific signatures are needed to make sure that the return type is
 * narrowed to the input type.
 */
declare function defineConfig<T extends Linter.FlatConfig>(config: T): T;
declare function defineConfig<T extends Linter.FlatConfig[]>(config: T): T;

declare const pvtnbr: (options?: Options) => Linter.FlatConfig[];

export { type Options, defineConfig, pvtnbr };
