import { Linter } from 'eslint';

type Options = {
    node?: boolean | Linter.FlatConfig['files'];
    react?: boolean;
    vue?: boolean;
};

interface DefineConfig {
    <Config extends Linter.FlatConfig>(config: Config): Config;
    <Configs extends Linter.FlatConfig[]>(config: Configs): Configs;
}
declare const defineConfig: DefineConfig;

declare const pvtnbr: (options?: Options) => Linter.FlatConfig[];

declare const _default: Linter.FlatConfig[];

export { type Options, _default as default, defineConfig, pvtnbr };
