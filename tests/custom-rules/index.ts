import { testSuite } from 'manten';

export default testSuite(({ describe }) => {
	describe('custom rules', ({ runTestSuite }) => {
		runTestSuite(import('./prefer-arrow-functions.js'));
		runTestSuite(import('./no-function-hoisting.js'));
	});
});
