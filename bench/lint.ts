import { bench, run } from 'mitata';
import spawn from 'nano-spawn';

bench('lintroll --git', async () => {
	await spawn(process.execPath, [
		'-C',
		'development',
		'./src/cli/index.ts',
		'--git',
	], {
		stdio: 'ignore',
	});
});

await run({ throw: true });
