/**
 * Combined JS plugin that wraps multiple single-rule plugins.
 *
 * Loading each ESLint plugin separately via oxlint's JS plugin system has
 * ~100ms overhead per plugin (module resolution + loading). By combining
 * small plugins into one, we reduce the number of plugin loads.
 *
 * This plugin combines:
 * - eslint-plugin-no-use-extend-native (1 rule)
 * - @eslint-community/eslint-plugin-eslint-comments (4 rules)
 * - ESLint core gap rules (11 rules from builtinRules)
 * - pvtnbr/prefer-arrow-functions (1 rule)
 */

// === eslint-plugin-no-use-extend-native ===
let noUseExtendNativeRules;
const loadNoUseExtendNative = () => {
	if (!noUseExtendNativeRules) {
		try {
			const plugin = require('eslint-plugin-no-use-extend-native');
			const mod = plugin.default || plugin;
			noUseExtendNativeRules = mod.rules || {};
		} catch {
			noUseExtendNativeRules = {};
		}
	}
	return noUseExtendNativeRules;
};

// === @eslint-community/eslint-plugin-eslint-comments ===
let eslintCommentsRules;
const loadEslintComments = () => {
	if (!eslintCommentsRules) {
		try {
			const plugin = require('@eslint-community/eslint-plugin-eslint-comments');
			eslintCommentsRules = plugin.rules || {};
		} catch {
			eslintCommentsRules = {};
		}
	}
	return eslintCommentsRules;
};

// === ESLint core gap rules ===
const gapRuleNames = [
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

let gapRules;
const loadGapRules = () => {
	if (!gapRules) {
		try {
			const { builtinRules } = require('eslint/use-at-your-own-risk');
			gapRules = {};
			for (const name of gapRuleNames) {
				const rule = builtinRules.get(name);
				if (rule) {
					gapRules[name] = rule;
				}
			}
		} catch {
			gapRules = {};
		}
	}
	return gapRules;
};

// === pvtnbr/prefer-arrow-functions ===
const preferArrowFunctions = require('./oxlint-plugin.cjs').rules['prefer-arrow-functions'];

// Build combined rules object with lazy loading
const rules = {};

// no-use-extend-native rules (prefixed)
Object.defineProperty(rules, 'no-use-extend-native', {
	get: () => loadNoUseExtendNative()['no-use-extend-native'],
	enumerable: true,
});

// eslint-comments rules
for (const name of ['disable-enable-pair', 'no-aggregating-enable', 'no-duplicate-disable', 'no-unlimited-disable', 'no-unused-enable', 'no-use', 'require-description', 'no-restricted-disable']) {
	Object.defineProperty(rules, `comments-${name}`, {
		get: () => loadEslintComments()[name],
		enumerable: true,
	});
}

// ESLint core gap rules
for (const name of gapRuleNames) {
	Object.defineProperty(rules, name, {
		get: () => loadGapRules()[name],
		enumerable: true,
	});
}

// pvtnbr rules
rules['prefer-arrow-functions'] = preferArrowFunctions;

module.exports = {
	meta: {
		name: 'lintroll',
	},
	rules,
};
