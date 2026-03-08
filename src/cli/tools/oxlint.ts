import path from 'node:path';
import { fileURLToPath } from 'node:url';
import spawn from 'nano-spawn';
import type { ToolResult } from '../utils/output.ts';

const oxlintBin = path.resolve(
	path.dirname(fileURLToPath(import.meta.resolve('oxlint'))),
	'../bin/oxlint',
);

// Config file ships with lintroll — resolved via import map
const oxlintConfig = fileURLToPath(import.meta.resolve('#oxlint-config'));

type OxlintOptions = {
	files: string[];
	fix: boolean;
	quiet: boolean;
	ignorePatterns: string[];
	cwd: string;
};

export const runOxlint = async ({
	files,
	fix,
	quiet,
	ignorePatterns,
	cwd,
}: OxlintOptions): Promise<ToolResult> => {
	const start = performance.now();
	const arguments_: string[] = [];

	if (fix) {
		arguments_.push('--fix');
	}

	if (quiet) {
		arguments_.push('--quiet');
	}

	for (const pattern of ignorePatterns) {
		arguments_.push('--ignore-pattern', pattern);
	}

	arguments_.push('--config', oxlintConfig, ...files);

	try {
		await spawn(oxlintBin, arguments_, { cwd });
		return {
			tool: 'oxlint',
			passed: true,
			// Suppress "Found 0 warnings and 0 errors" when clean
			output: '',
			duration: performance.now() - start,
		};
	} catch (error) {
		const { stdout, stderr, exitCode } = error as {
			stdout: string;
			stderr: string;
			exitCode: number | undefined;
		};

		// Exit code 2 = config/internal error (not lint findings)
		if (exitCode === 2) {
			throw new Error(`oxlint configuration error:\n${stderr || stdout}`);
		}

		return {
			tool: 'oxlint',
			passed: false,
			output: stdout,
			duration: performance.now() - start,
		};
	}
};
