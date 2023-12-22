import { testSuite } from 'manten';
import { RuleTester } from '@typescript-eslint/rule-tester';
import { preferArrowFunctions } from '../../src/custom-rules/prefer-arrow-functions.js';

/**
 * function prototype
 * function.length
 * function.name
 */
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
					code: 'const a = () => {}',
				},
				{
					name: 'named export arrow',
					code: 'export const a = () => {}',
				},
				{
					name: 'default export arrow',
					code: 'export default () => {}',
				},

				// Ignores this, arguments, new.target
				{
					name: 'this',
					code: '(function(){this})',
				},
				{
					name: 'nested this',
					code: '(function(){(() => this)})',
				},
				{
					name: 'arguments',
					code: '(function(){arguments})',
				},
				{
					name: 'nested arguments',
					code: '(function(){(() => arguments)})',
				},
				{
					name: 'new.target',
					code: '(function(){new.target})',
				},
				{
					name: 'nested new.target',
					code: '(function(){(() => new.target)})',
				},

				// Object getters & setters
				{
					name: 'object getter',
					code: '({get a(){}})',
				},
				{
					name: 'object setter',
					code: '({set a(b){}})',
				},

				// Class
				{
					name: 'class / constructor',
					code: '(class{constructor(){}})',
				},
				{
					name: 'class / method with super',
					code: '(class{a(){super.a()}})',
				},
				{
					name: 'class / generator',
					code: '(class{*a(){}})',
				},
				{
					name: 'class / generator / async',
					code: '(class{async*a(){}})',
				},
				{
					name: 'class / setter',
					code: '(class{set/**/a(b){}})',
				},
				{
					name: 'class / getter',
					code: '(class{get/**/a(){}})',
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
				{
					name: 'declaration / function with "this" inside',
					code: 'function foo(){(function(){this})}',
					errors: [{
						messageId: 'unexpectedFunctionDeclaration',
					}],
					output: 'const foo=()=>{(function(){this})}',
				},
				{
					name: 'declaration / function with "arguments" inside',
					code: 'function foo(){(function(){arguments})}',
					errors: [{
						messageId: 'unexpectedFunctionDeclaration',
					}],
					output: 'const foo=()=>{(function(){arguments})}',
				},
				{
					name: 'declaration / function with "new.target" inside',
					code: 'function foo(){(function(){new.target})}',
					errors: [{
						messageId: 'unexpectedFunctionDeclaration',
					}],
					output: 'const foo=()=>{(function(){new.target})}',
				},
				{
					name: 'declaration / function with "class super()" inside',
					code: 'function foo(){(class{a(){super()}})}',
					errors: [{
						messageId: 'unexpectedFunctionDeclaration',
					}],
					output: 'const foo=()=>{(class{a(){super()}})}',
				},

				// Function hoisting˚
				{
					name: 'declaration / hoisting / doesnt hoist',
					code: 'function a(){}a()',
					errors: [{
						messageId: 'unexpectedFunctionDeclaration',
					}],
					output: 'const a=()=>{};a()',
				},
				{
					name: 'declaration / hoisting / no whitespace',
					code: 'a();function a(){}',
					errors: [{
						messageId: 'unexpectedFunctionDeclaration',
					}],
					output: 'const a=()=>{};a();',
				},
				{
					name: 'declaration / hoisting / whitespace eof',
					code: 'a();function a(){}\n',
					errors: [{
						messageId: 'unexpectedFunctionDeclaration',
					}],
					output: 'const a=()=>{}\na();',
				},
				{
					name: 'declaration / hoisting / whitespace comment',
					code: 'a();function a(){}\n/**/a',
					errors: [{
						messageId: 'unexpectedFunctionDeclaration',
					}],
					output: 'const a=()=>{}\na();/**/a',
				},
				{
					name: 'declaration / hoisting / preserves scope above function scope',
					code: '(()=>a);a;function a(){}',
					errors: [{
						messageId: 'unexpectedFunctionDeclaration',
					}],
					output: 'const a=()=>{};(()=>a);a;',
				},
				{
					name: 'declaration / hoisting / preserves scope above block scope',
					code: 'if(1){(()=>a)}a;function a(){}',
					errors: [{
						messageId: 'unexpectedFunctionDeclaration',
					}],
					output: 'const a=()=>{};if(1){(()=>a)}a;',
				},
				{
					name: 'declaration / hoisting / preserves scope within block scope',
					code: 'if(1){while(a()){}function a(){}}',
					errors: [{
						messageId: 'unexpectedFunctionDeclaration',
					}],
					output: 'if(1){const a=()=>{};while(a()){}}',
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
				{
					name: 'expression / &&',
					code: `(1 && function(){})`,
					errors: [{
						messageId: 'unexpectedFunctionDeclaration',
					}],
					output: `(1 && (()=>{}))`,
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
				{
					name: 'class',
					code: '(class{a/**/()/**/{}})',
					errors: [{
						messageId: 'unexpectedFunctionDeclaration',
					}],
					output: '(class{a/**/:/**/()=>/**/{}})',
				},
				{
					name: 'class / private method',
					code: '(class{#a/**/()/**/{}})',
					errors: [{
						messageId: 'unexpectedFunctionDeclaration',
					}],
					output: '(class{#a/**/:/**/()=>/**/{}})',
				},
				{
					name: 'class / static method',
					code: '(class{static/**/a/**/()/**/{}})',
					errors: [{
						messageId: 'unexpectedFunctionDeclaration',
					}],
					output: '(class{static/**/a/**/:/**/()=>/**/{}})',
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

				// {
				// 	name: 'nested functions',
				// 	code: '(function(){(function(){})})',
				// 	errors: [{
				// 		messageId: 'unexpectedFunctionDeclaration',
				// 	},{
				// 		messageId: 'unexpectedFunctionDeclaration',
				// 	}],
				// 	output: 'asdf'
				// },
				// {
				// 	name: 'nested functions',
				// 	code: '(function(a = function(){}){})',
				// 	errors: [{
				// 		messageId: 'unexpectedFunctionDeclaration',
				// 	},{
				// 		messageId: 'unexpectedFunctionDeclaration',
				// 	}],
				// 	output: 'asdf'
				// },
			],
		});
	});
});
