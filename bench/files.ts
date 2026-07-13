import spawn from 'nano-spawn';
import { listOxlintFiles } from '../src/cli/run-oxlint.ts';

const normalizeFilePath = (
	filePath: string,
) => filePath.replaceAll('\\', '/');

const [trackedFiles, oxlintFiles] = await Promise.all([
	spawn('git', ['ls-files', '--full-name']),
	listOxlintFiles(process.cwd(), ['.']),
]);
const trackedFilePaths = new Set(trackedFiles.stdout.split('\n').map(normalizeFilePath));

export const benchmarkFiles = oxlintFiles
	.map(normalizeFilePath)
	.filter(filePath => trackedFilePaths.has(filePath));
