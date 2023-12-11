import { createRequire } from 'module';

const require = createRequire(import.meta.url);

export const isInstalled = (specifier: string) => {
	try {
		require.resolve(specifier);
		return true;
	} catch {}

	return false;
};

export const getExports = (
	moduleName: string,
) => Object.keys(
	// eslint-disable-next-line import/no-dynamic-require
	require(moduleName),
);
