import type { TSESTree, TSESLint } from '@typescript-eslint/utils';
import { createRule } from '../utils/create-rule.js';

type FunctionNode = TSESTree.FunctionDeclaration | TSESTree.FunctionExpression;

const mergeFixes = (
	fixes: TSESLint.RuleFix[],
) => {

	for (let i = 0; i < fixes.length; i += 1) {
		const fix = fixes[i];

		for (let j = i + 1; j < fixes.length; j += 1) {
			const otherFix = fixes[j];

			const isOverlapping = (
				fix.range[0] <= otherFix.range[1]
				&& otherFix.range[0] <= fix.range[1]
			);

			if (isOverlapping) {
				const isMergable = fix.text === otherFix.text;
				if (isMergable) {
					fix.range[0] = Math.min(fix.range[0], otherFix.range[0]);
					fix.range[1] = Math.max(fix.range[1], otherFix.range[1]);
					fixes.splice(j, 1);
				}
			}
		}
	}

	return fixes;
};

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

		const getRange = (
			token: TSESTree.Token | TSESTree.Node,
			options: {
				leftUntil?: (token: TSESTree.Token) => boolean;
				rightUntil?: (token: TSESTree.Token) => boolean;
			}
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
					range[1] = nextToken.range[0];
				}
			}

			return range;
		}



		const untransformableFunctions = new Set<FunctionNode>();

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

			if (node.type === 'FunctionDeclaration') {
				// TODO: remove most of this logic to bare necessities
				const hoistAboveNode = findFirstReference(context.sourceCode, node);
				if (hoistAboveNode) {
					return false;
				}
			}

			const scope = context.sourceCode.getScope!(node);
			const hasArguments = scope.set.get('arguments')!.references.length > 0;
			return !hasArguments;
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
			'ThisExpression': (node) => {
				untransformableFunctions.add(getNearestFunction(node));
			},
			Super: (node) => {
				untransformableFunctions.add(getNearestFunction(node));
			},
			'MetaProperty': (node) => {
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
					messageId: 'unexpectedFunctionDeclaration',
					fix: (fixer) => {
						// console.log(node.id);

						const fixes = [];

						const { parent } = node;
						if (

							// Class method
							(
								parent.type === 'MethodDefinition'
								&& parent.kind === 'method'
							)

							// Object method
							|| (
								parent.type === 'Property'
								&& parent.method
							)
						) {
							fixes.push(fixer.insertTextBefore(parent.value, ':'));
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

						const parenEnd = context.sourceCode.getTokenBefore(node.body, {
							// filter: token => token.type === 'Punctuator' && token.value === ')',
						})!;
						fixes.push(fixer.insertTextAfter(parenEnd, '=>'));

						if (node.parent.type === 'LogicalExpression') {
							fixes.push(
								fixer.insertTextBefore(node, '('),
								fixer.insertTextAfter(node, ')'),	
							);
						}

						mergeFixes(fixes);

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
					messageId: 'unexpectedFunctionDeclaration',
					fix: (fixer) => {
						const fixes = [];

						const functionToken = context.sourceCode.getFirstToken(node, {
							filter: token => token.type === 'Keyword' && token.value === 'function',
						})!;

						fixes.push(fixer.remove(functionToken));

						const exportDefault = node.parent.type === 'ExportDefaultDeclaration';
						const functionNameRange = getRange(node.id!, {
							leftUntil: exportDefault ? Boolean : (token) => token.type === 'Keyword' && token.value === 'function',
						});

						const functionNameString = context.sourceCode.text.slice(functionNameRange[0], functionNameRange[1]);

						fixes.push(fixer.removeRange(functionNameRange));

						if (!exportDefault) {
							fixes.push(fixer.insertTextBefore(node, `const${functionNameString}=`));
						}

						const parenEnd = context.sourceCode.getTokenBefore(node.body)!;
						fixes.push(fixer.insertTextAfter(parenEnd, '=>'));

						const nextToken = context.sourceCode.getTokenAfter(node, {
							includeComments: true,
						});
						const needsDelimiter = nextToken && !context.sourceCode.isSpaceBetween!(node, nextToken!);

						if (needsDelimiter) {
							fixes.push(fixer.insertTextAfter(node, ';'));
						}

						return fixes;

						// const hoistAboveNode = findFirstReference(context.sourceCode, node);
						// const arrowCode = convertToArrowFunction(node, node.parent.type === 'ExportDefaultDeclaration');
						// const nextToken = context.sourceCode.getTokenAfter(node, {
						// 	includeComments: true,
						// });
						// const removeTextTill = (
						// 	nextToken
						// 		? nextToken.range[0]
						// 		: context.sourceCode.text.length
						// );
						// const tokenDelimiter = context.sourceCode.text.slice(node.range[1], removeTextTill) || ';';
						// const removeRange = [node.range[0], removeTextTill] as const;

						// // Hoist above first usage
						// if (hoistAboveNode) {
						// 	return [
						// 		fixer.insertTextBefore(hoistAboveNode, arrowCode + tokenDelimiter),
						// 		fixer.removeRange(removeRange),
						// 	];
						// }

						// const needsDelimiter = nextToken && !context.sourceCode.isSpaceBetween!(node, nextToken!);
						// return fixer.replaceText(node, arrowCode + (needsDelimiter ? ';' : ''));
					},
				});
			},
		};
	},
});
