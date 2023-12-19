import { cli } from 'cleye';
import eslintApi from 'eslint/use-at-your-own-risk';
import { pvtnbr } from '#pvtnbr';

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

(async () => {
	const { FlatESLint } = eslintApi;
	const eslint = new FlatESLint({
		fix: argv.flags.fix,
		baseConfig: pvtnbr(),
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

	const formatter = await eslint.loadFormatter();
	const output = await formatter.format(resultsToPrint);
	if (output) {
		console.log(output);
	}
})();
