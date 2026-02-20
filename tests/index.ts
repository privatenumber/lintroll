import { describe } from 'manten';

describe('eslint config', async () => {
	await import('./base/index.ts');
	await import('./eslint-comments/index.ts');
	await import('./json/index.ts');
	await import('./package-json/index.ts');
	await import('./typescript/index.ts');
	await import('./markdown/index.ts');
	await import('./vue/index.ts');
	await import('./react/index.ts');
	await import('./node/index.ts');
	await import('./bundle/index.ts');
	await import('./unicorn/index.ts');
	await import('./imports/index.ts');
	await import('./custom-rules/index.ts');
	await import('./cli/index.ts');
});
