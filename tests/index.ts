import { describe } from 'manten';

describe('eslint config', ({ runTestSuite }) => {
	runTestSuite(import('./base/index.js'));
	runTestSuite(import('./eslint-comments/index.js'));
	runTestSuite(import('./json/index.js'));
	runTestSuite(import('./typescript/index.js'));
	runTestSuite(import('./markdown/index.js'));
	runTestSuite(import('./vue/index.js'));
	runTestSuite(import('./react/index.js'));
	runTestSuite(import('./node/index.js'));
	runTestSuite(import('./bundle/index.js'));
	runTestSuite(import('./custom-rules/index.js'));
	runTestSuite(import('./cli/index.js'));
});
