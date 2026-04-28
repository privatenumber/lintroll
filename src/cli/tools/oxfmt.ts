import fs from 'node:fs/promises';
import type { ToolResult } from '../utils/output.ts';

// Lazy-load oxfmt to avoid startup cost when not needed
const lazyFormat = () => import('oxfmt').then(m => m.format);

// Formatting options matching lintroll's style
const formatOptions = {
	printWidth: 100,
	tabWidth: 1,
	useTabs: true,
	semi: true,
	singleQuote: true,
	jsxSingleQuote: false,
	trailingComma: 'all',
	bracketSpacing: true,
	bracketSameLine: false,
	arrowParens: 'avoid',
	endOfLine: 'lf',
	quoteProps: 'as-needed',
	singleAttributePerLine: false,
} as const;

type OxfmtOptions = {
	files: string[];
	fix: boolean;
};

export const runOxfmt = async ({
	files,
	fix,
}: OxfmtOptions): Promise<ToolResult> => {
	const start = performance.now();
	const format = await lazyFormat();

	const unformattedFiles: string[] = [];
	const fixedFiles: string[] = [];

	await Promise.all(files.map(async (file) => {
		const source = await fs.readFile(file, 'utf8');
		const result = await format(file, source, formatOptions);

		if (result.code === source) {
			return;
		}

		if (fix) {
			await fs.writeFile(file, result.code);
			fixedFiles.push(file);
		} else {
			unformattedFiles.push(file);
		}
	}));

	let output = '';
	if (fix && fixedFiles.length > 0) {
		output = `oxfmt: fixed ${String(fixedFiles.length)} file${fixedFiles.length === 1 ? '' : 's'}`;
	} else if (unformattedFiles.length > 0) {
		output = [
			'The following files are not formatted:',
			...unformattedFiles.map(f => `  ${f}`),
		].join('\n');
	}

	return {
		tool: 'oxfmt',
		passed: unformattedFiles.length === 0,
		output,
		duration: performance.now() - start,
	};
};
