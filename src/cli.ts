// import 'tsx/esm';
import { cli } from 'cleye';
import eslintApi from 'eslint/use-at-your-own-risk';
import { findUp } from 'find-up-simple';
import type { Linter } from 'eslint';
import { pvtnbr } from '#pvtnbr';

const getConfig = async (): Promise<Linter.FlatConfig[]> => {
	const configFilePath = (
		await findUp('eslint.config.ts')
		?? await findUp('eslint.config.js')
	);

	if (configFilePath) {
		const configModule: { default?: Linter.FlatConfig[] } = await import(configFilePath);

		if (configModule.default) {
			return configModule.default;
		}
	}

	return pvtnbr();
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

	const formatter = await eslint.loadFormatter();
	const output = await formatter.format(resultsToPrint);
	if (output) {
		console.log(output);
	}
})();
