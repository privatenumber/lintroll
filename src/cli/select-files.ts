import path from 'node:path';
import fs from 'node:fs';
import type { ESLint } from 'eslint';
import { getGitRoot, getStagedFiles, getTrackedFiles } from './utils/git.ts';

const normalizePath = (filePath: string) => filePath.replaceAll('\\', '/');

export const resolveTargetFiles = (
	files: string[],
) => (files.length > 0 ? files : ['.'])
	.map(filePath => normalizePath(fs.realpathSync.native(path.resolve(filePath))));

export const selectStagedFiles = async (
	files: string[],
) => getStagedFiles(await getGitRoot(), files);

export const selectGitFiles = async (
	eslint: ESLint,
	files: string[],
) => {
	const gitTrackedFiles = await getTrackedFiles(await getGitRoot(), files);
	const ignoredChecks = await Promise.all(
		gitTrackedFiles.map(async file => ({
			file,
			isIgnored: await eslint.isPathIgnored(file),
		})),
	);

	return ignoredChecks
		.filter(({ isIgnored }) => !isIgnored)
		.map(({ file }) => file);
};
