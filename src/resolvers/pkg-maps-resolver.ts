import path from 'node:path';
import fs from 'node:fs';
import { findUpSync } from 'find-up-simple';
import { resolveImports } from 'resolve-pkg-maps';
import type { PackageJson } from 'type-fest';
import { getConditions } from 'get-conditions';

const notFound = Object.freeze({ found: false });

const getResolvedPaths = (
	object: PackageJson.Exports,
): string[] => {
	if (!object) {
		return [];
	}
	if (typeof object === 'string') {
		return [object];
	}
	return Object.values(object).flatMap(getResolvedPaths);
};

const tryFallback = (
	imports: PackageJson.Imports,
	source: `#${string}`,
	excludePath?: string,
) => {
	const entryPaths = getResolvedPaths(imports[source])
		.filter(resolvedPath => (
			resolvedPath !== excludePath
				&& !resolvedPath.endsWith('.d.ts')
				&& fs.existsSync(resolvedPath)
		));

	if (entryPaths.length === 0) {
		return notFound;
	}

	return {
		found: true,
		path: entryPaths[0],
	};
};

export const resolve = (
	source: `#${string}`,
	file: string,
) => {
	if (source[0] !== '#') {
		return notFound;
	}

	const packageJsonPath = findUpSync(
		'package.json',
		{ cwd: file },
	);

	if (!packageJsonPath) {
		return notFound;
	}

	const pacakageJsonString = fs.readFileSync(packageJsonPath, 'utf8');
	const { imports } = JSON.parse(pacakageJsonString) as PackageJson;

	if (!imports) {
		return notFound;
	}

	if (!(source in imports)) {
		return notFound;
	}

	const result = resolveImports(
		imports,
		source,
		getConditions(),
	);

	if (!result || result.length === 0) {
		return tryFallback(imports, source);
	}

	const foundPath = result[0];
	const foundPathResolved = path.resolve(packageJsonPath, '..', foundPath);

	if (!fs.existsSync(foundPathResolved)) {
		return tryFallback(imports, source, foundPath);
	}

	return {
		found: true,
		path: foundPath,
	};
};

export const interfaceVersion = 2;
