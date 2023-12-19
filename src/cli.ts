import { cli } from 'cleye';
import eslintApi from 'eslint/use-at-your-own-risk';
import pvtnbr from '#pvtnbr';

console.log(pvtnbr);


// const argv = cli({
// 	name: 'lint',
// 	parameters: ['<files...>'],
// 	help: {
// 		description: 'by @pvtnbr/eslint-config',
// 	},
// 	flags: {
// 		fix: Boolean,
// 	},
// });

// (async () => {
// 	console.log(argv);

// 	const eslint = new eslintApi.FlatESLint({
	
// 	});
	
// 	const result = await eslint.lintFiles(argv._.files);
	
// 	console.log(result);
	

// })();