import { ESLint } from 'eslint';
import { pvtnbr } from '#pvtnbr';
import { runOxlint } from '../src/cli/run-oxlint.ts';
import { eslintGapConfig } from './eslint-gap-config.ts';

const files = process.argv.slice(2);

await runOxlint({
	cwd: process.cwd(),
	files,
	quiet: true,
});

const eslint = new ESLint({
	baseConfig: [
		...pvtnbr({ node: true }),
		...eslintGapConfig,
	],
	overrideConfigFile: true,
});
await eslint.lintFiles(files);
