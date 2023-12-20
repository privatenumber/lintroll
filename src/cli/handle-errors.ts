import type { ESLint } from 'eslint';

type ErrorCount = {
	errorCount: number;
	fatalErrorCount: number;
	warningCount: number;
};

export const countErrors = (
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

export const getExitCode = (
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
