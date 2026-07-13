import { ESLint } from 'eslint';
import { pvtnbr } from '#pvtnbr';

const loadGapConfig = () => import('./eslint-gap-config.ts')
	.then(module => module.eslintGapConfig);

const useGaps = process.argv[2] === '--gaps';
const files = process.argv.slice(useGaps ? 3 : 2);
const gapConfig = useGaps
	? await loadGapConfig()
	: [];
const eslint = new ESLint({
	baseConfig: [
		...pvtnbr({ node: true }),
		...gapConfig,
	],
	overrideConfigFile: true,
});

await eslint.lintFiles(files);
