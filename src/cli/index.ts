import 'tsx/esm';
import { cli } from 'cleye';
import eslintApi from 'eslint/use-at-your-own-risk';
import { getConfig } from './get-config.js';
import { getExitCode, countErrors } from './handle-errors.js';

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
		node: {
			type: [String],
			description: 'Enable Node.js rules. Pass in a glob to specify files',
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
	const { FlatESLint } = eslintApi;

	const eslint = new FlatESLint({
		baseConfig: await getConfig({
			node: isNodeEnabled(argv.flags.node),
		}),

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
