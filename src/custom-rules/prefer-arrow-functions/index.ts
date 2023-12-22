import type { TSESTree, TSESLint } from '@typescript-eslint/utils';
import { createRule } from '../utils/create-rule.js';

type FunctionNode = TSESTree.FunctionDeclaration | TSESTree.FunctionExpression;

const mergeFixes = (
	fixes: TSESLint.RuleFix[],
) => {

	for (let i = 0; i < fixes.length; i += 1) {
		const fix = fixes[i] as {
			text: string;
			range: TSESTree.Range;
		};

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

const isFunctionHoisted = (
	sourceCode: TSESLint.SourceCode,
	node: TSESTree.Node,
) => {
	const [functionVariable] = sourceCode.getDeclaredVariables!(node);
	const [firstReference] = functionVariable.references;
	return (
		firstReference
		&& node.range[0] > firstReference.identifier.range[0]
	);
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
				if (isFunctionHoisted(context.sourceCode, node)) {
					return false;
				}
			}

			const scope = context.sourceCode.getScope!(node);
			const hasArguments = scope.set.get('arguments')!.references.length > 0;
			return !hasArguments;
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
					},
				});
			},
		};
	},
});
