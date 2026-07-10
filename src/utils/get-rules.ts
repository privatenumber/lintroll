import type { Linter } from 'eslint';

/**
 * Flattens the rules from a flat-config array into a single rules record.
 *
 * ota-meshi plugins (eslint-plugin-jsonc, eslint-plugin-yml) now ship their
 * presets as flat-config arrays that spread the rules across multiple entries,
 * instead of legacy config objects with a single `.rules` property.
 */
export const getRules = (
	configs: Linter.Config[],
) => Object.assign(
	{},
	...configs.map(config => config.rules).filter(Boolean),
) as Linter.RulesRecord;
