import type { FlatESLintConfig, LanguageOptions } from 'eslint-define-config';

const properties = [
	'files',
	'ignores',
	'languageOptions',
	'linterOptions',
	'plugins',
	'rules',
	'settings',
] as const;

const deepFreeze = <T extends FlatESLintConfig>(config: T) => {
	for (const property of properties) {
		const value = config[property];
		if (!value) {
			continue;
		}

		Object.freeze(value);

		if (property === 'rules') {
			const rules = value as FlatESLintConfig['rules'];
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
			const languageOptions = value as LanguageOptions;
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

export const defineConfig = <T extends FlatESLintConfig>(
	config: T,
) => deepFreeze(config);
