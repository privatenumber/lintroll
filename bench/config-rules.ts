import { ESLint } from 'eslint';
import { pvtnbr } from '#pvtnbr';

const fast = process.argv.includes('--fast');
const eslint = new ESLint({
	baseConfig: pvtnbr({ fast }),
	overrideConfigFile: true,
	stats: true,
});
const ruleTimes = new Map<string, number>();

for (const result of await eslint.lintFiles(['.'])) {
	for (const pass of result.stats?.times.passes ?? []) {
		for (const [name, time] of Object.entries(pass.rules ?? {})) {
			ruleTimes.set(name, (ruleTimes.get(name) ?? 0) + time.total);
		}
	}
}

const output = [...ruleTimes]
	.sort(([, left], [, right]) => right - left)
	.map(([name, time]) => ({
		name,
		time,
	}));

console.log(JSON.stringify(output, null, 2));
