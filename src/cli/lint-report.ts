export type LintCounts = {
	errorCount: number;
	fatalErrorCount: number;
	warningCount: number;
};

export type LintReport = LintCounts & {
	fixedFilePaths: string[];
	output: string;
};
