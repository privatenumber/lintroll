import path from 'node:path';
import fs from 'node:fs';
import { cli } from 'cleye';
import { ESLint } from 'eslint';
import packageJson from '../../package.json' with { type: 'json' };
import { getConfig } from './get-config.ts';
import { getExitCode, countErrors } from './handle-errors.ts';
import { getGitRoot, getStagedFiles, getTrackedFiles } from './utils/git.ts';
import { runOxfmt } from './utils/oxfmt.ts';
import { runOxlint } from './utils/oxlint.ts';

/**
 * Reference: ESlint CLI
 * https://github.com/eslint/eslint/blob/main/lib/cli.js
 */
const argv = cli({
	name: packageJson.name,
	parameters: ['[files...]'],
	help: {
		description: 'Opinionated linter by @privatenumber (Hiroki Osame)',
	},
	flags: {
		fix: {
			type: Boolean,
			description: 'Automatically fix problems',
		},
		staged: {
			type: Boolean,
			description: 'Only lint staged files within the files passed in',
		},
		git: {
			type: Boolean,
			description: 'Only lint git tracked files within the files passed in',
		},
		quiet: {
			type: Boolean,
			description: 'Report errors only',
		},
		cache: {
			type: Boolean,
			description: 'Only check changed files',
		},
		cacheLocation: {
			type: String,
			description: 'Path to the cache file or directory',
		},
		ignorePattern: {
			type: [String],
			description: 'Pattern of files to ignore',
		},
		node: {
			type: [String],
			description: 'Enable Node.js rules. Pass in a glob to specify files',
		},
		allowAbbreviation: {
			type: [String],
			description: 'Allow abbreviations',
		},
		eslintOnly: {
			type: Boolean,
			description: 'Use ESLint only (skip oxfmt and oxlint)',
		},
	},
});

const isNodeEnabled = (
	flag: string[],
) => {
	if (flag.length === 0) {
		return false;
	}

	const globs = flag.filter(glob => glob.length > 0);
	return (globs.length > 0) ? globs : true;
};

// Normalize paths to forward slashes for consistent cross-platform comparison
const normalizePath = (filePath: string) => filePath.replaceAll('\\', '/');

// File extensions that need ESLint (oxlint can't handle these)
const eslintOnlyExtensions = new Set([
	'.json',
	'.json5',
	'.jsonc',
	'.yml',
	'.yaml',
	'.md',
]);

// File extensions that oxlint handles natively
const oxlintExtensions = new Set([
	'.js',
	'.jsx',
	'.mjs',
	'.cjs',
	'.ts',
	'.tsx',
	'.mts',
	'.cts',
	'.vue',
]);

const categorizeFiles = (files: string[]) => {
	const oxlintFiles: string[] = [];
	const eslintOnlyFiles: string[] = [];

	for (const file of files) {
		const extension = path.extname(file);
		if (eslintOnlyExtensions.has(extension)) {
			eslintOnlyFiles.push(file);
		} else if (oxlintExtensions.has(extension)) {
			oxlintFiles.push(file);
		}
	}

	return { oxlintFiles, eslintOnlyFiles };
};

(async () => {
	const totalStart = performance.now();
	let { files } = argv._;
	if (files.length === 0) {
		files = ['.'];
	}

	// Use native realpath to resolve Windows 8.3 short paths (RUNNER~1 -> runneradmin)
	files = files.map(filePath => normalizePath(fs.realpathSync.native(path.resolve(filePath))));

	// For --staged flag, we directly pass the staged files to ESLint
	// This is because staged files are already a specific list that we want to lint
	if (argv.flags.staged) {
		const gitRoot = await getGitRoot();
		files = await getStagedFiles(gitRoot, files);

		if (files.length === 0) {
			process.exitCode = 0;
			return;
		}
	}

	// Use native realpath for cwd to handle Windows 8.3 short paths (RUNNER~1 -> runneradmin)
	// This ensures ESLint's base path matches the canonicalized file paths
	const cwd = fs.realpathSync.native(process.cwd());

	// For --git flag, get tracked files
	if (argv.flags.git) {
		const gitRoot = await getGitRoot();
		files = await getTrackedFiles(gitRoot, files);

		if (files.length === 0) {
			console.log('No git-tracked files to lint');
			return;
		}
	}

	// Legacy ESLint-only mode
	if (argv.flags.eslintOnly) {
		await runEslintOnly(cwd, files);
		return;
	}

	// New hybrid mode: oxfmt + oxlint + ESLint (for non-JS files)
	// oxfmt and oxlint run sequentially (lint formatted code)
	// ESLint runs in parallel (independent file set)
	let hasErrors = false;
	const timings: Record<string, number> = {};

	// Categorize files
	const { oxlintFiles, eslintOnlyFiles } = categorizeFiles(files);
	const hasFileList = argv.flags.git || argv.flags.staged;

	if (hasFileList) {
		console.log(`Found ${files.length} files: ${oxlintFiles.length} JS/TS, ${eslintOnlyFiles.length} JSON/YAML/MD\n`);
	}

	// Run oxfmt → oxlint (sequential) in parallel with ESLint (independent)
	const oxcPipeline = async () => {
		// Step 1: oxfmt (format check or fix)
		if (oxlintFiles.length > 0 || !hasFileList) {
			const fmtTargets = hasFileList ? oxlintFiles : files;
			const fmtResult = await runOxfmt({
				files: fmtTargets,
				fix: argv.flags.fix ?? false,
				cwd,
			});
			timings.oxfmt = fmtResult.duration;

			if (!fmtResult.passed && !argv.flags.fix) {
				console.log(`oxfmt: ${fmtResult.unformattedFiles.length} files need formatting`);
				for (const file of fmtResult.unformattedFiles.slice(0, 10)) {
					console.log(`  ${file}`);
				}
				if (fmtResult.unformattedFiles.length > 10) {
					console.log(`  ... and ${fmtResult.unformattedFiles.length - 10} more`);
				}
				console.log('  Run with --fix to auto-format\n');
				hasErrors = true;
			}
		}

		// Step 2: oxlint (lint JS/TS files)
		if (oxlintFiles.length > 0 || !hasFileList) {
			const lintTargets = hasFileList ? oxlintFiles : files;
			const oxlintResult = await runOxlint({
				files: lintTargets,
				fix: argv.flags.fix ?? false,
				quiet: argv.flags.quiet ?? false,
				cwd,
			});
			timings.oxlint = oxlintResult.duration;

			if (oxlintResult.output) {
				console.log(oxlintResult.output);
			}

			if (!oxlintResult.passed) {
				hasErrors = true;
			}
		}
	};

	// ESLint pipeline for non-JS files (runs in parallel)
	const eslintPipeline = async () => {
		if (eslintOnlyFiles.length === 0) {
			return;
		}

		const eslintResult = await runEslintForNonJs(cwd, eslintOnlyFiles);
		timings.eslint = eslintResult.duration;

		if (eslintResult.output) {
			console.log(eslintResult.output);
		}

		if (!eslintResult.passed) {
			hasErrors = true;
		}
	};

	await Promise.all([oxcPipeline(), eslintPipeline()]);

	// Print timing summary
	const totalDuration = performance.now() - totalStart;
	const parts = Object.entries(timings)
		.map(([tool, duration]) => `${tool}: ${Math.round(duration)}ms`)
		.join(', ');
	console.log(`\nCompleted in ${Math.round(totalDuration)}ms (${parts})`);

	process.exitCode = hasErrors ? 1 : 0;
})().catch((error) => {
	console.error(`Error: ${(error as Error).message}`);
	process.exit(1);
});

/**
 * ESLint-only mode (legacy, full config)
 */
const runEslintOnly = async (cwd: string, files: string[]) => {
	const eslint = new ESLint({
		cwd,
		baseConfig: await getConfig({
			cwd,
			node: isNodeEnabled(argv.flags.node),
			allowAbbreviations: {
				exactWords: argv.flags.allowAbbreviation,
				substrings: argv.flags.allowAbbreviation,
			},
		}),
		overrideConfigFile: true,
		fix: argv.flags.fix,
		cache: argv.flags.cache,
		cacheLocation: argv.flags.cacheLocation,
		ignorePatterns: argv.flags.ignorePattern,
	});

	if (argv.flags.git) {
		const gitRoot = await getGitRoot();
		const gitTrackedFiles = await getTrackedFiles(gitRoot, files);
		const ignoredChecks = await Promise.all(
			gitTrackedFiles.map(async file => ({
				file,
				isIgnored: await eslint.isPathIgnored(file),
			})),
		);
		files = ignoredChecks
			.filter(({ isIgnored }) => !isIgnored)
			.map(({ file }) => file);

		if (files.length === 0) {
			console.log('No git-tracked files to lint');
			return;
		}

		console.log(`Linting ${files.length} git-tracked ${files.length === 1 ? 'file' : 'files'}...\n`);
	}

	const results = await eslint.lintFiles(files);

	if (argv.flags.fix) {
		await ESLint.outputFixes(results);
		const fixedFiles = results.filter(result => result.output);
		if (fixedFiles.length > 0) {
			const relativePaths = fixedFiles.map(result => path.relative(cwd, result.filePath));
			console.log(`Applied auto-fixes to ${fixedFiles.length} ${fixedFiles.length === 1 ? 'file' : 'files'}:`);
			for (const filePath of relativePaths) {
				console.log(`  ${filePath}`);
			}
			console.log();
		}
	}

	let resultsToPrint = results;
	if (argv.flags.quiet) {
		resultsToPrint = ESLint.getErrorResults(results);
	}

	const resultCounts = countErrors(results);
	const formatter = await eslint.loadFormatter();
	const output = await formatter.format(resultsToPrint);
	if (output) {
		console.log(output);
	}

	process.exitCode = getExitCode(resultCounts);
};

/**
 * Slim ESLint for non-JS files only (JSON, YAML, Markdown)
 */
const runEslintForNonJs = async (cwd: string, files: string[]) => {
	const start = performance.now();

	const eslint = new ESLint({
		cwd,
		baseConfig: await getConfig({
			cwd,
			node: isNodeEnabled(argv.flags.node),
			allowAbbreviations: {
				exactWords: argv.flags.allowAbbreviation,
				substrings: argv.flags.allowAbbreviation,
			},
		}),
		overrideConfigFile: true,
		fix: argv.flags.fix,
		cache: argv.flags.cache,
		cacheLocation: argv.flags.cacheLocation,
		ignorePatterns: argv.flags.ignorePattern,
	});

	const results = await eslint.lintFiles(files);

	if (argv.flags.fix) {
		await ESLint.outputFixes(results);
	}

	let resultsToPrint = results;
	if (argv.flags.quiet) {
		resultsToPrint = ESLint.getErrorResults(results);
	}

	const resultCounts = countErrors(results);
	const formatter = await eslint.loadFormatter();
	const output = await formatter.format(resultsToPrint);

	return {
		passed: resultCounts.errorCount === 0,
		output: output || '',
		duration: performance.now() - start,
	};
};
