/* eslint-disable @typescript-eslint/no-explicit-any -- ESLint rule API uses untyped AST nodes */
/**
 * pvtnbr/prefer-arrow-functions as an oxlint JS plugin rule.
 */
import type { ESLint } from 'eslint';

const messages = {
	preferArrowFunction: 'Prefer arrow function',
};

const disallowedProperties = new Set(['prototype', 'name', 'length']);

export default {
	meta: {
		name: 'pvtnbr',
	},
	rules: {
		'prefer-arrow-functions': {
			meta: {
				type: 'suggestion',
				docs: {
					description: 'Prefer arrow functions when possible',
				},
				fixable: 'code',
				schema: [],
				messages,
			},
			create(context: any) {
				const untransformableFunctions = new Set();

				const isConvertable = (node: any) => {
					if (node.generator || untransformableFunctions.has(node)) {
						return false;
					}

					const { parent } = node;
					if (
						(parent.type === 'Property' || parent.type === 'MethodDefinition')
						&& (parent.kind === 'set' || parent.kind === 'get' || parent.kind === 'constructor')
					) {
						return false;
					}

					const scope = context.sourceCode.getScope(node);
					const argumentsVariable = scope.set.get('arguments');
					if (argumentsVariable && argumentsVariable.references.length > 0) {
						return false;
					}

					let references: any[] = [];

					if (node.type === 'FunctionDeclaration' && node.id) {
						const declaredVariables = context.sourceCode.getDeclaredVariables(node);
						const functionNameVariable = declaredVariables[0];
						if (functionNameVariable) {
							const firstReference = functionNameVariable.references[0];
							const isHoisted = (
								firstReference
								&& node.range[0] > firstReference.identifier.range[0]
							);
							if (isHoisted) {
								return false;
							}
							references = functionNameVariable.references;
						}
					} else if (node.type === 'FunctionExpression') {
						const declaredVariables = context.sourceCode.getDeclaredVariables(node);
						const functionNameVariable = declaredVariables.find(
							(variable: any) => (
								variable.identifiers[0]
								&& variable.identifiers[0].parent.type === 'FunctionExpression'
							),
						);

						if (functionNameVariable) {
							const isInsideScope = (parentScope: any, childScope: any) => {
								let currentScope = childScope;
								while (currentScope && currentScope !== parentScope) {
									currentScope = currentScope.upper;
								}
								return currentScope === parentScope;
							};
							const recursiveReference = functionNameVariable.references.some(
								({ from }: any) => isInsideScope(scope, from),
							);
							if (recursiveReference) {
								return false;
							}
							references.push(...functionNameVariable.references);
						}

						if (node.parent.type === 'VariableDeclarator') {
							const parentDeclaredVariables = context.sourceCode.getDeclaredVariables(node.parent);
							const functionVariable = parentDeclaredVariables[0];
							if (functionVariable) {
								references.push(...functionVariable.references.slice(1));
							}
						}
					}

					for (const { identifier } of references) {
						if (
							identifier.parent.type === 'MemberExpression'
							&& identifier.parent.property.type === 'Identifier'
							&& disallowedProperties.has(identifier.parent.property.name)
						) {
							return false;
						}
					}

					return true;
				};

				const getNearestFunction = (node: any) => {
					let scope = context.sourceCode.getScope(node);
					while (
						scope
						&& scope.block.type !== 'FunctionDeclaration'
						&& scope.block.type !== 'FunctionExpression'
					) {
						scope = scope.upper;
					}
					return scope && scope.block;
				};

				const removeFunctionToken = (node: any, fixer: any) => {
					const functionToken = context.sourceCode.getFirstToken(node, {
						filter: (token: any) => token.type === 'Keyword' && token.value === 'function',
					});
					if (functionToken) {
						return [fixer.remove(functionToken)];
					}
					return [];
				};

				const insertArrow = (node: any, fixer: any) => {
					const parenEnd = context.sourceCode.getTokenBefore(node.body);
					return [fixer.insertTextAfter(parenEnd, '=>')];
				};

				const moveAsyncToken = (node: any, fixer: any) => {
					const asyncToken = context.sourceCode.getFirstToken(node.parent, {
						filter: (token: any) => token.type === 'Identifier' && token.value === 'async',
					});
					const getNodeAfter = context.sourceCode.getTokenAfter(asyncToken, {
						includeComments: true,
					});
					return [
						fixer.removeRange([asyncToken.range[0], getNodeAfter.range[0]]),
						fixer.insertTextBefore(node, 'async'),
					];
				};

				const wrapInParentheses = (node: any, fixer: any) => [
					fixer.insertTextBefore(node, '('),
					fixer.insertTextAfter(node, ')'),
				];

				return {
					ThisExpression(node: any) {
						const nearestFunction = getNearestFunction(node);
						if (nearestFunction) {
							untransformableFunctions.add(nearestFunction);
						}
					},
					Super(node: any) {
						const nearestFunction = getNearestFunction(node);
						if (nearestFunction) {
							untransformableFunctions.add(nearestFunction);
						}
					},
					MetaProperty(node: any) {
						if (node.meta.name === 'new' && node.property.name === 'target') {
							const nearestFunction = getNearestFunction(node);
							if (nearestFunction) {
								untransformableFunctions.add(nearestFunction);
							}
						}
					},
					'FunctionExpression:exit'(node: any) {
						if (!isConvertable(node)) {
							return;
						}

						context.report({
							node,
							messageId: 'preferArrowFunction',
							fix(fixer: any) {
								const fixes = [...insertArrow(node, fixer)];
								const { parent } = node;
								const isMethod = (
									(parent.type === 'Property' && parent.method)
									|| (parent.type === 'MethodDefinition' && parent.kind === 'method')
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
										const isWrapped = previousToken && previousToken.value === '('
											&& nextToken && nextToken.value === ')';
										if (!isWrapped) {
											fixes.push(...wrapInParentheses(node, fixer));
										}
									}
								}

								return fixes;
							},
						});
					},

					'FunctionDeclaration:exit'(node: any) {
						if (!isConvertable(node)) {
							return;
						}

						context.report({
							node,
							messageId: 'preferArrowFunction',
							fix(fixer: any) {
								const fixes = [
									...insertArrow(node, fixer),
									...removeFunctionToken(node, fixer),
								];

								if (node.id) {
									const functionNameString = context.sourceCode.getText(node.id);
									fixes.push(
										fixer.remove(node.id),
										fixer.insertTextBefore(node, `const ${functionNameString}=`),
									);
								}

								const { parent } = node;
								if (parent.type === 'ExportDefaultDeclaration' && node.id) {
									const exportDefaultStart = context.sourceCode.getFirstToken(parent, {
										filter: (token: any) => token.type === 'Keyword' && token.value === 'export',
									});
									const exportDefaultEnd = context.sourceCode.getTokenAfter(exportDefaultStart, {
										filter: (token: any) => token.type === 'Keyword' && token.value === 'default',
									});
									const exportDefaultRange = [
										exportDefaultStart.range[0],
										exportDefaultEnd.range[1],
									];
									const exportDefaultString = context.sourceCode.text.slice(...exportDefaultRange);
									fixes.push(
										fixer.removeRange(exportDefaultRange),
										fixer.insertTextAfter(node, `;${exportDefaultString} ${node.id.name}`),
									);
								}

								const nextToken = context.sourceCode.getTokenAfter(node, {
									includeComments: true,
								});
								const needsDelimiter = (
									nextToken
									&& !context.sourceCode.isSpaceBetween(node, nextToken)
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
		},
	},
} satisfies ESLint.Plugin;
/* eslint-enable @typescript-eslint/no-explicit-any */
