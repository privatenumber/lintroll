import path from 'node:path';
import fs from 'node:fs';
import spawn, { type SubprocessError } from 'nano-spawn';

// Normalize paths to forward slashes for consistent cross-platform comparison
const normalizePath = (filePath: string) => filePath.replaceAll('\\', '/');

export const getGitRoot = async () => {
	try {
		const { stdout: gitRoot } = await spawn('git', ['rev-parse', '--show-toplevel']);
		// Git already returns the real path - just trim whitespace
		return gitRoot.trim();
	} catch (error) {
		const subprocessError = error as SubprocessError;
		if (subprocessError.stderr && subprocessError.stderr.includes('not a git repository')) {
			throw new Error('The current working directory is not a git repository');
		}
		throw error;
	}
};

const filterGitFiles = (
	gitFilesText: string,
	gitRoot: string,
	targetFiles: string[],
) => gitFilesText
	.split('\n')
	.filter(Boolean)
	.map((filePath) => {
		const resolvedPath = path.resolve(gitRoot, filePath);
		// Check if file exists before resolving (file may be deleted but still tracked)
		if (!fs.existsSync(resolvedPath)) {
			return null;
		}
		// Use native realpath to resolve Windows 8.3 short paths (RUNNER~1 -> runneradmin)
		return normalizePath(fs.realpathSync.native(resolvedPath));
	})
	.filter((gitFile): gitFile is string => (
		// Filter out null values (deleted files)
		gitFile !== null
		// Only keep files that are within the target files (e.g. cwd)
		&& targetFiles.some(targetFile => gitFile.startsWith(targetFile))
	));

export const getStagedFiles = async (
	gitRoot: string,
	targetFiles: string[],
) => {
	const { stdout: stagedFilesText } = await spawn('git', [
		'diff',
		'--staged',
		'--name-only',
		'--diff-filter=ACMR',
	]);

	return filterGitFiles(stagedFilesText, gitRoot, targetFiles);
};

export const getTrackedFiles = async (
	gitRoot: string,
	targetFiles: string[],
) => {
	const { stdout: trackedFilesText } = await spawn('git', ['ls-files']);

	return filterGitFiles(trackedFilesText, gitRoot, targetFiles);
};
