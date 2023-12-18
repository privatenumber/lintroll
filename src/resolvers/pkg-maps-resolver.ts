import fs from 'node:fs';
import { findUpSync } from 'find-up-simple';
import { resolveImports } from 'resolve-pkg-maps';
import type { PackageJson } from 'read-package-up';
import { getConditions } from 'get-conditions';

const notfound = Object.freeze({ found: false });

export const resolve = (
	source: string,
	file: string,
) => {
	if (source[0] === '#') {
		const packageJsonPath = findUpSync(
			'package.json',
			{ cwd: file },
		);

		if (!packageJsonPath) {
			return notfound;
		}

		const pacakageJsonString = fs.readFileSync(packageJsonPath, 'utf8');
		const packageJson = JSON.parse(pacakageJsonString) as PackageJson;

		if (!packageJson.imports) {
			return notfound;
		}

		const result = resolveImports(
			packageJson.imports,
			source,
			getConditions(),
		);

		if (!result || result.length === 0) {
			return notfound;
		}

		return {
			found: true,
			path: result[0],
		};
	}

	return notfound;
};

export const interfaceVersion = 2;
