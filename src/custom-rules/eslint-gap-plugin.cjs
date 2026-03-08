/**
 * Wrapper plugin for ESLint core rules not available natively in oxlint.
 *
 * These rules are extracted from ESLint's builtinRules and exposed as
 * an oxlint JS plugin under the "eslint-gap" namespace.
 *
 * Usage in .oxlintrc.json:
 *   "jsPlugins": ["./src/custom-rules/eslint-gap-plugin.cjs"]
 *   "rules": { "eslint-gap/camelcase": ["error", ...] }
 */

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
];

// Lazily load rules from ESLint's internal builtinRules
let loadedRules;

const loadRules = () => {
	if (loadedRules) {
		return loadedRules;
	}

	try {
		// eslint/use-at-your-own-risk exports builtinRules Map
		const { builtinRules } = require('eslint/use-at-your-own-risk'); // eslint-disable-line n/global-require
		loadedRules = {};
		for (const name of ruleNames) {
			const rule = builtinRules.get(name);
			if (rule) {
				loadedRules[name] = rule;
			}
		}
	} catch {
		// If ESLint is not available, return empty rules
		loadedRules = {};
	}

	return loadedRules;
};

// Build rules object with lazy getters
const rules = {};
for (const name of ruleNames) {
	Object.defineProperty(rules, name, {
		get: () => loadRules()[name],
		enumerable: true,
	});
}

module.exports = {
	meta: {
		name: 'eslint-gap',
	},
	rules,
};
