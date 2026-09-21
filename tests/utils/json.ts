import type { PackageJson, TsConfigJson } from 'type-fest';

/**
 * Fixture JSON files use the repository's formatting (tab indentation and a
 * final newline), so a generated file lints like a hand-written one.
 */
export const createPackageJson = (packageJson: PackageJson) => `${JSON.stringify(packageJson, null, '\t')}\n`;

export const createTsconfigJson = (tsconfigJson: TsConfigJson) => `${JSON.stringify(tsconfigJson, null, '\t')}\n`;
