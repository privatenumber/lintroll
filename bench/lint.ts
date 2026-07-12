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
})
	// Each sample starts a full CLI process. Concurrent samples would contend for CPU and disk.
	.gc(false);

await run({ throw: true });
