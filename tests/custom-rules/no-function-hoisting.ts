import { describe, test } from 'manten';
import { RuleTester } from '@typescript-eslint/rule-tester';
import { RuleTester as EslintRuleTester, type Rule } from 'eslint';
import { noFunctionHoisting } from '../../src/custom-rules/no-function-hoisting/index.ts';

describe('no-function-hoisting', () => {
	RuleTester.describe = describe;
	RuleTester.it = test;
	RuleTester.afterAll = () => {};
	const ruleTester = new RuleTester();

	const error = (name: string) => ({
		messageId: 'noFunctionHoisting' as const,
		data: { name },
	});

	ruleTester.run('no-function-hoisting', noFunctionHoisting, {
		valid: [
			{
				name: 'declared before use',
				code: 'function a(){}a()',
			},
			{
				name: 'unused',
				code: 'function a(){}',
			},
			{
				name: 'recursion',
				code: 'function a(){a()}',
			},
			{
				name: 'mutual recursion',
				code: 'function a(){b()}\nfunction b(){a()}',
			},
			{
				name: 'mutual recursion / indirect',
				code: 'function a(){b()}\nfunction b(){c()}\nfunction c(){a()}',
			},
			{
				name: 'mutual recursion / overloaded function',
				code: 'function a(b: string): void;\nfunction a(b: unknown) { c() }\nfunction c() { a("") }',
			},
			{
				name: 'overloads / declared before use',
				code: 'function a(b: string): void;\nfunction a(b: unknown) {}\na("")',
			},
			{
				name: 'type-only reference',
				code: 'type T = typeof a;\nfunction a(){}',
			},
			{
				name: 'type-only reference / annotation',
				code: 'let b: typeof a;\nfunction a(){}',
			},
			{
				name: 'anonymous default export',
				code: 'export default function(){}',
			},
			{
				name: 'different scope',
				code: 'a();{function a(){}}',
			},
		],

		invalid: [
			{
				name: 'same line',
				code: 'a();function a(){}',
				errors: [error('a')],
				output: 'function a(){}a();',
			},
			{
				name: 'separate lines',
				code: 'a();\nfunction a(){}\n',
				errors: [error('a')],
				output: 'function a(){}\na();\n',
			},
			{
				name: 'moves leading comments',
				code: 'a();\n\n/**\n * Docs\n */\n// Note\nfunction a(){}\n',
				errors: [error('a')],
				output: '/**\n * Docs\n */\n// Note\nfunction a(){}\na();\n\n',
			},
			{
				name: 'inserts above the target statement comments',
				code: '/** Run */\nexport const run = () => a();\n\nfunction a(){}\n',
				errors: [error('a')],
				output: 'function a(){}\n/** Run */\nexport const run = () => a();\n\n',
			},
			{
				name: 'keeps directive comments attached to the target',
				code: '// @ts-expect-error Untyped\nb(a());\n\nfunction a(){}\n',
				errors: [error('a')],
				output: 'function a(){}\n// @ts-expect-error Untyped\nb(a());\n\n',
			},
			{
				name: 'moves trailing comments',
				code: 'a();\nfunction a(){} // Note\n',
				errors: [error('a')],
				output: 'function a(){} // Note\na();\n',
			},
			{
				name: 'preserves CRLF line breaks',
				code: 'a();\r\nfunction a(){}\r\n',
				errors: [error('a')],
				output: 'function a(){}\r\na();\r\n',
			},
			{
				name: 'keeps unrelated comments',
				code: 'a();\n// Unrelated\n\nfunction a(){}\n',
				errors: [error('a')],
				output: 'function a(){}\na();\n// Unrelated\n\n',
			},
			{
				name: 'preserves indentation',
				code: 'function b(){\n\ta();\n\tfunction a(){\n\t\treturn 1;\n\t}\n}\nb();',
				errors: [error('a')],
				output: 'function b(){\n\tfunction a(){\n\t\treturn 1;\n\t}\n\ta();\n}\nb();',
			},
			{
				name: 'reference in nested function',
				code: '(function(){a()});function a(){}',
				errors: [error('a')],
				output: 'function a(){}(function(){a()});',
			},
			{
				name: 'nested scope',
				code: '(function(){a();function a(){}})',
				errors: [error('a')],
				output: '(function(){function a(){}a();})',
			},
			{
				name: 'loop condition',
				code: 'while(a()){}function a(){}',
				errors: [error('a')],
				output: 'function a(){}while(a()){}',
			},
			{
				name: 'parenthesized',
				code: '(a());function a(){}',
				errors: [error('a')],
				output: 'function a(){}(a());',
			},
			{
				name: 'export specifier',
				code: 'export{a}\nfunction a(){}',
				errors: [error('a')],
				output: 'function a(){}\nexport{a}\n',
			},
			{
				name: 'exported declaration',
				code: 'a();\nexport function a(){}',
				errors: [error('a')],
				output: 'export function a(){}\na();\n',
			},
			{
				name: 'inserts before closest statement in the same scope',
				code: 'function x(){ if (y) { z() } if (a()) {} function a(){} }',
				errors: [error('a')],
				output: 'function x(){ if (y) { z() } function a(){}if (a()) {}  }',
			},
			{
				name: 'helper called from an earlier function',
				code: 'function a(){b()}\nfunction b(){}',
				errors: [error('b')],
				output: 'function b(){}\nfunction a(){b()}\n',
			},
			{
				name: 'dependency chain',
				code: 'b();function a(){}function b(){a();}',
				errors: [error('b')],
				output: [
					'function b(){a();}b();function a(){}',
					'function a(){}function b(){a();}b();',
				],
			},
			{
				name: 'mutual recursion / called before both',
				code: 'a();\nfunction a(){b()}\nfunction b(){a()}',
				errors: [error('a')],
				output: 'function a(){b()}\na();\nfunction b(){a()}',
			},
			{
				name: 'overloads / moves signatures with the implementation',
				code: 'a("");\n\n/** Docs */\nfunction a(b: string): void;\nfunction a(b: number): void;\nfunction a(b: unknown){}\n',
				errors: [error('a')],
				output: '/** Docs */\nfunction a(b: string): void;\nfunction a(b: number): void;\nfunction a(b: unknown){}\na("");\n\n',
			},
			{
				name: 'overloads / exported',
				code: 'a("");\nexport function a(b: string): void;\nexport function a(b: unknown){}\n',
				errors: [error('a')],
				output: 'export function a(b: string): void;\nexport function a(b: unknown){}\na("");\n',
			},
			{
				name: 'overloads / inserts above signatures of the function that uses it',
				code: 'function a(b: string): void;\nfunction a(b: unknown) { c() }\nfunction c() {}\n',
				errors: [error('c')],
				output: 'function c() {}\nfunction a(b: string): void;\nfunction a(b: unknown) { c() }\n',
			},
			{
				name: 'overloads / inserts above exported signatures',
				code: 'export function a(b: string): void;\nexport function a(b: unknown) { c() }\nfunction c() {}\n',
				errors: [error('c')],
				output: 'function c() {}\nexport function a(b: string): void;\nexport function a(b: unknown) { c() }\n',
			},
			{
				name: 'redeclaration is reported without a fix',
				code: 'a();\nfunction a(){}\nfunction a(){}',
				errors: [error('a'), error('a')],
			},
			{
				name: 'function and namespace merge is reported without a fix',
				code: 'a();\nfunction a(){}\nnamespace a { export const b = 1 }',
				errors: [error('a')],
			},
		],
	});

	describe('options', () => {
		ruleTester.run('no-function-hoisting', noFunctionHoisting, {
			valid: [
				{
					name: 'allowNamedExports',
					code: 'export { a }\nfunction a(){}',
					options: [{ allowNamedExports: true }],
				},
				{
					name: 'allowNamedExports / renamed',
					code: 'export { a as default }\nfunction a(){}',
					options: [{ allowNamedExports: true }],
				},
				{
					name: 'allowInFunctionBodies / arrow function',
					code: 'export const b = () => a();\nfunction a(){}',
					options: [{ allowInFunctionBodies: true }],
				},
				{
					name: 'allowInFunctionBodies / function declaration',
					code: 'function b(){ a() }\nfunction a(){}',
					options: [{ allowInFunctionBodies: true }],
				},
				{
					name: 'allowInFunctionBodies / class method',
					code: 'class B { c(){ a() } }\nfunction a(){}',
					options: [{ allowInFunctionBodies: true }],
				},
				{
					name: 'allowInFunctionBodies / async IIFE',
					code: '(async () => { a() })();\nfunction a(){}',
					options: [{ allowInFunctionBodies: true }],
				},
				{
					name: 'allowInFunctionBodies / nested in an IIFE',
					code: '(() => { return () => a() })();\nfunction a(){}',
					options: [{ allowInFunctionBodies: true }],
				},
			],
			invalid: [
				{
					name: 'allowNamedExports does not allow calls',
					code: 'a();\nexport { a }\nfunction a(){}\n',
					options: [{ allowNamedExports: true }],
					errors: [error('a')],
					output: 'function a(){}\na();\nexport { a }\n',
				},
				{
					name: 'allowInFunctionBodies / top-level call',
					code: 'a();\nfunction a(){}\n',
					options: [{ allowInFunctionBodies: true }],
					errors: [error('a')],
					output: 'function a(){}\na();\n',
				},
				{
					name: 'allowInFunctionBodies / IIFE',
					code: '(() => { a() })();\nfunction a(){}\n',
					options: [{ allowInFunctionBodies: true }],
					errors: [error('a')],
					output: 'function a(){}\n(() => { a() })();\n',
				},
				{
					name: 'allowInFunctionBodies / function expression IIFE',
					code: '(function(){ a() })();\nfunction a(){}\n',
					options: [{ allowInFunctionBodies: true }],
					errors: [error('a')],
					output: 'function a(){}\n(function(){ a() })();\n',
				},
				{
					name: 'allowInFunctionBodies / class static block',
					code: 'class B { static { a() } }\nfunction a(){}\n',
					options: [{ allowInFunctionBodies: true }],
					errors: [error('a')],
					output: 'function a(){}\nclass B { static { a() } }\n',
				},
				{
					name: 'allowInFunctionBodies / call argument',
					code: 'b(a());\nfunction a(){}\n',
					options: [{ allowInFunctionBodies: true }],
					errors: [error('a')],
					output: 'function a(){}\nb(a());\n',
				},
			],
		});
	});

	// JavaScript files use ESLint's parser and scope manager, which omit TypeScript-only properties
	describe('javascript parser', () => {
		EslintRuleTester.describe = describe;
		EslintRuleTester.it = test;
		const eslintRuleTester = new EslintRuleTester();

		eslintRuleTester.run('no-function-hoisting', noFunctionHoisting as unknown as Rule.RuleModule, {
			valid: [
				'function a(){}a()',
				'function a(){b()}\nfunction b(){a()}',
				{
					code: 'export const b = () => a();\nfunction a(){}',
					options: [{ allowInFunctionBodies: true }],
				},
				{
					code: 'export { a }\nfunction a(){}',
					options: [{ allowNamedExports: true }],
				},
			],
			invalid: [
				{
					code: 'a();\nfunction a(){}\n',
					errors: [error('a')],
					output: 'function a(){}\na();\n',
				},
				{
					code: 'export{a}\nfunction a(){}',
					errors: [error('a')],
					output: 'function a(){}\nexport{a}\n',
				},
				{
					code: '(() => { a() })();\nfunction a(){}\n',
					options: [{ allowInFunctionBodies: true }],
					errors: [error('a')],
					output: 'function a(){}\n(() => { a() })();\n',
				},
			],
		});
	});
});
