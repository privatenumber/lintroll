import { describe } from 'manten';

describe('eslint config', ({ runTestSuite }) => {
	runTestSuite(import('./base'));
	runTestSuite(import('./typescript'));
	runTestSuite(import('./markdown'));
	runTestSuite(import('./vue'));
	runTestSuite(import('./react'));
});
