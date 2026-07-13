import type { Linter } from 'eslint';
import oxlintPlugin from 'eslint-plugin-oxlint';
import { oxlintConfig } from '#oxlint-config';

const { options: _options, ...oxlintOverlapConfig } = oxlintConfig;
const remapRuleId = (
	ruleId: string,
) => (
	ruleId.startsWith('import/') ? `import-x/${ruleId.slice(7)}` : ruleId
);

export const eslintGapConfig = [
	...oxlintPlugin.buildFromOxlintConfig(oxlintOverlapConfig).map((config) => {
		if (!config.rules) {
			return config;
		}

		return {
			...config,
			rules: Object.fromEntries(
				Object.entries(config.rules).map(([ruleId, rule]) => [remapRuleId(ruleId), rule]),
			),
		};
	}),
	{
		linterOptions: {
			reportUnusedDisableDirectives: false,
		},
		rules: {
			'no-implied-eval': 'off',
			'prefer-promise-reject-errors': 'off',
		},
	},
] satisfies Linter.Config[];
