import { ESLint } from 'eslint';
import type { LintReport } from './lint-report.ts';

type RunEslintOptions = {
	fix?: boolean;
	quiet?: boolean;
};

export const runEslint = async (
	eslint: ESLint,
	files: string[],
	options: RunEslintOptions,
): Promise<LintReport> => {
	const results = await eslint.lintFiles(files);

	if (options.fix) {
		await ESLint.outputFixes(results);
	}

	let errorCount = 0;
	let fatalErrorCount = 0;
	let warningCount = 0;
	for (const result of results) {
		errorCount += result.errorCount;
		fatalErrorCount += result.fatalErrorCount;
		warningCount += result.warningCount;
	}

	const formatter = await eslint.loadFormatter();
	const resultsToPrint = options.quiet ? ESLint.getErrorResults(results) : results;

	return {
		errorCount,
		fatalErrorCount,
		warningCount,
		fixedFilePaths: options.fix
			? results.filter(result => result.output !== undefined).map(result => result.filePath)
			: [],
		output: await formatter.format(resultsToPrint),
	};
};
