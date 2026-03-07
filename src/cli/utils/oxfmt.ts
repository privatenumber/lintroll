import path from 'node:path';
import { fileURLToPath } from 'node:url';
import spawn from 'nano-spawn';

const oxfmtBin = path.resolve(
	path.dirname(fileURLToPath(import.meta.resolve('oxfmt'))),
	'../bin/oxfmt',
);

type OxfmtOptions = {
	files: string[];
	fix: boolean;
	cwd: string;
};

export type OxfmtResult = {
	passed: boolean;
	unformattedFiles: string[];
	duration: number;
};

export const runOxfmt = async ({
	files,
	fix,
	cwd,
}: OxfmtOptions): Promise<OxfmtResult> => {
	const start = performance.now();
	const arguments_ = fix ? [...files] : ['--check', ...files];

	try {
		await spawn(oxfmtBin, arguments_, { cwd });
		return {
			passed: true,
			unformattedFiles: [],
			duration: performance.now() - start,
		};
	} catch (error) {
		const { stdout, exitCode } = error as { stdout: string; exitCode: number | undefined };
		if (exitCode === 1) {
			// oxfmt --check exits 1 when files need formatting
			const unformattedFiles = stdout
				.split('\n')
				.filter(Boolean)
				.filter(line => !line.startsWith('Format') && !line.startsWith('Finished'));
			return {
				passed: false,
				unformattedFiles,
				duration: performance.now() - start,
			};
		}
		throw error;
	}
};
