import path from 'node:path';
import fs from 'node:fs';
import { cli } from 'cleye';
import { ESLint } from 'eslint';
import packageJson from '../../package.json' with { type: 'json' };
import { getEslintConfig } from './get-config.ts';
import { getExitCode } from './handle-errors.ts';
import { runEslint } from './run-eslint.ts';
import {
	resolveTargetFiles,
	selectGitFiles,
	selectStagedFiles,
} from './select-files.ts';

/**
 * Reference: ESlint CLI
 * https://github.com/eslint/eslint/blob/main/lib/cli.js
 */
const argv = cli({
	name: packageJson.name,
	parameters: ['[files...]'],
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
	let files = resolveTargetFiles(argv._.files);

	if (argv.flags.staged) {
		files = await selectStagedFiles(files);

		if (files.length === 0) {
			process.exitCode = 0;
			return;
		}
	}

	// Use native realpath for cwd to handle Windows 8.3 short paths (RUNNER~1 -> runneradmin)
	// This ensures ESLint's base path matches the canonicalized file paths
	const cwd = fs.realpathSync.native(process.cwd());
	const { config, configFilePath } = await getEslintConfig({
		cwd,
		node: isNodeEnabled(argv.flags.node),
		allowAbbreviations: {
			exactWords: argv.flags.allowAbbreviation,
			substrings: argv.flags.allowAbbreviation,
		},
	});
	if (configFilePath) {
		console.log(`[${packageJson.name}]: Using config file: ${configFilePath}`);
	}

	const eslint = new ESLint({
		cwd,
		baseConfig: config,

		// Don't look up config file
		overrideConfigFile: true,

		fix: argv.flags.fix,
		cache: argv.flags.cache,
		cacheLocation: argv.flags.cacheLocation,
		ignorePatterns: argv.flags.ignorePattern,
	});

	if (argv.flags.git) {
		files = await selectGitFiles(eslint, files);

		if (files.length === 0) {
			console.log('No git-tracked files to lint');
			return;
		}

		console.log(`Linting ${files.length} git-tracked ${files.length === 1 ? 'file' : 'files'}...\n`);
	}

	const report = await runEslint(eslint, files, {
		fix: argv.flags.fix,
		quiet: argv.flags.quiet,
	});

	if (report.fixedFilePaths.length > 0) {
		const relativePaths = report.fixedFilePaths.map(filePath => path.relative(cwd, filePath));
		console.log(`Applied auto-fixes to ${report.fixedFilePaths.length} ${report.fixedFilePaths.length === 1 ? 'file' : 'files'}:`);
		for (const filePath of relativePaths) {
			console.log(`  ${filePath}`);
		}
		console.log();
	}

	if (report.output) {
		console.log(report.output);
	}

	process.exitCode = getExitCode(report);
})().catch((error) => {
	console.error(`Error: ${(error as Error).message}`);
	process.exit(1);
});
