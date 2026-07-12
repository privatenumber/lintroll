import { bench, run } from 'mitata';
import { ESLint } from 'eslint';
import { pvtnbr } from '#pvtnbr';

const fast = process.argv.includes('--fast');

bench(`generated config (${fast ? 'fast' : 'full'})`, async () => {
	const eslint = new ESLint({
		baseConfig: pvtnbr({ fast }),
		overrideConfigFile: true,
	});

	await eslint.lintFiles(['.']);
})
	.gc(false);

await run({ throw: true });
