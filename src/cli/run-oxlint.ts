import path from 'node:path';
import { fileURLToPath } from 'node:url';
import spawn, { SubprocessError } from 'nano-spawn';
import type { LintDiagnostic, LintDiagnosticsReport } from './lint-report.ts';

const oxlintPackagePath = fileURLToPath(import.meta.resolve('oxlint/package.json'));
const oxlintBinPath = path.join(path.dirname(oxlintPackagePath), 'bin/oxlint');
const oxlintConfigPath = fileURLToPath(import.meta.resolve('#oxlint-config'));

type OxlintDiagnostic = {
	code?: string;
	filename: string;
	message: string;
	severity: 'error' | 'warning';
};

type OxlintOutput = {
	diagnostics: OxlintDiagnostic[];
	number_of_files: number;
	number_of_rules: number;
};

type RunOxlintOptions = {
	cwd: string;
	files: string[];
	noIgnore?: boolean;
	quiet?: boolean;
};

const runOxlintProcess = (
	args: string[],
	cwd: string,
) => spawn(process.execPath, [
	oxlintBinPath,
	'--config',
	oxlintConfigPath,
	...args,
], { cwd });

const namespaces: Record<string, string> = {
	eslint: '',
	import: 'import-x/',
	node: 'n/',
	typescript: '@typescript-eslint/',
};

const normalizeDiagnostic = (
	diagnostic: OxlintDiagnostic,
): LintDiagnostic => {
	let ruleId: string | undefined;
	if (diagnostic.code) {
		const code = /^([^()]+)\(([^()]+)\)$/u.exec(diagnostic.code);
		if (!code) {
			throw new Error(`Unexpected Oxlint diagnostic code: ${diagnostic.code}`);
		}

		const [, plugin, ruleName] = code;
		if (!plugin || !ruleName) {
			throw new Error(`Unexpected Oxlint diagnostic code: ${diagnostic.code}`);
		}
		ruleId = `${namespaces[plugin] ?? `${plugin}/`}${ruleName}`;
	}

	return {
		filePath: diagnostic.filename.replaceAll('\\', '/'),
		message: diagnostic.message,
		ruleId,
		severity: diagnostic.severity === 'error' ? 2 : 1,
	};
};

const compareDiagnostics = (
	diagnosticA: LintDiagnostic,
	diagnosticB: LintDiagnostic,
) => {
	if (diagnosticA.filePath !== diagnosticB.filePath) {
		return diagnosticA.filePath < diagnosticB.filePath ? -1 : 1;
	}

	if (diagnosticA.ruleId !== diagnosticB.ruleId) {
		return (diagnosticA.ruleId ?? '') < (diagnosticB.ruleId ?? '') ? -1 : 1;
	}

	return diagnosticA.severity - diagnosticB.severity;
};

export const runOxlint = async (
	options: RunOxlintOptions,
): Promise<LintDiagnosticsReport> => {
	const args = ['--format', 'json'];
	if (options.noIgnore) {
		args.push('--no-ignore');
	}
	args.push(...options.files);

	const result = await runOxlintProcess(args, options.cwd)
		.catch((error: SubprocessError) => error);
	if (result instanceof SubprocessError && result.exitCode !== 1) {
		throw new Error(
			`Oxlint failed: ${result.stderr || result.stdout || result.message}`,
			{ cause: result },
		);
	}

	let output: OxlintOutput;
	try {
		output = JSON.parse(result.stdout) as OxlintOutput;
	} catch (error) {
		if (result instanceof SubprocessError) {
			throw new Error(
				`Oxlint failed: ${result.stderr || result.stdout || result.message}`,
				{ cause: result },
			);
		}
		throw new Error('Oxlint returned invalid JSON output', { cause: error });
	}

	const allDiagnostics = output.diagnostics.map(normalizeDiagnostic).sort(compareDiagnostics);
	return {
		diagnostics: options.quiet
			? allDiagnostics.filter(diagnostic => diagnostic.severity === 2)
			: allDiagnostics,
		errorCount: allDiagnostics.filter(diagnostic => diagnostic.severity === 2).length,
		fatalErrorCount: allDiagnostics.filter(diagnostic => (
			diagnostic.severity === 2 && !diagnostic.ruleId
		)).length,
		numberOfFiles: output.number_of_files,
		numberOfRules: output.number_of_rules,
		warningCount: allDiagnostics.filter(diagnostic => diagnostic.severity === 1).length,
	};
};

export const listOxlintFiles = async (
	cwd: string,
	files: string[],
) => {
	const { stdout } = await runOxlintProcess(['--debug', 'files', ...files], cwd);
	return stdout.split('\n').filter(Boolean);
};
