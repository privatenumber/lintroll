import 'tsx/esm';
import { pathToFileURL } from 'url';
import fs from 'fs/promises';
import type { Linter } from 'eslint';
import type { Options } from '../types.js';
import { pvtnbr } from '#pvtnbr';

const exists = async (
	path: string,
) => fs.access(path).then(() => path, () => {});

type ConfigModule = { default?: Linter.FlatConfig[] };

export const getConfig = async (
	options: Options,
): Promise<Linter.FlatConfig[]> => {
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
		const configModule: ConfigModule = await import(pathToFileURL(configFilePath).toString());

		if (configModule.default) {
			console.log('[@pvtnbr/eslint-config]: Using config file:', configFilePath);
			return configModule.default;
		}
	}

	return pvtnbr(options);
};
