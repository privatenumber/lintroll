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

	if (fix) {
		// In fix mode, format files in place
		try {
			await spawn(oxfmtBin, ['--write', ...files], { cwd });
		} catch (error) {
			const { stderr, stdout } = error as { stderr: string; stdout: string };
			throw new Error(`oxfmt format error:\n${stderr || stdout}`);
		}

		return {
			passed: true,
			unformattedFiles: [],
			duration: performance.now() - start,
		};
	}

	// In check mode, use --list-different for clean file list
	try {
		await spawn(oxfmtBin, ['--list-different', ...files], { cwd });
		// Exit 0 = all files formatted
		return {
			passed: true,
			unformattedFiles: [],
			duration: performance.now() - start,
		};
	} catch (error) {
		const { stdout, stderr, exitCode } = error as { stdout: string; stderr: string; exitCode: number | undefined };
		if (exitCode === 1) {
			// Exit 1 = some files need formatting, stdout has the list
			const unformattedFiles = stdout
				.split('\n')
				.filter(Boolean);
			return {
				passed: false,
				unformattedFiles,
				duration: performance.now() - start,
			};
		}
		throw new Error(`oxfmt error (exit ${exitCode}):\n${stderr || stdout}`);
	}
};
