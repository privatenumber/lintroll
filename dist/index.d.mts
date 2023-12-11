import { Linter } from 'eslint';

/**
 * These specific signatures are needed to make sure that the return type is
 * narrowed to the input type.
 */
declare function defineConfig<T extends Linter.FlatConfig>(config: T): T;
declare function defineConfig<T extends Linter.FlatConfig[]>(config: T): T;

type Options = {
    node?: boolean;
};
declare const pvtnbr: (options?: Options) => Linter.FlatConfig[];

export { type Options, defineConfig, pvtnbr };
