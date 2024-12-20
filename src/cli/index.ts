import path from 'node:path';
import { cli } from 'cleye';
import { ESLint } from 'eslint';
import spawn from 'nano-spawn';
import { name } from '../../package.json';
import { getConfig } from './get-config.js';
import { getExitCode, countErrors } from './handle-errors.js';

/**
 * Reference: ESlint CLI
 * https://github.com/eslint/eslint/blob/main/lib/cli.js
 */
const argv = cli({
	name,
	parameters: ['<files...>'],
	help: {
		description: 'Opinionated ESLint by @privatenumber (Hiroki Osame)',
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

(async () => {
	const eslint = new ESLint({
		baseConfig: await getConfig({
			node: isNodeEnabled(argv.flags.node),
			allowAbbreviations: {
				exactWords: argv.flags.allowAbbreviation,
				substrings: argv.flags.allowAbbreviation,
			},
		}),

		// Don't look up config file
		overrideConfigFile: true,

		fix: argv.flags.fix,
		cache: argv.flags.cache,
		cacheLocation: argv.flags.cacheLocation,
		ignorePatterns: argv.flags.ignorePattern,
	});

	let files = argv._.files.map(filePath => path.resolve(filePath));

	if (argv.flags.staged) {
		try {
			const { stdout: gitRoot } = await spawn('git', ['rev-parse', '--show-toplevel']);
			const { stdout: stagedFilesText } = await spawn('git', [
				'diff',
				'--staged',
				'--name-only',
				'--diff-filter=ACMR',
			]);

			const stagedFiles = stagedFilesText
				.split('\n')
				.filter(Boolean)
				.map(filePath => path.resolve(gitRoot, filePath))
				.filter(filePath => files.some(file => filePath.startsWith(file)));

			files = stagedFiles;
		} catch {
			console.error('Error: Failed to detect staged files from git');
			process.exit(1);
		}
	}

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
	if (output) {
		console.log(output);
	}

	process.exitCode = getExitCode(resultCounts);
})();
