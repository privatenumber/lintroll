import type { TSESTree, TSESLint } from '@typescript-eslint/utils';
import { createRule } from './utils/create-rule.js';

const getTextRange = (
	sourceCode: TSESLint.SourceCode,
	start: number,
	end: number,
) => sourceCode.getText({ range: [start, end] } as TSESTree.Node);

type FunctionNode = TSESTree.FunctionDeclaration | TSESTree.FunctionExpression;

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
			node: FunctionNode,
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

		const convertToArrowFunction = (
			functionNode: FunctionNode,
			noAssignment: boolean,
		) => {
			const getAsyncString = () => {
				const firstToken = context.sourceCode.getFirstToken(functionNode)!;
				if (
					firstToken.type === 'Identifier'
					&& firstToken.value === 'async'
				) {
					const nextToken = context.sourceCode.getTokenAfter(firstToken)!;
					return getTextRange(
						context.sourceCode,
						firstToken.range[0],
						nextToken.range[0],
					);
				}
				return '';
			};

			const getIdString = (
				excludeName: boolean,
			) => {
				if (!functionNode.id) {
					return '';
				}
				const previousToken = context.sourceCode.getTokenBefore(functionNode.id)!;
				return getTextRange(
					context.sourceCode,
					previousToken.range[1],
					excludeName ? functionNode.id.range[0] : functionNode.id.range[1],
				);
			};

			const getParameterString = () => {
				const parenStart = context.sourceCode.getFirstToken(functionNode, {
					filter: token => token.type === 'Punctuator' && token.value === '(',
				})!;
				const previousToken = context.sourceCode.getTokenBefore(parenStart)!;
				const parenEnd = context.sourceCode.getTokenAfter(parenStart, {
					filter: token => token.type === 'Punctuator' && token.value === ')',
				})!;

				return getTextRange(context.sourceCode, previousToken.range[1], parenEnd.range[1]);
			};

			const getBodyString = () => {
				const previousToken = context.sourceCode.getTokenBefore(functionNode.body)!;
				return getTextRange(context.sourceCode, previousToken.range[1], functionNode.body.range[1]);
			};

			const getTypeParameters = () => {
				if (!functionNode.typeParameters) {
					return '';
				}
				const previousToken = context.sourceCode.getTokenBefore(functionNode.typeParameters)!;
				return getTextRange(
					context.sourceCode,
					previousToken.range[1],
					functionNode.typeParameters.range[1],
				);
			};

			const getReturnTypeParameters = () => {
				if (!functionNode.returnType) {
					return '';
				}
				const previousToken = context.sourceCode.getTokenBefore(functionNode.returnType)!;
				return getTextRange(
					context.sourceCode,
					previousToken.range[1],
					functionNode.returnType.range[1],
				);
			};

			const async = getAsyncString();
			const typeParameters = getTypeParameters();
			const name = getIdString(noAssignment);
			const paren = getParameterString();
			const returnType = getReturnTypeParameters();
			const body = getBodyString();

			return `${noAssignment ? `${async}${name}` : `const${name}=${async}`}${typeParameters}${paren}${returnType}=>${body}`;
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
					fix: fixer => fixer.replaceText(
						node,
						convertToArrowFunction(node, node.parent.type === 'ExportDefaultDeclaration'),
					),
				});
			},
		};
	},
});
