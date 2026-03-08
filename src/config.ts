import path from 'node:path';
import fs from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { tsImport } from 'tsx/esm/api';

export type LintrollConfig = {
	node?: boolean | string[];
	allowAbbreviations?: string[];
	ignores?: string[];
	rules?: Record<string, 'off' | 'warn' | 'error' | ['off' | 'warn' | 'error', ...unknown[]]>;
};

export const defineConfig = (
	config: LintrollConfig,
): LintrollConfig => config;

const configFileNames = [
	'lintroll.config.ts',
	'lintroll.config.mts',
	'lintroll.config.mjs',
	'lintroll.config.js',
];

type ConfigModule = LintrollConfig | {
	default: ConfigModule;
};

const exists = (
	filePath: string,
) => fs.access(filePath).then(
	() => filePath,
	(): undefined => undefined,
);

export const loadConfig = async (
	cwd: string,
): Promise<LintrollConfig> => {
	let configFilePath: string | undefined;
	for (const fileName of configFileNames) {
		configFilePath = await exists(path.join(cwd, fileName));
		if (configFilePath) {
			break;
		}
	}

	if (!configFilePath) {
		return {};
	}

	let configModule: ConfigModule = await tsImport(
		pathToFileURL(configFilePath).toString(),
		import.meta.url,
	);

	/**
	 * When ESM TypeScript file is loaded in CJS mode, it's double wrapped:
	 * { default: { default: module } }
	 */
	while (
		configModule
		&& typeof configModule === 'object'
		&& 'default' in configModule
		&& configModule.default
	) {
		configModule = configModule.default;
	}

	return (configModule as LintrollConfig) ?? {};
};
