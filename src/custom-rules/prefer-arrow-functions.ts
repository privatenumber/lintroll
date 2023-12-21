import type { TSESTree, TSESLint } from '@typescript-eslint/utils';
import { createRule } from './utils/create-rule.js';

type FunctionNode = TSESTree.FunctionDeclaration | TSESTree.FunctionExpression;

const getClosestInsertion = (
	node: TSESTree.Node,
) => {
	let currentNode: TSESTree.Node | undefined = node;
	while (currentNode) {
		const { type } = currentNode;

		if (type === 'BlockStatement') {
			return currentNode.body[0];
		}

		if (['ExpressionStatement', 'BlockStatement', 'Program'].includes(type)) {
			return currentNode;
		}
		currentNode = currentNode.parent;
	}
};

const findFirstReference = (
	sourceCode: TSESLint.SourceCode,
	node: TSESTree.Node,
) => {
	const [functionVariable] = sourceCode.getDeclaredVariables!(node);
	const [firstReference] = functionVariable.references;

	if (
		!firstReference

		// First reference comes after declaration
		|| node.range[0] < firstReference.identifier.range[0]
	) {
		return;
	}

	let firstReferenceScope = firstReference.from;

	if (firstReferenceScope === functionVariable.scope) {
		// console.log(firstReference.identifier);
		return getClosestInsertion(firstReference.identifier);
	}

	while (firstReferenceScope !== functionVariable.scope) {
		const { upper } = firstReferenceScope;
		if (!upper) {
			break;
		}
		firstReferenceScope = upper;
	}

	return getClosestInsertion(firstReferenceScope.block);
};

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
			const hasSuper = tokens.some(token => token.type === 'Keyword' && token.value === 'super');
			const hasNewIndex = tokens.findIndex(token => token.type === 'Keyword' && token.value === 'new');
			const hasNewTarget = (
				hasNewIndex !== -1
				&& (
					tokens[hasNewIndex + 1].type === 'Punctuator'
					&& tokens[hasNewIndex + 1].value === '.'
				)
				&& (
					tokens[hasNewIndex + 2].type === 'Identifier'
					&& tokens[hasNewIndex + 2].value === 'target'
				)
			);

			if (
				hasArguments
				|| hasThis
				|| hasSuper
				|| hasNewTarget
			) {
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
					return context.sourceCode.text.slice(
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
				return context.sourceCode.text.slice(
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

				return context.sourceCode.text.slice(previousToken.range[1], parenEnd.range[1]);
			};

			const getBodyString = () => {
				const previousToken = context.sourceCode.getTokenBefore(functionNode.body)!;
				return context.sourceCode.text.slice(previousToken.range[1], functionNode.body.range[1]);
			};

			const getTypeParameters = () => {
				if (!functionNode.typeParameters) {
					return '';
				}
				const previousToken = context.sourceCode.getTokenBefore(functionNode.typeParameters)!;
				return context.sourceCode.text.slice(
					previousToken.range[1],
					functionNode.typeParameters.range[1],
				);
			};

			const getReturnTypeParameters = () => {
				if (!functionNode.returnType) {
					return '';
				}
				const previousToken = context.sourceCode.getTokenBefore(functionNode.returnType)!;
				return context.sourceCode.text.slice(
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
					fix: (fixer) => {
						const hoistAboveNode = findFirstReference(context.sourceCode, node);
						const arrowCode = convertToArrowFunction(node, node.parent.type === 'ExportDefaultDeclaration');
						const nextToken = context.sourceCode.getTokenAfter(node, {
							includeComments: true,
						});
						const removeTextTill = (
							nextToken
								? nextToken.range[0]
								: context.sourceCode.text.length
						);
						const tokenDelimiter = context.sourceCode.text.slice(node.range[1], removeTextTill) || ';';
						const removeRange = [node.range[0], removeTextTill] as const;

						// Hoist above first usage
						if (hoistAboveNode) {
							return [
								fixer.insertTextBefore(hoistAboveNode, arrowCode + tokenDelimiter),
								fixer.removeRange(removeRange),
							];
						}

						const needsDelimiter = nextToken && !context.sourceCode.isSpaceBetween!(node, nextToken!);
						return fixer.replaceText(node, arrowCode + (needsDelimiter ? ';' : ''));
					},
				});
			},
		};
	},
});
