import type { TSESTree, TSESLint } from '@typescript-eslint/utils';
import { createRule } from '../utils/create-rule.js';

type FunctionNode = TSESTree.FunctionDeclaration | TSESTree.FunctionExpression;

type Options = [];

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
		schema: [],
		messages,
	},

	defaultOptions: [],

	create: (context) => {
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

			if (
				node.type === 'FunctionDeclaration'
				// Default export can have anonymous function declarations
				&& node.id
			) {
				const [functionNameVariable] = context.sourceCode.getDeclaredVariables!(node);
				const [firstReference] = functionNameVariable.references;
				const isHoisted = (
					firstReference
					&& node.range[0] > firstReference.identifier.range[0]
				);

				if (isHoisted) {
					return false;
				}

				references = functionNameVariable.references;
			} else if (node.type === 'FunctionExpression') {
				const functionNameVariable = context.sourceCode.getDeclaredVariables!(node).find(
					variable => variable.identifiers[0].parent.type === 'FunctionExpression',
				);

				if (functionNameVariable) {
					const recursiveReference = functionNameVariable.references.some(({ from }) => from === scope);
					if (recursiveReference) {
						return false;
					}

					references.push(...functionNameVariable.references);
				}

				if (node.parent.type === 'VariableDeclarator') {
					const [functionVariable] = context.sourceCode.getDeclaredVariables!(node.parent);

					// The first reference is the variable declaration itself
					references.push(...functionVariable.references.slice(1));
				}
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

		const removeFunctionToken = (
			node: FunctionNode,
			fixer: TSESLint.RuleFixer,
		) => {
			const functionToken = context.sourceCode.getFirstToken(node, {
				filter: token => token.type === 'Keyword' && token.value === 'function',
			});

			if (functionToken) {
				return [fixer.remove(functionToken)];
			}
			return [];
		};

		const insertArrow = (
			node: FunctionNode,
			fixer: TSESLint.RuleFixer,
		) => {
			const parenEnd = context.sourceCode.getTokenBefore(node.body)!;
			return [fixer.insertTextAfter(parenEnd, '=>')];
		};

		const moveAsyncToken = (
			node: FunctionNode,
			fixer: TSESLint.RuleFixer,
		) => {
			const asyncToken = context.sourceCode.getFirstToken(node.parent, {
				filter: token => token.type === 'Identifier' && token.value === 'async',
			});
			const getNodeAfter = context.sourceCode.getTokenAfter(asyncToken!, {
				includeComments: true,
			});
			return [
				fixer.removeRange([asyncToken!.range[0], getNodeAfter!.range[0]]),
				fixer.insertTextBefore(node, 'async'),
			];
		};

		const wrapInParentheses = (
			node: FunctionNode,
			fixer: TSESLint.RuleFixer,
		) => [
			fixer.insertTextBefore(node, '('),
			fixer.insertTextAfter(node, ')'),
		];

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
						const fixes: TSESLint.RuleFix[] = [
							...insertArrow(node, fixer),
						];

						const { parent } = node;
						const isMethod = (
							(
								// Object method
								parent.type === 'Property'
								&& parent.method
							) || (
								// Class method
								parent.type === 'MethodDefinition'
								&& parent.kind === 'method'
							)
						);

						if (isMethod) {
							fixes.push(fixer.insertTextBefore(
								node,
								parent.type === 'Property' ? ':' : '=',
							));

							if (node.async) {
								fixes.push(...moveAsyncToken(node, fixer));
							}
						} else {
							fixes.push(...removeFunctionToken(node, fixer));

							if (node.id) {
								fixes.push(fixer.remove(node.id));
							}

							if (parent.type === 'LogicalExpression') {
								const previousToken = context.sourceCode.getTokenBefore(node);
								const nextToken = context.sourceCode.getTokenAfter(node);

								if (!(
									previousToken?.value === '('
									&& nextToken?.value === ')'
								)) {
									fixes.push(...wrapInParentheses(node, fixer));
								}
							}
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
						const fixes: TSESLint.RuleFix[] = [
							...insertArrow(node, fixer),
							...removeFunctionToken(node, fixer),
						];

						// Default export can have unnamed function declarations
						if (node.id) {
							const functionNameString = context.sourceCode.getText(node.id);

							fixes.push(
								fixer.remove(node.id),
								fixer.insertTextBefore(node, `const ${functionNameString}=`),
							);
						}

						const { parent } = node;
						if (
							parent.type === 'ExportDefaultDeclaration'
							&& node.id
						) {
							const exportDefaultStart = context.sourceCode.getFirstToken(parent, {
								filter: token => token.type === 'Keyword' && token.value === 'export',
							})!;
							const exportDefaultEnd = context.sourceCode.getTokenAfter(exportDefaultStart, {
								filter: token => token.type === 'Keyword' && token.value === 'default',
							})!;
							const exportDefaultRange: TSESTree.Range = [
								exportDefaultStart.range[0],
								exportDefaultEnd.range[1],
							];
							const exportDefaultString = context.sourceCode.text.slice(...exportDefaultRange);
							fixes.push(
								fixer.removeRange(exportDefaultRange),
								fixer.insertTextAfter(
									node,
									`;${exportDefaultString} ${node.id.name}`,
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
