import { createRequire } from 'module';

const require = createRequire(import.meta.url);

export const isInstalled = (specifier: string) => {
	try {
		require.resolve(specifier);
		return true;
	} catch {}

	return false;
};
