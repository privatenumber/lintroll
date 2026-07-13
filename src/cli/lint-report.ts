export type LintCounts = {
	errorCount: number;
	fatalErrorCount: number;
	warningCount: number;
};

export type LintReport = LintCounts & {
	fixedFilePaths: string[];
	output: string;
};

export type LintDiagnostic = {
	filePath: string;
	message: string;
	ruleId?: string;
	severity: 1 | 2;
};

export type LintDiagnosticsReport = LintCounts & {
	diagnostics: LintDiagnostic[];
	numberOfFiles: number;
	numberOfRules: number;
};
