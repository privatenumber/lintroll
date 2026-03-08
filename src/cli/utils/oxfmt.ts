import fs from 'node:fs/promises';

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

export type OxfmtResult = {
	passed: boolean;
	unformattedFiles: string[];
	fixedFiles: string[];
	duration: number;
};

export const runOxfmt = async ({
	files,
	fix,
}: OxfmtOptions): Promise<OxfmtResult> => {
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

	return {
		passed: unformattedFiles.length === 0,
		unformattedFiles,
		fixedFiles,
		duration: performance.now() - start,
	};
};
