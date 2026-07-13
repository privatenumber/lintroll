import type { OxlintConfig } from 'oxlint';
import { eslintRules } from './eslint.ts';
import { importRules } from './imports.ts';
import { recommendedRules } from './recommended.ts';
import { vueRules } from './vue.ts';

export const rules = {
	...recommendedRules,
	...eslintRules,
	...vueRules,
	...importRules,
} satisfies NonNullable<OxlintConfig['rules']>;
