import type { ESLint } from 'eslint';
import type { FlatESLintConfig, ESLintConfig } from 'eslint-define-config';
import { defineConfig } from './define-config.js';
import { createRequire } from 'module';
// import { FlatCompat } from '@eslint/eslintrc';

// const compat = new FlatCompat();

export const resolvePluginConfig = (
	plugin: ESLint.Plugin,
	configName: string,
	pluginSpecifier?: string,
) => {
	if (!plugin.configs) {
		console.log(plugin);
		throw new Error('Plugin does not have any configs');
	}

	const config = plugin.configs[configName] as ESLintConfig;
	console.log(config);

	const resolvedConfig: FlatESLintConfig = {};

	if (config.rules) {
		resolvedConfig.rules = config.rules;
	}

	if (config.overrides) {

	}

	if (config.settings) {
		resolvedConfig.settings = config.settings;
	}

	if (config.parserOptions) {
		resolvedConfig.languageOptions = {
			parserOptions: config.parserOptions,
		};
	}

	if (config.plugins) {
		resolvedConfig.plugins = {};

		for (const pluginName of config.plugins) {
			resolvedConfig.plugins[pluginName] = require('eslint-plugin-' + pluginName);
		}
	}

	if (config.extends) {
		const requireExtends = (
			pluginSpecifier
				? createRequire(require.resolve(pluginSpecifier))
				: require
		);

		if (Array.isArray(config.extends)) {
			console.log('SHIT', config.extends);
			const resolvedConfigs = config.extends.map((configName) => {
				if (
					configName.startsWith('./')
					&& !pluginSpecifier
				) {
					throw new Error('Relative path found. Plugin specifier must be provided');
				}

				return requireExtends(configName);
			});

			console.log(44444, resolvedConfigs);

		} else {
			// const configs = [];
			// let currentConfig = config;

			// while (currentConfig.extends) {
			// 	// Assuming string here
			// 	const resolved = requireExtends(currentConfig.extends);
			// 	configs.unshift(resolved);
			// 	currentConfig = resolved;
			// }

			// console.log('resolved configs', configs);
		}
	}

	return defineConfig(resolvedConfig);
};
