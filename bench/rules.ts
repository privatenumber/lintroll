import spawn from 'nano-spawn';

await spawn(process.execPath, [
	'-C',
	'development',
	'./src/cli/index.ts',
	'--git',
], {
	env: { TIMING: 'all' },
	stdio: 'inherit',
});
