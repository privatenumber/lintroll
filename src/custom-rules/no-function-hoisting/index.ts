import type { TSESTree, TSESLint } from '@typescript-eslint/utils';
import { createRule } from '../utils/create-rule.js';

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
	functionVariable: TSESLint.Scope.Variable,
	firstReference: TSESLint.Scope.Reference,
) => {
	let firstReferenceScope = firstReference.from;

	// If the first reference is in the same scope as the function declaration
	// simply move it above the reference
	if (firstReferenceScope === functionVariable.scope) {
		return getClosestInsertion(firstReference.identifier);
	}

	// Otherwise, we need to traverse up the scope to see where the highest one was created
	// and insert it there
	while (firstReferenceScope !== functionVariable.scope) {
		const { upper } = firstReferenceScope;
		if (!upper) {
			break;
		}
		firstReferenceScope = upper;
	}

	return getClosestInsertion(firstReferenceScope.block);
};

export const noFunctionHoisting = createRule({
	name: 'prefer-arrow-functions',
	meta: {
		messages: {
			noFunctionHoisting: 'Unexpected function hoisting',
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
		return {
			'FunctionDeclaration': (node) => {
				const [functionVariable] = context.sourceCode.getDeclaredVariables!(node);
				const [firstReference] = functionVariable.references;

				if (
					!firstReference
			
					// First reference comes after declaration
					|| node.range[0] < firstReference.identifier.range[0]
				) {
					return;
				}

				const hoistAboveNode = findFirstReference(functionVariable, firstReference);
				if (!hoistAboveNode) {
					return;
				}

				context.report({
					node,
					messageId: 'noFunctionHoisting',
					fix: (fixer) => {
						const functionCode = context.sourceCode.getText(node);

						// Hoist above first usage
						return [
							fixer.insertTextBefore(hoistAboveNode, functionCode),
							fixer.remove(node),
						];
					},
				});
			},
		};
	},
});
