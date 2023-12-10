import { FlatCompat } from '@eslint/eslintrc';

const flatCompat = new FlatCompat();

export const resolveConfig = (configName: string) => {
	const configs = flatCompat.extends(configName);

	// Extend configs
	// https://github.com/eslint/eslintrc/issues/140
	configs.forEach((config, index) => {
		if (index > 0) {
			Object.assign(
				config,
				{
					...configs[index - 1],
					...config,
				},
			);
		}
	});
	return configs;
};
