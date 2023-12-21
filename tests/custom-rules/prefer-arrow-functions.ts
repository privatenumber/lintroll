import { testSuite } from 'manten';
import { RuleTester } from '@typescript-eslint/rule-tester';
import { preferArrowFunctions } from '../../src/custom-rules/prefer-arrow-functions.js';

export default testSuite(({ describe }) => {
	describe('prefer-arrow-functions', ({ describe, test }) => {
		RuleTester.describe = describe;
		RuleTester.it = test;
		RuleTester.afterAll = () => {};
		const ruleTester = new RuleTester({
			parser: '@typescript-eslint/parser',
		});

		ruleTester.run('prefer-arrow-functions', preferArrowFunctions, {
			valid: [
				// Ignores arrow functions
				{
					name: 'arrow',
					code: '(() => {})',
				},
				{
					name: 'async arrow',
					code: '(async () => {})',
				},
				{
					name: 'assigned arrow',
					code: 'const foo = () => {}',
				},
				{
					name: 'named export arrow',
					code: 'export const foo = () => {}',
				},
				{
					name: 'default export arrow',
					code: 'export default () => {}',
				},

				// Ignores this & arguments
				{
					name: 'this',
					code: '(function(){return this})',
				},
				{
					name: 'arguments',
					code: '(function(){return arguments})',
				},

				// Object getters & setters
				{
					name: 'object getter',
					code: '({get foo(){}})',
				},
				{
					name: 'object setter',
					code: '({set foo(){}})',
				},

				// Ignores generators
				{
					name: 'generator',
					code: 'function* foo() {}',
				},
				{
					name: 'async generator',
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

				// Object property
				{
					name: 'object property / value',
					code: '({a:/**/function/**/()/**/{}})',
					errors: [{
						messageId: 'unexpectedFunctionDeclaration',
					}],
					output: '({a:/**//**/()=>/**/{}})',
				},
				{
					name: 'object property / method',
					code: '({a(b){}})',
					errors: [{
						messageId: 'unexpectedFunctionDeclaration',
					}],
					output: '({a:(b)=>{}})',
				},
				{
					name: 'object property / method',
					code: '({["a"](b){}})',
					errors: [{
						messageId: 'unexpectedFunctionDeclaration',
					}],
					output: '({["a"]:(b)=>{}})',
				},

				// Class
				// {
				// 	name: 'class',
				// 	code: 'class {a:/**/function/**/()/**/{}}',
				// 	errors: [{
				// 		messageId: 'unexpectedFunctionDeclaration',
				// 	}],
				// 	output: '({a:/**//**/()=>/**/{}})',
				// },

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
