import { bench, run } from 'mitata';
import spawn from 'nano-spawn';
import { benchmarkFiles } from './files.ts';

const runEslint = (
	args: string[] = [],
) => spawn(process.execPath, [
	'-C',
	'development',
	'bench/eslint.ts',
	...args,
	...benchmarkFiles,
], { stdio: 'ignore' });

const runOxlint = () => spawn(process.execPath, [
	'-C',
	'development',
	'bench/oxlint.ts',
	...benchmarkFiles,
], { stdio: 'ignore' });

const runHybrid = () => spawn(process.execPath, [
	'-C',
	'development',
	'bench/hybrid-runner.ts',
	...benchmarkFiles,
], { stdio: 'ignore' });

bench('ESLint', runEslint).gc(false);
bench('Oxlint', runOxlint).gc(false);
bench('Oxlint + ESLint gaps', runHybrid).gc(false);

await run({ throw: true });
