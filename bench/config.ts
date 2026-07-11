import { bench, run } from 'mitata';
import { ESLint } from 'eslint';
import { pvtnbr } from '#pvtnbr';

const mode = process.env.LINTROLL_MODE === 'fast' ? 'fast' : 'full';

bench(`generated config (${mode})`, async () => {
	const eslint = new ESLint({
		baseConfig: pvtnbr({ mode }),
		overrideConfigFile: true,
	});

	await eslint.lintFiles(['.']);
})
	.gc(false);

await run({ throw: true });
