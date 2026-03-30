import type { DummyRuleMap } from 'oxlint';

/**
 * Node.js rules — loaded via eslint-plugin-n JS plugin (aliased as "n").
 * Matches src/configs/node.ts rules that apply globally.
 */
export const nodeRules: DummyRuleMap = {
	'n/global-require': 'error',
	'n/no-mixed-requires': ['error', {
		allowCall: true,
		grouping: true,
	}],
	'n/no-new-require': 'error',
	'n/no-path-concat': 'error',
	'n/prefer-global/buffer': ['error', 'always'],
	'n/prefer-global/console': ['error', 'always'],
	'n/prefer-global/process': ['error', 'always'],
	'n/prefer-global/text-decoder': ['error', 'always'],
	'n/prefer-global/text-encoder': ['error', 'always'],
	'n/prefer-global/url': ['error', 'always'],
	'n/prefer-global/url-search-params': ['error', 'always'],
	'n/prefer-promises/dns': 'error',
	'n/prefer-promises/fs': 'error',
	'n/no-unsupported-features/node-builtins': 'warn',
	'n/prefer-node-protocol': 'error',
};
