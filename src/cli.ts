import 'tsx/esm';
import { pathToFileURL } from 'url';
import fs from 'fs/promises';
import { cli } from 'cleye';
import eslintApi from 'eslint/use-at-your-own-risk';
import type { ESLint, Linter } from 'eslint';
import { pvtnbr } from '#pvtnbr';

const exists = async (path: string) => fs.access(path).then(() => path, () => {});

type ConfigModule = { default?: Linter.FlatConfig[] };

const getConfig = async (): Promise<Linter.FlatConfig[]> => {
	/**
	 * Only checks cwd. I considerered find-up,
	 * but I'm not sure if it's expected to detect config files far up
	 * given this is an opinionated CLI command
	 */
	const configFilePath = (
		await exists('eslint.config.ts')
		?? await exists('eslint.config.js')
	);

	if (configFilePath) {
		const configModule: ConfigModule = await import(pathToFileURL(configFilePath).toString());

		if (configModule.default) {
			console.log('[@pvtnbr/eslint-config]: Using config file:', configFilePath);
			return configModule.default;
		}
	}

	return pvtnbr();
};

type ErrorCount = {
	errorCount: number;
	fatalErrorCount: number;
	warningCount: number;
};

const countErrors = (
	results: ESLint.LintResult[],
): ErrorCount => {
	let errorCount = 0;
	let fatalErrorCount = 0;
	let warningCount = 0;

	for (const result of results) {
		errorCount += result.errorCount;
		fatalErrorCount += result.fatalErrorCount;
		warningCount += result.warningCount;
	}

	return {
		errorCount,
		fatalErrorCount,
		warningCount,
	};
};

const argv = cli({
	name: 'lint',
	parameters: ['<files...>'],
	help: {
		description: 'by @pvtnbr/eslint-config',
	},
	flags: {
		fix: {
			type: Boolean,
			description: 'Automatically fix problems',
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
	},
});

const getExitCode = (
	errorCount: ErrorCount,
) => {
	if (errorCount.fatalErrorCount > 0) {
		return 2;
	}

	if (errorCount.errorCount > 0) {
		return 1;
	}

	return 0;
};

(async () => {
	const { FlatESLint } = eslintApi;
	const eslint = new FlatESLint({
		baseConfig: await getConfig(),

		// Don't look up config file
		overrideConfigFile: true,

		fix: argv.flags.fix,
		cache: argv.flags.cache,
		cacheLocation: argv.flags.cacheLocation,
	});

	const results = await eslint.lintFiles(argv._.files);

	if (argv.flags.fix) {
		await FlatESLint.outputFixes(results);
	}

	let resultsToPrint = results;
	if (argv.flags.quiet) {
		resultsToPrint = FlatESLint.getErrorResults(results);
	}

	const resultCounts = countErrors(results);

	const formatter = await eslint.loadFormatter();
	const output = await formatter.format(resultsToPrint);
	if (output) {
		console.log(output);
	}

	process.exitCode = getExitCode(resultCounts);
})();
