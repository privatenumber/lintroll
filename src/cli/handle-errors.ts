import type { LintCounts } from './lint-report.ts';

export const getExitCode = (
	report: LintCounts,
) => {
	if (report.fatalErrorCount > 0) {
		return 2;
	}

	if (report.errorCount > 0) {
		return 1;
	}

	return 0;
};
