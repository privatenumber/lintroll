/**
 * Combined JS plugin that wraps multiple single-rule plugins.
 *
 * This plugin combines:
 * - eslint-plugin-no-use-extend-native (1 rule)
 * - @eslint-community/eslint-plugin-eslint-comments (4 rules)
 * - ESLint core gap rules (11 rules from builtinRules)
 * - pvtnbr/prefer-arrow-functions (1 rule)
 *
 * Uses createRequire() for lazy loading — these packages are only
 * loaded when the corresponding rule is first accessed.
 */
import { createRequire } from 'node:module';
import type { ESLint, Rule } from 'eslint';
import oxlintPlugin from './oxlint-plugin.ts';
import eslintGapPlugin from './eslint-gap-plugin.ts';

const require = createRequire(import.meta.url);

// === eslint-plugin-no-use-extend-native (lazy) ===
let noUseExtendNativeRules: Record<string, Rule.RuleModule>;
const loadNoUseExtendNative = () => {
	if (!noUseExtendNativeRules) {
		try {
			const plugin = require('eslint-plugin-no-use-extend-native');
			const resolvedPlugin = plugin.default || plugin;
			noUseExtendNativeRules = resolvedPlugin.rules || {};
		} catch {
			noUseExtendNativeRules = {};
		}
	}
	return noUseExtendNativeRules;
};

// === @eslint-community/eslint-plugin-eslint-comments (lazy) ===
let eslintCommentsRules: Record<string, Rule.RuleModule>;
const loadEslintComments = () => {
	if (!eslintCommentsRules) {
		try {
			const plugin = require(
				'@eslint-community/eslint-plugin-eslint-comments',
			);
			eslintCommentsRules = plugin.rules || {};
		} catch {
			eslintCommentsRules = {};
		}
	}
	return eslintCommentsRules;
};

// Build combined rules object with lazy loading
const rules: Record<string, Rule.RuleModule> = {};

// no-use-extend-native
Object.defineProperty(rules, 'no-use-extend-native', {
	get: () => loadNoUseExtendNative()['no-use-extend-native'],
	enumerable: true,
});

// eslint-comments rules
const commentRuleNames = [
	'disable-enable-pair',
	'no-aggregating-enable',
	'no-duplicate-disable',
	'no-unlimited-disable',
	'no-unused-enable',
	'no-use',
	'require-description',
	'no-restricted-disable',
];
for (const name of commentRuleNames) {
	Object.defineProperty(rules, `comments-${name}`, {
		get: () => loadEslintComments()[name],
		enumerable: true,
	});
}

// ESLint core gap rules (from eslint-gap-plugin)
for (const [name, rule] of Object.entries(eslintGapPlugin.rules)) {
	Object.defineProperty(rules, name, {
		get: () => rule,
		enumerable: true,
	});
}

// pvtnbr/prefer-arrow-functions
rules['prefer-arrow-functions'] = oxlintPlugin.rules['prefer-arrow-functions'];

export default {
	meta: {
		name: 'lintroll',
	},
	rules,
} satisfies ESLint.Plugin;
