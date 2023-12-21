import { testSuite } from 'manten';
import { RuleTester } from '@typescript-eslint/rule-tester'
import { preferArrowFunctions } from '../../src/custom-rules/prefer-arrow-functions.js';

export default testSuite(({ describe  }) => {
	describe('prefer-arrow-functions', ({ describe, test }) => {
		RuleTester.describe = describe;
		RuleTester.it = test;
		RuleTester.afterAll = () => {};
		const ruleTester = new RuleTester({
			parser: '@typescript-eslint/parser',
		});

		ruleTester.run('prefer-arrow-functions', preferArrowFunctions, {
			valid: [
				{
					name: 'arrow function expression',
					code: '(() => {})',
				},
				{
					name: 'async arrow function expression',
					code: '(async () => {})',
				},
				{
					name: 'assigned arrow function',
					code: 'const foo = () => {}',
				},
				{
					name: 'generator function',
					code: 'function* foo() {}',
				},
				{
					name: 'async generator function',
					code: 'async function* foo() {}',
				},
			],
		
			invalid: [

				// Function declaration
				{
					name: 'declaration / empty parameters',
					code: 'function foo(\n\n) {\n}',
					errors: [{
						messageId: 'unexpectedFunctionDeclaration',
					}],
					output: 'const foo=(\n\n)=> {\n}',
				},
				{
					name: 'declaration / empty parameters - no spaces after "function"',
					code: 'function/*a*/foo/*b*/(\n\n)/*c*/{\n}',
					errors: [{
						messageId: 'unexpectedFunctionDeclaration',
					}],
					output: 'const/*a*/foo=/*b*/(\n\n)=>/*c*/{\n}',
				},
				{
					name: 'declaration / async',
					code: 'async/*a*/function/*b*/foo/*c*/(/*d*/\na\n/*e*/)/*f*/{\n}',
					errors: [{
						messageId: 'unexpectedFunctionDeclaration',
					}],
					output: 'const/*b*/foo=async/*a*//*c*/(/*d*/\na\n/*e*/)=>/*f*/{\n}',
				},

				// Function expression
				{
					name: 'expression / named / async',
					code: '(async /*a*/ function /*b*/ a /*c*/ (/*d*/\na\n/*e*/) /*f*/ {\n})',
					errors: [{
						messageId: 'unexpectedFunctionDeclaration',
					}],
					output: '(async /*a*/  /*b*/  /*c*/ (/*d*/\na\n/*e*/)=> /*f*/ {\n})',
				},
				{
					name: 'expression / anonymous / async',
					code: '(async /*a*/ function /*b*/  /*c*/ (/*d*/\na\n/*e*/) /*f*/ {\n})',
					errors: [{
						messageId: 'unexpectedFunctionDeclaration',
					}],
					output: '(async /*a*/  /*b*/  /*c*/ (/*d*/\na\n/*e*/)=> /*f*/ {\n})',
				},

				// Exports
				{
					name: 'named export / declaration ',
					code: 'export function a(b) {}',
					errors: [{
						messageId: 'unexpectedFunctionDeclaration',
					}],
					output: 'export const a=(b)=> {}',
				},
				{
					name: 'named export / declaration / async',
					code: 'export async function a(b) {}',
					errors: [{
						messageId: 'unexpectedFunctionDeclaration',
					}],
					output: 'export const a=async (b)=> {}',
				},
				{
					name: 'default export / declaration ',
					code: 'export default/*a*/function/*b*/a/*c*/(b)/*d*/{}',
					errors: [{
						messageId: 'unexpectedFunctionDeclaration',
					}],
					output: 'export default/*a*//*b*//*c*/(b)=>/*d*/{}',
				},

				// TypeScript
				{
					name: 'ts / declaration',
					code: 'async/*a*/function/*b*/foo/*c*/<b extends string>/*d*/(a:b)/*e*/:/*f*/void/*\ng*/{}',
					errors: [{
						messageId: 'unexpectedFunctionDeclaration',
					}],
					output: 'const/*b*/foo=async/*a*//*c*/<b extends string>/*d*/(a:b)/*e*/:/*f*/void=>/*\ng*/{}',
				},
				{
					name: 'ts / expression / named',
					code: '(async/*a*/function/*b*/foo/*c*/<b extends string>/*d*/(a:b)/*e*/:/*f*/void/*\ng*/{})',
					errors: [{
						messageId: 'unexpectedFunctionDeclaration',
					}],
					output: '(async/*a*//*b*//*c*/<b extends string>/*d*/(a:b)/*e*/:/*f*/void=>/*\ng*/{})',
				},
				{
					name: 'ts / expression / anonymous',
					code: '(async/*a*/function/*b*//*c*/<b extends string>/*d*/(a:b)/*e*/:/*f*/void/*\ng*/{})',
					errors: [{
						messageId: 'unexpectedFunctionDeclaration',
					}],
					output: '(async/*a*//*b*//*c*/<b extends string>/*d*/(a:b)/*e*/:/*f*/void=>/*\ng*/{})',
				},
			],
		});
	});
});
