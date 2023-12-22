import { testSuite } from 'manten';
import { RuleTester } from '@typescript-eslint/rule-tester';
import { noFunctionHoisting } from '../../src/custom-rules/no-function-hoisting/index.js';

export default testSuite(({ describe }) => {
	describe('no-function-hoisting', ({ describe, test }) => {
		RuleTester.describe = describe;
		RuleTester.it = test;
		RuleTester.afterAll = () => {};
		const ruleTester = new RuleTester({
			parser: '@typescript-eslint/parser',
		});

		ruleTester.run('no-function-hoisting', noFunctionHoisting, {
			valid: [
				{
					name: 'no hoisting',
					code: 'function a(){}a()',
				},
			],

			invalid: [
				{
					name: 'reverse hoisting',
					code: 'a();function a(){}',
					errors: [{
						messageId: 'noFunctionHoisting',
					}],
					output: 'function a(){}a();',
				},
				{
					name: 'reverse hoisting / preserve scope / top-level',
					code: '(function(){a()});function a(){}',
					errors: [{
						messageId: 'noFunctionHoisting',
					}],
					output: 'function a(){}(function(){a()});',
				},
				{
					name: 'reverse hoisting / preserve scope / nested',
					code: '(function(){a();function a(){}})',
					errors: [{
						messageId: 'noFunctionHoisting',
					}],
					output: '(function(){function a(){}a();})',
				},
				{
					name: 'reverse hoisting / preserve scope / nested',
					code: 'while(a()){}function a(){}',
					errors: [{
						messageId: 'noFunctionHoisting',
					}],
					output: 'function a(){}while(a()){}',
				},
				{
					name: 'reverse hoisting / preserve scope / nested',
					code: '(a());function a(){}',
					errors: [{
						messageId: 'noFunctionHoisting',
					}],
					output: 'function a(){}(a());',
				},
				{
					name: 'reverse hoisting / preserve scope / nested',
					code: 'export{a}\nfunction a(){}',
					errors: [{
						messageId: 'noFunctionHoisting',
					}],
					output: 'function a(){}export{a}\n',
				},
			],
		});
	});
});
