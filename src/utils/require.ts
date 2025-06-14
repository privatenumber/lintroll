import { createRequire } from 'node:module';
import { findUpSync } from 'find-up-simple';

// Require from the context of the current project
const require = createRequire(`${process.cwd()}/`);

let currentPackageName: string | undefined;
const getCurrentPackageName = () => {
	if (currentPackageName) {
		return currentPackageName;
	}

	const currentPackageJson = findUpSync('package.json');
	if (!currentPackageJson) {
		return;
	}

	try {
		// eslint-disable-next-line import-x/no-dynamic-require
		const packageJson = require(currentPackageJson);
		currentPackageName = packageJson.name;
		return currentPackageName;
	} catch {}
};

export const isInstalled = (specifier: string) => {
	try {
		require.resolve(specifier);
		return true;
	} catch {}

	return getCurrentPackageName() === specifier;
};

export const getExports = (
	moduleName: string,
) => Object.keys(
	// eslint-disable-next-line import-x/no-dynamic-require
	require(moduleName),
);
