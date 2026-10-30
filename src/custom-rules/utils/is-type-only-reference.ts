import type { TSESTree, TSESLint } from '@typescript-eslint/utils';

const isInTypeQuery = (
	node: TSESTree.Node,
) => {
	let currentNode: TSESTree.Node | undefined = node;
	while (currentNode) {
		if (currentNode.type === 'TSTypeQuery') {
			return true;
		}
		currentNode = currentNode.parent;
	}
	return false;
};

/**
 * Type-only references have no runtime order.
 *
 * `isTypeReference` and `isValueReference` are only set by the TypeScript parser.
 * `typeof a` in a type position is marked as a value reference, so it is checked separately.
 */
export const isTypeOnlyReference = (
	reference: TSESLint.Scope.Reference,
) => (
	(reference.isTypeReference && !reference.isValueReference)
	|| isInTypeQuery(reference.identifier)
);
