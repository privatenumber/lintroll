import path from 'node:path';
import { fileURLToPath } from 'node:url';
import spawn from 'nano-spawn';

const oxlintBin = path.resolve(
	path.dirname(fileURLToPath(import.meta.resolve('oxlint'))),
	'../bin/oxlint',
);

type OxlintOptions = {
	files: string[];
	fix: boolean;
	quiet: boolean;
	cwd: string;
};

export type OxlintResult = {
	passed: boolean;
	output: string;
	exitCode: number;
	duration: number;
};

export const runOxlint = async ({
	files,
	fix,
	quiet,
	cwd,
}: OxlintOptions): Promise<OxlintResult> => {
	const start = performance.now();
	const arguments_: string[] = [];

	if (fix) {
		arguments_.push('--fix');
	}

	if (quiet) {
		arguments_.push('--quiet');
	}

	arguments_.push(...files);

	try {
		const { stdout } = await spawn(oxlintBin, arguments_, { cwd });
		return {
			passed: true,
			output: stdout,
			exitCode: 0,
			duration: performance.now() - start,
		};
	} catch (error) {
		const { stdout, stderr, exitCode } = error as { stdout: string; stderr: string; exitCode: number | undefined };

		// Exit code 2 = config/internal error (not lint findings)
		if (exitCode === 2) {
			throw new Error(`oxlint configuration error:\n${stderr || stdout}`);
		}

		return {
			passed: false,
			output: stdout,
			exitCode: exitCode ?? 1,
			duration: performance.now() - start,
		};
	}
};
