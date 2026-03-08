import type { ToolResult } from '../utils/output.ts';

const lazyESLint = () => import('eslint').then(m => m.ESLint);
const lazyGetNonJsConfig = () => import('../get-non-js-config.ts').then(m => m.getNonJsConfig);

type EslintOptions = {
	files: string[];
	fix: boolean;
	quiet: boolean;
	cwd: string;
};

export const runEslint = async ({
	files,
	fix,
	quiet,
	cwd,
}: EslintOptions): Promise<ToolResult> => {
	const start = performance.now();
	const [ESLint, getNonJsConfig] = await Promise.all([
		lazyESLint(),
		lazyGetNonJsConfig(),
	]);

	const eslint = new ESLint({
		cwd,
		baseConfig: getNonJsConfig(),
		overrideConfigFile: true,
		fix,
	});

	const results = await eslint.lintFiles(files);

	if (fix) {
		await ESLint.outputFixes(results);
	}

	let resultsToPrint = results;
	if (quiet) {
		resultsToPrint = ESLint.getErrorResults(results);
	}

	const formatter = await eslint.loadFormatter();
	const output = await formatter.format(resultsToPrint);
	const hasErrors = results.some(r => r.errorCount > 0);

	return {
		tool: 'eslint',
		passed: !hasErrors,
		output: output || '',
		duration: performance.now() - start,
	};
};
