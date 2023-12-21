import type { Rule } from 'eslint';
import type { TSESTree, TSESLint } from '@typescript-eslint/utils';
import { createRule } from './utils/create-rule.js';

const getTextRange = (
	sourceCode: TSESLint.SourceCode,
	start: number,
	end: number,
) => sourceCode.getText({ range: [start, end] } as TSESTree.Node);

// TODO: add option not to transform default exports of named functions as the name gets lost
// And really, we should be disabling default export instead
export const preferArrowFunctions = createRule({
	name: 'prefer-arrow-functions',
	meta: {
		messages: {
			unexpectedFunctionDeclaration: 'Unexpected function declaration',
		},
		type: 'suggestion',
		schema: [],
		docs: {
			description: 'Prefer arrow functions when possible',
		},
		fixable: 'code',
	},

	defaultOptions: ['warning'],

	create: (context) => {
		const isConvertable = (
			node: TSESTree.FunctionDeclaration | TSESTree.FunctionExpression,
		) => {
			// Generators cannot be arrow functions
			if (node.generator) {
				return false;
			}

			// Object/Class getters, setters, and constructors cannot be arrow functions
			const { parent } = node;
			if (
				(
					parent.type === 'Property'
					|| parent.type === 'MethodDefinition'
				)
				&& (
					parent.kind === 'set'
					|| parent.kind === 'get'
					|| parent.kind === 'constructor'
				)	
			) {
				return false;
			}

			// References to this or arguments cannot be in arrow functions
			const tokens = context.sourceCode.getTokens(node.body);
			const hasArguments = tokens.some(token => token.type === 'Identifier' && token.value === 'arguments');
			const hasThis = tokens.some(token => token.type === 'Keyword' && token.value === 'this');

			if (hasArguments || hasThis) {
				return false;
			}

			return true;
		};

		type FunctionNode = TSESTree.FunctionDeclaration | TSESTree.FunctionExpression;
		const convertToArrowFunction = (
			node: FunctionNode,
			noAssignment: boolean,
		) => {
			const getAsyncString = (
				node: FunctionNode,
			) => {
				const firstToken = context.sourceCode.getFirstToken(node)!;
				if (
					firstToken.type === 'Identifier'
					&& firstToken.value === 'async'
				) {
					const nextToken = context.sourceCode.getTokenAfter(firstToken)!;
					return getTextRange(context.sourceCode, firstToken.range[0], nextToken.range[0]);
				}
				return '';
			};
	
			const getIdString = (
				node: FunctionNode,
				excludeName: boolean,
			) => {
				if (!node.id) {
					return '';
				}
				const previousToken = context.sourceCode.getTokenBefore(node.id)!;
				return getTextRange(context.sourceCode, previousToken.range[1], excludeName ? node.id.range[0] : node.id.range[1]);
			};
	
			const getParameterString = (
				node: FunctionNode,
			) => {
				const parenStart = context.sourceCode.getFirstToken(node, {
					filter: token => token.type === 'Punctuator' && token.value === '(',
				})!;
				const previousToken = context.sourceCode.getTokenBefore(parenStart)!;
				const parenEnd = context.sourceCode.getTokenAfter(parenStart, {
					filter: token => token.type === 'Punctuator' && token.value === ')',
				})!;
	
				return getTextRange(context.sourceCode, previousToken.range[1], parenEnd.range[1]);
			};
	
			const getBodyString = (
				node: FunctionNode,
			) => {
				const previousToken = context.sourceCode.getTokenBefore(node.body)!;
				return getTextRange(context.sourceCode, previousToken.range[1], node.body.range[1]);
			};
	
			const getTypeParameters = (
				node: FunctionNode,
			) => {
				if (!node.typeParameters) {
					return '';
				}
				const previousToken = context.sourceCode.getTokenBefore(node.typeParameters)!;
				return getTextRange(context.sourceCode, previousToken.range[1], node.typeParameters.range[1]);
			};
	
			const getReturnTypeParameters = (
				node: FunctionNode,
			) => {
				if (!node.returnType) {
					return '';
				}
				const previousToken = context.sourceCode.getTokenBefore(node.returnType)!;
				return getTextRange(context.sourceCode, previousToken.range[1], node.returnType.range[1]);
			};

			const async = getAsyncString(node);
			const typeParameters = getTypeParameters(node);
			const name = getIdString(node, noAssignment);
			const paren = getParameterString(node);
			const returnType = getReturnTypeParameters(node);
			const body = getBodyString(node);

			return (
				(noAssignment ? `${async}${name}` : `const${name}=${async}`)
				+ `${typeParameters}${paren}${returnType}=>${body}`
			);
		};

		return {
			FunctionExpression: (node) => {
				if (!isConvertable(node)) {
					return;
				}

				context.report({
					node,
					messageId: 'unexpectedFunctionDeclaration',
					fix: (fixer) => {
						const fixes = [];

						if (
							// Class method
							(
								node.parent.type === 'MethodDefinition'
								&& node.parent.kind === 'method'
							)

							// Object method
							|| (
								node.parent.type === 'Property'
								&& node.parent.method
							)
						) {
							fixes.push(fixer.insertTextBefore(node.parent.value, ':'));
						}

						fixes.push(fixer.replaceText(node, convertToArrowFunction(node, true)));

						return fixes;
					},
				});
			},

			FunctionDeclaration: (node) => {
				if (!isConvertable(node)) {
					return;
				}

				const tokens = context.sourceCode.getTokens(node.body);
				const hasArguments = tokens.some(token => token.type === 'Identifier' && token.value === 'arguments');
				const hasThis = tokens.some(token => token.type === 'Keyword' && token.value === 'this');

				if (hasArguments || hasThis) {
					return;
				}

				context.report({
					node,
					messageId: 'unexpectedFunctionDeclaration',

					// TODO: handle hoisting
					fix: (fixer) => fixer.replaceText(
						node,
						convertToArrowFunction(node, node.parent.type === 'ExportDefaultDeclaration'),
					),
				});
			},
		};
	},
}) as unknown as Rule.RuleModule;
