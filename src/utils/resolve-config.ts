import type { Linter } from 'eslint';
import { FlatCompat } from '@eslint/eslintrc';

const flatCompat = new FlatCompat();

export const resolveConfig = (
	config: string | Linter.Config,
) => {
	const configs = (
		typeof config === 'string'
			? flatCompat.extends(config)
			: flatCompat.config(config)
	);

	// Extend configs
	// https://github.com/eslint/eslintrc/issues/140
	configs.forEach((currentConfig, index) => {
		if (index > 0) {
			Object.assign(
				currentConfig,
				{
					...configs[index - 1],
					...currentConfig,
				},
			);
		}
	});
	return configs;
};
