import type { FlatESLintConfig } from 'eslint-define-config';

const deepFreeze = <T extends object>(
	object: T,
	seenObjects = new Set<object>(),
) => {
	if (seenObjects.has(object)) {
		return object;
	}

	seenObjects.add(object);

	const keys = Reflect.ownKeys(object) as unknown as (keyof T)[];

	for (const key of keys) {
		const value = object[key];
		if (
			(value && typeof value === 'object')
			|| typeof value === 'function'
		) {
			deepFreeze(value, seenObjects);
		}
	}

	return Object.freeze(object);
};

export const defineConfig = <T extends FlatESLintConfig>(
	config: T,
) => deepFreeze(config);
