import type { Linter } from 'eslint';

const properties = [
	'files',
	'ignores',
	'languageOptions',
	'linterOptions',
	'plugins',
	'rules',
	'settings',
] as const;

const deepFreeze = <Config extends Linter.Config>(
	config: Config,
) => {
	for (const property of properties) {
		const value = config[property];
		if (typeof value !== 'object' || value === null) {
			continue;
		}

		Object.freeze(value);

		if (property === 'rules') {
			const rules = value as Linter.Config['rules'];
			for (const ruleName in rules) {
				if (Object.hasOwn(rules, ruleName)) {
					const rule = rules[ruleName];
					if (rule) {
						Object.freeze(rule);
					}
				}
			}
		}

		if (property === 'languageOptions') {
			const languageOptions = value as NonNullable<Linter.Config['languageOptions']>;
			if (languageOptions.parserOptions) {
				Object.freeze(languageOptions.parserOptions);
			}
			if (languageOptions.globals) {
				Object.freeze(languageOptions.globals);
			}
		}
	}

	return Object.freeze(config);
};

/**
 * Applies type and seals the config by freezing it to prevent
 * inadvertent mutation of the config
 */
export const defineConfig = <Config extends Linter.Config | Linter.Config[]>(
	config: Config,
) => (
		Array.isArray(config)
			? config.map(deepFreeze)
			: deepFreeze(config)
	) as Config;
