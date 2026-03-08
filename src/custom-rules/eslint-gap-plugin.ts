/**
 * Wrapper plugin for ESLint core rules not available natively in oxlint.
 *
 * These rules are extracted from ESLint's builtinRules and exposed as
 * an oxlint JS plugin. Lazy-loaded to avoid importing ESLint at module init.
 */
import type { ESLint, Rule } from 'eslint';

const ruleNames = [
	'camelcase',
	'no-implicit-globals',
	'no-octal-escape',
	'no-restricted-exports',
	'no-restricted-properties',
	'no-undef-init',
	'no-unreachable-loop',
	'object-shorthand',
	'one-var',
	'prefer-arrow-callback',
	'prefer-regex-literals',
] as const;

let loadedRules: Record<string, Rule.RuleModule>;

const loadRules = () => {
	if (loadedRules) {
		return loadedRules;
	}

	try {
		// eslint-disable-next-line n/no-unpublished-import -- bundled by pkgroll
		const { builtinRules } = require('eslint/use-at-your-own-risk') as {
			builtinRules: Map<string, Rule.RuleModule>;
		};
		loadedRules = {};
		for (const name of ruleNames) {
			const rule = builtinRules.get(name);
			if (rule) {
				loadedRules[name] = rule;
			}
		}
	} catch {
		loadedRules = {};
	}

	return loadedRules;
};

const rules: Record<string, Rule.RuleModule> = {};
for (const name of ruleNames) {
	Object.defineProperty(rules, name, {
		get: () => loadRules()[name],
		enumerable: true,
	});
}

export default {
	meta: {
		name: 'eslint-gap',
	},
	rules,
} satisfies ESLint.Plugin;
