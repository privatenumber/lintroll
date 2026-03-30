import path from 'node:path';

const jsExtensions = new Set([
	'.js', '.jsx', '.mjs', '.cjs',
	'.ts', '.tsx', '.mts', '.cts',
	'.vue',
]);

const dataExtensions = new Set([
	'.json', '.json5', '.jsonc',
	'.yml', '.yaml',
]);

const ignoredSegments = [
	'/dist/', '/node_modules/', '/vendor/',
	'/.cache/', '/.vitepress/',
];

const ignoredBasenames = new Set([
	'package-lock.json', 'pnpm-lock.yaml',
]);

export type CategorizedFiles = {
	js: string[];
	data: string[];
};

export const categorizeFiles = (
	files: string[],
	_extraIgnores?: string[],
): CategorizedFiles => {
	const js: string[] = [];
	const data: string[] = [];

	for (const file of files) {
		if (isIgnored(file)) {
			continue;
		}

		const extension = path.extname(file);
		if (jsExtensions.has(extension)) {
			js.push(file);
		} else if (dataExtensions.has(extension)) {
			data.push(file);
		}
	}

	return { js, data };
};

const isIgnored = (filePath: string) => {
	const basename = path.basename(filePath);
	if (ignoredBasenames.has(basename)) {
		return true;
	}
	if (filePath.endsWith('.min.js')) {
		return true;
	}
	return ignoredSegments.some(
		segment => filePath.includes(segment),
	);
};
