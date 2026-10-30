import { describe, test, onTestFail } from 'manten';
import { RuleTester } from '@typescript-eslint/rule-tester';
import { RuleTester as EslintRuleTester, type Rule } from 'eslint';
import { preferArrowFunctions } from '../../src/custom-rules/prefer-arrow-functions/index.ts';

describe('prefer-arrow-functions', () => {
	RuleTester.describe = describe;
	RuleTester.it = (name, testFunction) => {
		test(name, async () => {
			onTestFail((error) => {
				console.dir(error, {
					colors: true,
					depth: null,
					maxArrayLength: null,
				});
			});
			return await testFunction();
		});
	};
	RuleTester.afterAll = () => {};
	const ruleTester = new RuleTester();

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
			{
				name: 'recursive expression',
				code: '(function foo(){foo()})',
			},
			{
				name: 'recursive expression with block',
				code: '(function foo(){{foo()}})',
			},
			{
				name: 'recursive expression with function block',
				code: '(function foo(){(() => foo())()})',
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

			// Prototype setting
			{
				name: 'prototype / declaration',
				code: 'function a(){}a.prototype={}',
			},
			{
				name: 'prototype / expression',
				code: 'const a = function(){};a.prototype={}',
			},
			{
				name: 'function name / declaration',
				code: 'function a(){}a.name',
			},
			{
				name: 'function name / expression',
				code: 'const a = function(){};a.name',
			},
			{
				name: 'function name / expression / inside',
				code: '(function a(){ return a.name })',
			},
			{
				name: 'function length',
				code: 'function a(){}a.length',
			},
			{
				name: 'function length / expression',
				code: 'const a = function(){};a.length',
			},

			// Ignores generators
			{
				name: 'generator',
				code: 'function* a() {}',
			},
			{
				name: 'async generator',
				code: 'async function* a() {}',
			},

			{
				name: 'hoisting',
				code: 'a();function a(){}',
			},

			// Class methods are opt-in
			{
				name: 'class / method / default',
				code: '(class{ a(){} })',
			},
			{
				name: 'class / method / overload',
				code: '(class{ a(b: string): void; a(b: any){} })',
				options: [{ classMethods: true }],
			},
			{
				name: 'class / method / overload with string key',
				code: '(class{ \'a\'(b: string): void; a(b: any){} })',
				options: [{ classMethods: true }],
			},
			{
				name: 'class / method / overload with computed string key',
				code: '(class{ [\'a\'](b: string): void; a(b: any){} })',
				options: [{ classMethods: true }],
			},
			{
				name: 'class / method / static overload',
				code: '(class{ static a(b: string): void; static a(b: any){} })',
				options: [{ classMethods: true }],
			},
			{
				name: 'ts / overloads in namespace',
				code: 'namespace N { function a(b: string): void;function a(b: any){} }',
			},
			{
				name: 'ts / default exported overloads',
				code: 'export default function a(b: string): void;export default function a(b: any){}',
			},
			{
				name: 'ts / function and namespace merge',
				code: 'function a(){}namespace a { export const b = 1 }',
			},
			{
				name: 'class / method / decorator',
				code: '(class{ @b a(){} })',
				options: [{ classMethods: true }],
			},
			{
				name: 'class / method / parameter decorator',
				code: 'class A { a(@b c){} }',
				options: [{ classMethods: true }],
			},

			// Constructors
			{
				name: 'constructor / new declaration',
				code: 'function A(){}new A()',
			},
			{
				name: 'constructor / new expression',
				code: 'const A = function(){};new A()',
			},
			{
				name: 'constructor / inline new',
				code: 'new function(){}',
			},
			{
				name: 'constructor / instanceof',
				code: 'function A(){}a instanceof A',
			},
			{
				name: 'constructor / extends',
				code: 'function A(){}class B extends A {}',
			},
			{
				name: 'prototype / computed',
				code: 'function a(){}a["prototype"]={}',
			},

			// Declarations that cannot become `const`
			{
				name: 'declaration / reassigned',
				code: 'function a(){}a=1',
			},
			{
				name: 'declaration / duplicate',
				code: 'function a(){}function a(){}',
			},
			{
				name: 'declaration / var redeclaration',
				code: 'var a;function a(){}',
			},
			{
				name: 'declaration / if body',
				code: 'if (b) function a(){}',
			},
			{
				name: 'declaration / labeled',
				code: 'b: function a(){}',
			},
			{
				name: 'ts / overloads',
				code: 'function a(b: string): void;function a(b: any){}',
			},
			{
				name: 'ts / exported overloads',
				code: 'export function a(b: string): void;export function a(b: any){}',
			},
			{
				name: 'ts / this parameter',
				code: 'function a(this: Window){}',
			},
			{
				name: 'ts / assertion function',
				code: 'function a(b: unknown): asserts b {}',
			},
			{
				name: 'ts / assertion function with type',
				code: 'function a(b: unknown): asserts b is string {}',
			},
			{
				name: 'ts / assertion method',
				code: '(class{ a(b: unknown): asserts b {} })',
				options: [{ classMethods: true }],
			},
			{
				name: 'ts / never return type',
				code: 'function a(): never { throw new Error() }',
			},
			{
				name: 'ts / never return type / expression',
				code: 'const a = function(): never { throw new Error() }',
			},
			{
				name: 'this / class computed key refers to outer function',
				code: 'function a(){return class{[this.b] = 1}}',
			},
			{
				name: 'this / class heritage refers to outer function',
				code: 'function a(){return class extends this.b {}}',
			},
			{
				name: 'hoisting / value reference before type reference',
				code: 'a();type B = typeof a;function a(){}',
			},
		],

		invalid: [
			// Function declaration
			{
				name: 'declaration / empty parameters',
				code: 'function foo/*b*/(/*c*/)/*d*/{}',
				errors: [{
					messageId: 'preferArrowFunction',
				}],
				output: 'const foo= /*b*/(/*c*/)=>/*d*/{}',
			},
			{
				name: 'declaration / empty parameters - no spaces after "function"',
				code: 'function/*a*/foo/*b*/(\n\n)/*c*/{\n}',
				errors: [{
					messageId: 'preferArrowFunction',
				}],
				output: 'const foo=/*a*//*b*/(\n\n)=>/*c*/{\n}',
			},
			{
				name: 'declaration / async',
				code: 'async/*a*/function/*b*/foo/*c*/(/*d*/\na\n/*e*/)/*f*/{\n}',
				errors: [{
					messageId: 'preferArrowFunction',
				}],
				output: 'const foo=async/*a*//*b*//*c*/(/*d*/\na\n/*e*/)=>/*f*/{\n}',
			},
			{
				name: 'declaration / function with "this" inside',
				code: 'function foo(){(function(){this})}',
				errors: [{
					messageId: 'preferArrowFunction',
				}],
				output: 'const foo= ()=>{(function(){this})}',
			},
			{
				name: 'declaration / function with "arguments" inside',
				code: 'function foo(){(function(){arguments})}',
				errors: [{
					messageId: 'preferArrowFunction',
				}],
				output: 'const foo= ()=>{(function(){arguments})}',
			},
			{
				name: 'declaration / function with "new.target" inside',
				code: 'function foo(){(function(){new.target})}',
				errors: [{
					messageId: 'preferArrowFunction',
				}],
				output: 'const foo= ()=>{(function(){new.target})}',
			},
			{
				name: 'declaration / function with "class super()" inside',
				code: 'function foo(){(class{a(){super()}})}',
				errors: [{
					messageId: 'preferArrowFunction',
				}],
				output: 'const foo= ()=>{(class{a(){super()}})}',
			},
			{
				name: 'declaration / inserts semicolon',
				code: 'function a(){}a()',
				errors: [{
					messageId: 'preferArrowFunction',
				}],
				output: 'const a= ()=>{};a()',
			},
			{
				name: 'declaration / inserts semicolon / same line',
				code: 'function a(){} a()',
				errors: [{
					messageId: 'preferArrowFunction',
				}],
				output: 'const a= ()=>{}; a()',
			},
			{
				name: 'declaration / inserts semicolon / next line starts with (',
				code: 'function a(){}\n(b)',
				errors: [{
					messageId: 'preferArrowFunction',
				}],
				output: 'const a= ()=>{};\n(b)',
			},
			{
				name: 'declaration / inserts semicolon / next line starts with [',
				code: 'function a(){}\n[b]',
				errors: [{
					messageId: 'preferArrowFunction',
				}],
				output: 'const a= ()=>{};\n[b]',
			},
			{
				name: 'declaration / no semicolon / next line',
				code: 'function a(){}\nb()',
				errors: [{
					messageId: 'preferArrowFunction',
				}],
				output: 'const a= ()=>{}\nb()',
			},
			{
				name: 'declaration / no semicolon / end of block',
				code: '{function a(){}}',
				errors: [{
					messageId: 'preferArrowFunction',
				}],
				output: '{const a= ()=>{}}',
			},
			{
				name: 'declaration / switch case',
				code: 'switch (b) { case 1: function a(){} }',
				errors: [{
					messageId: 'preferArrowFunction',
				}],
				output: 'switch (b) { case 1: const a= ()=>{} }',
			},
			{
				name: 'recursive declaration',
				code: 'function a(){a()}',
				errors: [{
					messageId: 'preferArrowFunction',
				}],
				output: 'const a= ()=>{a()}',
			},
			{
				name: 'declaration / type-only reference before declaration',
				code: 'type B = typeof a;function a(){}',
				errors: [{
					messageId: 'preferArrowFunction',
				}],
				output: 'type B = typeof a;const a= ()=>{}',
			},
			{
				name: 'declaration / "this" in nested class field',
				code: 'function a(){return class{b = this}}',
				errors: [{
					messageId: 'preferArrowFunction',
				}],
				output: 'const a= ()=>{return class{b = this}}',
			},
			{
				name: 'declaration / "this" in nested static block',
				code: 'function a(){return class{static{this}}}',
				errors: [{
					messageId: 'preferArrowFunction',
				}],
				output: 'const a= ()=>{return class{static{this}}}',
			},

			// Function expression
			{
				name: 'expression / named',
				code: '(function a() {})',
				errors: [
					{ messageId: 'preferArrowFunction' },
				],
				output: '( ()=> {})',
			},
			{
				name: 'expression / named / comment',
				code: '(function /*a*/ a() {})',
				errors: [
					{ messageId: 'preferArrowFunction' },
				],
				output: '( /*a*/ ()=> {})',
			},
			{
				name: 'expression / named / line comment',
				code: '(function\n//a\na() {})',
				errors: [
					{ messageId: 'preferArrowFunction' },
				],
				output: '(\n//a\n()=> {})',
			},
			{
				name: 'expression / named / async',

				// The parser doesn't catch this but note the position of comment f
				// JS doesn't allow multiline comments before the =>, but allows it after
				code: '(async /*a*/ function /*b*/ a /*c*/ (/*d*/\na\n/*e*/) /*f*/ {\n})',
				errors: [{
					messageId: 'preferArrowFunction',
				}],
				output: '(async /*a*/  /*b*/  /*c*/ (/*d*/\na\n/*e*/)=> /*f*/ {\n})',
			},
			{
				name: 'expression / anonymous / async',
				code: '(async /*a*/ function /*b*/  /*c*/ (/*d*/\na\n/*e*/) /*f*/ {\n})',
				errors: [{
					messageId: 'preferArrowFunction',
				}],
				output: '(async /*a*/  /*b*/  /*c*/ (/*d*/\na\n/*e*/)=> /*f*/ {\n})',
			},
			{
				name: 'expression / &&',
				code: '(1 && function(){})',
				errors: [{
					messageId: 'preferArrowFunction',
				}],
				output: '(1 && (()=>{}))',
			},
			{
				name: 'expression / && / shoudnt double wrap',
				code: '(1 && (function(){}))',
				errors: [{
					messageId: 'preferArrowFunction',
				}],
				output: '(1 && (()=>{}))',
			},
			{
				name: 'expression / unary operand',
				code: '!function(){}()',
				errors: [{
					messageId: 'preferArrowFunction',
				}],
				output: '!(()=>{})()',
			},
			{
				name: 'expression / member object',
				code: 'a(function(){}.bind(null))',
				errors: [{
					messageId: 'preferArrowFunction',
				}],
				output: 'a((()=>{}).bind(null))',
			},
			{
				name: 'expression / binary operand',
				code: 'a = function(){} + 1',
				errors: [{
					messageId: 'preferArrowFunction',
				}],
				output: 'a = (()=>{}) + 1',
			},
			{
				name: 'expression / await operand',
				code: 'async () => await function(){}',
				errors: [{
					messageId: 'preferArrowFunction',
				}],
				output: 'async () => await (()=>{})',
			},
			{
				name: 'expression / ts as expression',
				code: 'a = function(){} as b',
				errors: [{
					messageId: 'preferArrowFunction',
				}],
				output: 'a = (()=>{}) as b',
			},
			{
				name: 'expression / conditional test',
				code: 'a = function(){} ? 1 : 2',
				errors: [{
					messageId: 'preferArrowFunction',
				}],
				output: 'a = (()=>{}) ? 1 : 2',
			},
			{
				name: 'expression / no wrap / assignment contexts',
				code: 'a = [function(){}, b ? function(){} : c, ...function(){}]',
				errors: [
					{ messageId: 'preferArrowFunction' },
					{ messageId: 'preferArrowFunction' },
					{ messageId: 'preferArrowFunction' },
				],
				output: 'a = [()=>{}, b ? ()=>{} : c, ...()=>{}]',
			},
			{
				name: 'expression / no wrap / call argument',
				code: 'a(function(){})',
				errors: [{
					messageId: 'preferArrowFunction',
				}],
				output: 'a(()=>{})',
			},
			{
				name: 'expression / nested',
				code: '(function(){(function(){})})',
				errors: [{
					messageId: 'preferArrowFunction',
				}, {
					messageId: 'preferArrowFunction',
				}],
				output: '(()=>{(()=>{})})',
			},
			{
				name: 'expression / nested default parameter',
				code: '(function (b = (function (){})){})',
				errors: [
					{
						messageId: 'preferArrowFunction',
					},
					{
						messageId: 'preferArrowFunction',
					},
				],
				output: [
					'( (b = (function (){}))=>{})',
					'( (b = ( ()=>{}))=>{})',
				],
			},

			// Object property
			{
				name: 'object property / value',
				code: '({ a:/*a*/function/*b*/()/*c*/{} })',
				errors: [{
					messageId: 'preferArrowFunction',
				}],
				output: '({ a:/*a*//*b*/()=>/*c*/{} })',
			},
			{
				name: 'object property / method',
				code: '({ /*a*/a/*b*/(b)/*c*/{} })',
				errors: [{
					messageId: 'preferArrowFunction',
				}],
				output: '({ /*a*/a/*b*/:(b)=>/*c*/{} })',
			},
			{
				name: 'object property / async method',
				code: '({ async/*a*/a/*b*/(b)/*c*/{} })',
				errors: [{
					messageId: 'preferArrowFunction',
				}],
				output: '({ /*a*/a/*b*/:async(b)=>/*c*/{} })',
			},
			{
				name: 'object property / async method / removes space',
				code: '({ async /*a*/a/*b*/(b)/*c*/{} })',
				errors: [{
					messageId: 'preferArrowFunction',
				}],
				output: '({ /*a*/a/*b*/:async(b)=>/*c*/{} })',
			},
			{
				name: 'object property / computed method',
				code: '({ /*a*/["a"]/*b*/(b)/*c*/{} })',
				errors: [{
					messageId: 'preferArrowFunction',
				}],
				output: '({ /*a*/["a"]/*b*/:(b)=>/*c*/{} })',
			},

			// Class
			{
				name: 'class / method',
				code: '(class{ _/*a*/()/*b*/{} })',
				errors: [{
					messageId: 'preferArrowFunction',
				}],
				output: '(class{ _/*a*/=()=>/*b*/{} })',
				options: [{ classMethods: true }],
			},
			{
				name: 'class / async method',
				code: '(class{ async/*a*/_/*b*/()/*c*/{} })',
				errors: [{
					messageId: 'preferArrowFunction',
				}],
				output: '(class{ /*a*/_/*b*/=async()=>/*c*/{} })',
				options: [{ classMethods: true }],
			},
			{
				name: 'class / private method',
				code: '(class{ #_/*a*/()/*b*/{} })',
				errors: [{
					messageId: 'preferArrowFunction',
				}],
				output: '(class{ #_/*a*/=()=>/*b*/{} })',
				options: [{ classMethods: true }],
			},
			{
				name: 'class / static method',
				code: '(class{ static/*a*/_/*b*/()/*c*/{} })',
				errors: [{
					messageId: 'preferArrowFunction',
				}],
				output: '(class{ static/*a*/_/*b*/=()=>/*c*/{} })',
				options: [{ classMethods: true }],
			},
			{
				name: 'class / instance method not overloaded by static signature',
				code: '(class{ static a(b: string): void; static a(b: any){}; a(){} })',
				errors: [{
					messageId: 'preferArrowFunction',
				}],
				output: '(class{ static a(b: string): void; static a(b: any){}; a=()=>{} })',
				options: [{ classMethods: true }],
			},

			// Exports
			{
				name: 'named export / declaration ',
				code: 'export function a(b) {}',
				errors: [{
					messageId: 'preferArrowFunction',
				}],
				output: 'export const a= (b)=> {}',
			},
			{
				name: 'named export / declaration / async',
				code: 'export async function a(b) {}',
				errors: [{
					messageId: 'preferArrowFunction',
				}],
				output: 'export const a=async  (b)=> {}',
			},

			{
				name: 'default export / anonymous',
				code: 'export default function () {}',
				errors: [
					{ messageId: 'preferArrowFunction' },
				],
				output: 'export default  ()=> {}',
			},
			{
				name: 'default export / named ',
				code: 'export\ndefault/*a*/function/*b*/a/*c*/(b)/*d*/{}[]',
				errors: [{
					messageId: 'preferArrowFunction',
				}],
				output: '/*a*/const a=/*b*//*c*/(b)=>/*d*/{};export\ndefault a;[]',
			},

			// TypeScript
			{
				name: 'ts / declaration',
				code: 'async/*a*/function/*b*/foo/*c*/<b extends string>/*d*/(a:b)/*e*/:/*f*/void/*\ng*/{}',
				errors: [{
					messageId: 'preferArrowFunction',
				}],
				output: 'const foo=async/*a*//*b*//*c*/<b extends string>/*d*/(a:b)/*e*/:/*f*/void=>/*\ng*/{}',
			},
			{
				name: 'ts / expression / named',
				code: '(async/*a*/function/*b*/foo/*c*/<b extends string>/*d*/(a:b)/*e*/:/*f*/void/*\ng*/{})',
				errors: [{
					messageId: 'preferArrowFunction',
				}],
				output: '(async/*a*//*b*//*c*/<b extends string>/*d*/(a:b)/*e*/:/*f*/void=>/*\ng*/{})',
			},
			{
				name: 'expression / uses its parameter',
				code: 'a(function(b){ return b })',
				errors: [{
					messageId: 'preferArrowFunction',
				}],
				output: 'a((b)=>{ return b })',
			},
			{
				name: 'expression / named / uses its parameter',
				code: 'a(function c(b){ return b })',
				errors: [{
					messageId: 'preferArrowFunction',
				}],
				output: 'a( (b)=>{ return b })',
			},
			{
				name: 'object property / method / uses its parameter',
				code: '({ a(b){ return b } })',
				errors: [{
					messageId: 'preferArrowFunction',
				}],
				output: '({ a:(b)=>{ return b } })',
			},
			{
				name: 'class / method / uses its parameter',
				code: '(class{ a(b){ return b } })',
				options: [{ classMethods: true }],
				errors: [{
					messageId: 'preferArrowFunction',
				}],
				output: '(class{ a=(b)=>{ return b } })',
			},
			{
				name: 'class / method / type predicate is converted',
				code: '(class{ a(b: unknown): b is string { return true } })',
				options: [{ classMethods: true }],
				errors: [{
					messageId: 'preferArrowFunction',
				}],
				output: '(class{ a=(b: unknown): b is string=> { return true } })',
			},
			{
				name: 'ts / type predicate (non-asserting) is converted',
				code: 'function a(b: unknown): b is string { return true }',
				errors: [{
					messageId: 'preferArrowFunction',
				}],
				output: 'const a= (b: unknown): b is string=> { return true }',
			},
			{
				name: 'tsx / declaration / generic',
				code: 'function a<T>(b: T){}',
				filename: 'file.tsx',
				errors: [{
					messageId: 'preferArrowFunction',
				}],
				output: 'const a= <T,>(b: T)=>{}',
			},
			{
				name: 'tsx / expression / generic',
				code: 'a(function<T>(b: T){})',
				filename: 'file.tsx',
				errors: [{
					messageId: 'preferArrowFunction',
				}],
				output: 'a(<T,>(b: T)=>{})',
			},
			{
				name: 'tsx / constrained generic is unchanged',
				code: 'function a<T extends string>(b: T){}',
				filename: 'file.tsx',
				errors: [{
					messageId: 'preferArrowFunction',
				}],
				output: 'const a= <T extends string>(b: T)=>{}',
			},
			{
				name: 'ts / generic keeps type parameters',
				code: 'function a<T>(b: T){}',
				errors: [{
					messageId: 'preferArrowFunction',
				}],
				output: 'const a= <T>(b: T)=>{}',
			},
			{
				name: 'ts / expression / anonymous',
				code: '(async/*a*/function/*b*//*c*/<b extends string>/*d*/(a:b)/*e*/:/*f*/void/*\ng*/{})',
				errors: [{
					messageId: 'preferArrowFunction',
				}],
				output: '(async/*a*//*b*//*c*/<b extends string>/*d*/(a:b)/*e*/:/*f*/void=>/*\ng*/{})',
			},
		],
	});

	describe('options', () => {
		ruleTester.run('prefer-arrow-functions', preferArrowFunctions, {
			valid: [
				{
					name: 'objectMethods: false',
					code: '({ a(b){ return b } })',
					options: [{ objectMethods: false }],
				},
				{
					name: 'namedFunctionExpressions: false',
					code: 'a(function b(){})',
					options: [{ namedFunctionExpressions: false }],
				},
				{
					name: 'exportedFunctions: false / named export',
					code: 'export function a(){}',
					options: [{ exportedFunctions: false }],
				},
				{
					name: 'exportedFunctions: false / default export',
					code: 'export default function a(){}',
					options: [{ exportedFunctions: false }],
				},
				{
					name: 'exportedFunctions: false / anonymous default export',
					code: 'export default function(){}',
					options: [{ exportedFunctions: false }],
				},
				{
					name: 'exportedFunctions: false / export specifier',
					code: 'function a(){}export { a }',
					options: [{ exportedFunctions: false }],
				},
				{
					name: 'exportedFunctions: false / export default identifier',
					code: 'function a(){}export default a',
					options: [{ exportedFunctions: false }],
				},
				{
					name: 'allowedNames / declaration',
					code: 'function a(){}',
					options: [{ allowedNames: ['a'] }],
				},
				{
					name: 'allowedNames / variable',
					code: 'const a = function(){}',
					options: [{ allowedNames: ['a'] }],
				},
				{
					name: 'allowedNames / object method',
					code: '({ a(){} })',
					options: [{ allowedNames: ['a'] }],
				},
				{
					name: 'allowedNames / object property',
					code: '({ "a": function(){} })',
					options: [{ allowedNames: ['a'] }],
				},
				{
					name: 'allowedNames / class method',
					code: '(class{ ngOnInit(){} })',
					options: [{
						classMethods: true,
						allowedNames: ['ngOnInit'],
					}],
				},
				{
					name: 'allowedNames / private class method',
					code: '(class{ #a(){} })',
					options: [{
						classMethods: true,
						allowedNames: ['#a'],
					}],
				},
			],
			invalid: [
				{
					name: 'objectMethods: false still converts property values',
					code: '({ a: function(){} })',
					options: [{ objectMethods: false }],
					errors: [{ messageId: 'preferArrowFunction' }],
					output: '({ a: ()=>{} })',
				},
				{
					name: 'namedFunctionExpressions: false still converts anonymous expressions',
					code: 'a(function(){})',
					options: [{ namedFunctionExpressions: false }],
					errors: [{ messageId: 'preferArrowFunction' }],
					output: 'a(()=>{})',
				},
				{
					name: 'namedFunctionExpressions: false still converts methods',
					code: '({ a(){} })',
					options: [{ namedFunctionExpressions: false }],
					errors: [{ messageId: 'preferArrowFunction' }],
					output: '({ a:()=>{} })',
				},
				{
					name: 'exportedFunctions: false still converts local functions',
					code: 'function a(){}export const b = 1',
					options: [{ exportedFunctions: false }],
					errors: [{ messageId: 'preferArrowFunction' }],
					output: 'const a= ()=>{};export const b = 1',
				},
				{
					name: 'exportedFunctions: false still converts exported expressions',
					code: 'export const a = function(){}',
					options: [{ exportedFunctions: false }],
					errors: [{ messageId: 'preferArrowFunction' }],
					output: 'export const a = ()=>{}',
				},
				{
					name: 'allowedNames only matches exact names',
					code: 'function ab(){}',
					options: [{ allowedNames: ['a'] }],
					errors: [{ messageId: 'preferArrowFunction' }],
					output: 'const ab= ()=>{}',
				},
				{
					name: 'allowedNames does not match a computed key with the same text',
					code: '({ [a](){} })',
					options: [{ allowedNames: ['a'] }],
					errors: [{ messageId: 'preferArrowFunction' }],
					output: '({ [a]:()=>{} })',
				},
			],
		});
	});

	// JavaScript files use ESLint's parser and scope manager, which omit TypeScript-only properties
	describe('javascript parser', () => {
		EslintRuleTester.describe = describe;
		EslintRuleTester.it = test;
		const eslintRuleTester = new EslintRuleTester();

		eslintRuleTester.run('prefer-arrow-functions', preferArrowFunctions as unknown as Rule.RuleModule, {
			valid: [
				'a();function a(){}',
				'function A(){}new A()',
			],
			invalid: [
				{
					code: 'function a(){}\n(b)',
					errors: [{ messageId: 'preferArrowFunction' }],
					output: 'const a= ()=>{};\n(b)',
				},
				{
					code: '(class{ a(b){} })',
					options: [{ classMethods: true }],
					errors: [{ messageId: 'preferArrowFunction' }],
					output: '(class{ a=(b)=>{} })',
				},
			],
		});
	});
});
