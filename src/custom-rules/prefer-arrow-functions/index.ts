import type { TSESTree, TSESLint } from '@typescript-eslint/utils';
import { createRule } from '../utils/create-rule.js';

type FunctionNode = TSESTree.FunctionDeclaration | TSESTree.FunctionExpression;

type Options = [{
	removeFunctionNames?: boolean;
}];

const messages = {
	preferArrowFunction: 'Prefer arrow function',
} as const;

type MessageIds = keyof typeof messages;

export const preferArrowFunctions = createRule<Options, MessageIds>({
	name: 'prefer-arrow-functions',
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Prefer arrow functions when possible',
		},
		fixable: 'code',
		schema: [
			{
				type: 'object',
				additionalProperties: false,
				properties: {
					/**
					 * Sometimes transformation removes the function names
					 * For example:
					 * export default function a() {}
					 *
					 * Becomes:
					 * export default () => {}
					 */
					removeFunctionNames: {
						type: 'boolean',
					},
				},
			},
		],
		messages,
	},

	defaultOptions: [{
		removeFunctionNames: false,
	}],

	create: (context) => {
		const getRange = (
			token: TSESTree.Token | TSESTree.Node,
			options: {
				leftUntil?: (token: TSESTree.Token) => boolean;
				rightUntil?: (token: TSESTree.Token) => boolean;
			},
		) => {
			const range = token.range.slice() as TSESTree.Range;

			if (options.leftUntil) {
				const previousToken = context.sourceCode.getTokenBefore(token, {
					includeComments: true,
					filter: options.leftUntil,
				});
				if (previousToken) {
					range[0] = previousToken.range[1];
				}
			}

			if (options.rightUntil) {
				const nextToken = context.sourceCode.getTokenAfter(token, {
					includeComments: true,
					filter: options.rightUntil,
				});
				if (nextToken) {
					range[1] = nextToken.range[options.inclusive ? 1 : 0];
				}
			}

			return range;
		};

		const untransformableFunctions = new Set<FunctionNode>();

		const disallowedProperties = [
			'prototype',
			'name',
			'length',
		] as const;

		const isConvertable = (
			node: FunctionNode,
		) => {
			// Generators cannot be arrow functions
			if (
				node.generator
				|| untransformableFunctions.has(node)
			) {
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

			const scope = context.sourceCode.getScope!(node);
			const hasArguments = scope.set.get('arguments')!.references.length > 0;
			if (hasArguments) {
				return false;
			}

			let references: TSESLint.Scope.Reference[] = [];

			if (node.type === 'FunctionDeclaration') {
				const [functionVariable] = context.sourceCode.getDeclaredVariables!(node);
				const [firstReference] = functionVariable.references;
				const isHoisted = (
					firstReference
					&& node.range[0] > firstReference.identifier.range[0]
				);

				if (isHoisted) {
					return false;
				}

				references = functionVariable.references;
			} else if (node.type === 'FunctionExpression' && node.parent.type === 'VariableDeclarator') {
				const [functionVariable] = context.sourceCode.getDeclaredVariables!(node.parent);

				// The first reference is the variable declaration itself
				references = functionVariable.references.slice(1);
			}

			for (const { identifier } of references) {
				if (
					identifier.parent.type === 'MemberExpression'
					&& identifier.parent.property.type === 'Identifier'
					&& disallowedProperties.includes(identifier.parent.property.name)
				) {
					return false;
				}
			}

			return true;
		};

		const getNearestFunction = (
			node: TSESTree.ThisExpression | TSESTree.Super | TSESTree.MetaProperty,
		): FunctionNode => {
			let scope = context.sourceCode.getScope!(node);

			while (
				scope
				&& scope.block.type !== 'FunctionDeclaration'
				&& scope.block.type !== 'FunctionExpression'
			) {
				scope = scope.upper!;
			}

			return scope?.block as FunctionNode;
		};

		return {
			ThisExpression: (node) => {
				untransformableFunctions.add(getNearestFunction(node));
			},
			Super: (node) => {
				untransformableFunctions.add(getNearestFunction(node));
			},
			MetaProperty: (node) => {
				if (
					node.meta.name === 'new'
					&& node.property.name === 'target'
				) {
					untransformableFunctions.add(getNearestFunction(node));
				}
			},
			'FunctionExpression:exit': (node) => {
				if (!isConvertable(node)) {
					return;
				}

				context.report({
					node,
					messageId: 'preferArrowFunction',
					fix: (fixer) => {
						const fixes = [];

						const { parent } = node;
						if (
							// Object method
							parent.type === 'Property'
							&& parent.method
						) {
							fixes.push(fixer.insertTextBefore(node, ':'));

							if (node.async) {
								const asyncToken = context.sourceCode.getFirstToken(parent, {
									filter: token => token.type === 'Identifier' && token.value === 'async',
								});
								fixes.push(
									fixer.remove(asyncToken!),
									fixer.insertTextBefore(node, 'async'),
								);
							}
						} else if (
							// Class method
							parent.type === 'MethodDefinition'
							&& parent.kind === 'method'
						) {
							fixes.push(fixer.insertTextBefore(node, '='));
						} else {
							const functionToken = context.sourceCode.getFirstToken(node, {
								filter: token => token.type === 'Keyword' && token.value === 'function',
							});

							if (functionToken) {
								const functionTokenRange = getRange(functionToken, {
									rightUntil: Boolean, // Until first comment
								});

								fixes.push(fixer.removeRange(functionTokenRange));
							}
						}

						if (node.id) {
							const functionNameRange = getRange(node.id!, {
								leftUntil: Boolean, // Until first comment
							});
							fixes.push(fixer.removeRange(functionNameRange));
						}

						const parenEnd = context.sourceCode.getTokenBefore(node.body)!;
						fixes.push(fixer.insertTextAfter(parenEnd, '=>'));

						if (node.parent.type === 'LogicalExpression') {
							fixes.push(
								fixer.insertTextBefore(node, '('),
								fixer.insertTextAfter(node, ')'),
							);
						}

						return fixes;
					},
				});
			},

			'FunctionDeclaration:exit': (node) => {
				if (!isConvertable(node)) {
					return;
				}

				context.report({
					node,
					messageId: 'preferArrowFunction',
					fix: (fixer) => {
						const fixes = [];

						const functionToken = context.sourceCode.getFirstToken(node, {
							filter: token => token.type === 'Keyword' && token.value === 'function',
						})!;

						fixes.push(fixer.remove(functionToken));

						const functionNameRange = getRange(node.id!, {
							leftUntil: token => token.type === 'Keyword' && token.value === 'function',
						});

						const functionNameString = context.sourceCode.text.slice(
							functionNameRange[0],
							functionNameRange[1],
						);

						fixes.push(
							fixer.removeRange(functionNameRange),
							fixer.insertTextBefore(node, `const${functionNameString}=`),
						);

						// Insert arrow
						const parenEnd = context.sourceCode.getTokenBefore(node.body)!;
						fixes.push(fixer.insertTextAfter(parenEnd, '=>'));

						if (node.parent.type === 'ExportDefaultDeclaration') {
							const { parent } = node;
							const range: TSESTree.Range = [parent.range[0], node.range[0]];

							fixes.push(
								fixer.removeRange(range),
								fixer.insertTextAfter(
									node,
									`;${context.sourceCode.text.slice(range[0], range[1])}${node.id!.name}`,
								),
							);
						}

						// Insert semicolon if necessary
						const nextToken = context.sourceCode.getTokenAfter(node, {
							includeComments: true,
						});
						const needsDelimiter = (
							nextToken
							&& !context.sourceCode.isSpaceBetween!(node, nextToken!)
						);

						if (needsDelimiter) {
							fixes.push(fixer.insertTextAfter(node, ';'));
						}

						return fixes;
					},
				});
			},
		};
	},
});
