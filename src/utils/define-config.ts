import type { FlatESLintConfig } from 'eslint-define-config';

export const defineConfig = <T extends FlatESLintConfig>(config: T) => Object.freeze(config);
