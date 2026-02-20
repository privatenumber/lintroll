import { describe } from 'manten';

describe('custom rules', async () => {
	await import('./prefer-arrow-functions.ts');
	await import('./no-function-hoisting.ts');
});
