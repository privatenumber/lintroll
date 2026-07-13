import { runOxlint } from '../src/cli/run-oxlint.ts';

await runOxlint({
	cwd: process.cwd(),
	files: process.argv.slice(2),
	quiet: true,
});
