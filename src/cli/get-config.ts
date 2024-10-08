import { pathToFileURL } from 'node:url';
import fs from 'node:fs/promises';
import { tsImport } from 'tsx/esm/api';
import type { Linter } from 'eslint';
import type { Options } from '../types.js';
import { name } from '../../package.json';
import { pvtnbr } from '#pvtnbr';

const exists = async (
	path: string,
) => fs.access(path).then(() => path, () => {});

type ConfigModule = { default?: Linter.Config[] };

export const getConfig = async (
	options: Options,
): Promise<Linter.Config[]> => {
	/**
	 * Only checks cwd. I considerered find-up,
	 * but I'm not sure if it's expected to detect config files far up
	 * given this is an opinionated CLI command
	 */
	const configFilePath = (
		await exists('eslint.config.ts')
		?? await exists('eslint.config.js')
	);

	if (configFilePath) {
		const configModule: ConfigModule = await tsImport(
			pathToFileURL(configFilePath).toString(),
			import.meta.url,
		);

		if (configModule.default) {
			console.log(`[${name}]: Using config file: ${configFilePath}`);
			return configModule.default;
		}
	}

	return pvtnbr(options);
};
