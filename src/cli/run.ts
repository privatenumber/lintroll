import { getGitRoot, getStagedFiles, getTrackedFiles } from './utils/git.ts';
import { categorizeFiles } from './utils/files.ts';
import { printResults, getExitCode, type ToolResult } from './utils/output.ts';
import { runOxfmt } from './tools/oxfmt.ts';
import { runOxlint } from './tools/oxlint.ts';
import { runEslint } from './tools/eslint.ts';
import { loadConfig } from '../config.ts';

type RunOptions = {
	files: string[];
	fix: boolean;
	quiet: boolean;
	ignorePatterns: string[];
	staged: boolean;
	git: boolean;
	cwd: string;
};

export const run = async (options: RunOptions) => {
	const start = performance.now();
	let { files } = options;

	// Load user config (lintroll.config.ts)
	const config = await loadConfig(options.cwd);

	// Resolve file list from git if needed
	if (options.staged) {
		const gitRoot = await getGitRoot();
		files = await getStagedFiles(gitRoot, files);
	} else if (options.git) {
		const gitRoot = await getGitRoot();
		files = await getTrackedFiles(gitRoot, files);
	} else {
		// Auto-detect git for directory arguments
		try {
			const gitRoot = await getGitRoot();
			files = await getTrackedFiles(gitRoot, files);
		} catch {
			// Not in a git repo — files stay as directory paths
			// Tools handle directory scanning natively
		}
	}

	if (files.length === 0) {
		console.log('No files to lint');
		return;
	}

	// Categorize files by type
	const { js, data } = categorizeFiles(files, config.ignores);

	// Dispatch tools in parallel
	const tasks: Promise<ToolResult>[] = [];

	if (js.length > 0) {
		// oxfmt → oxlint (sequential: format before lint)
		tasks.push((async (): Promise<ToolResult> => {
			const fmtResult = await runOxfmt({
				files: js,
				fix: options.fix,
			});

			const lintResult = await runOxlint({
				files: js,
				fix: options.fix,
				quiet: options.quiet,
				ignorePatterns: options.ignorePatterns,
				cwd: options.cwd,
			});

			return {
				tool: 'oxc',
				passed: fmtResult.passed && lintResult.passed,
				output: [fmtResult.output, lintResult.output]
					.filter(Boolean)
					.join('\n'),
				duration: fmtResult.duration + lintResult.duration,
			};
		})());
	}

	if (data.length > 0) {
		tasks.push(runEslint({
			files: data,
			fix: options.fix,
			quiet: options.quiet,
			cwd: options.cwd,
		}));
	}

	const results = await Promise.all(tasks);

	printResults(results, performance.now() - start);
	process.exitCode = getExitCode(results);
};
