import type { TSESTree, TSESLint } from '@typescript-eslint/utils';
import { createRule } from '../utils/create-rule.ts';
import { isTypeOnlyReference } from '../utils/is-type-only-reference.ts';

type SourceCode = Readonly<TSESLint.SourceCode>;

const isInside = (
	node: TSESTree.Node,
	container: TSESTree.Node,
) => container.range[0] <= node.range[0] && node.range[1] <= container.range[1];

// The statement that holds the declaration, including any export wrapper
const getStatement = (
	node: TSESTree.FunctionDeclaration,
): TSESTree.Node => (
	node.parent.type === 'ExportNamedDeclaration' || node.parent.type === 'ExportDefaultDeclaration'
		? node.parent
		: node
);

// The ancestor of `node` that sits directly in `container`'s statement list
const getStatementIn = (
	node: TSESTree.Node,
	container: TSESTree.Node,
) => {
	let currentNode: TSESTree.Node | undefined = node;
	while (currentNode && currentNode.parent !== container) {
		currentNode = currentNode.parent;
	}
	return currentNode;
};

const unwrapExport = (
	statement: TSESTree.Node,
) => (
	statement.type === 'ExportNamedDeclaration' || statement.type === 'ExportDefaultDeclaration'
		? statement.declaration
		: statement
);

const getStatementList = (
	container: TSESTree.Node,
): TSESTree.Node[] | undefined => {
	switch (container.type) {
		case 'Program':
		case 'BlockStatement':
		case 'StaticBlock':
		case 'TSModuleBlock': {
			return container.body;
		}
		case 'SwitchCase': {
			return container.consequent;
		}
		default: {
			return undefined;
		}
	}
};

const isOverloadSignature = (
	statement: TSESTree.Node,
	name: string,
) => {
	const declaration = unwrapExport(statement);
	return declaration?.type === 'TSDeclareFunction' && declaration.id?.name === name;
};

/**
 * TypeScript requires overload signatures to directly precede their implementation,
 * so a function with overloads is moved, and moved around, as one group
 */
const getOverloadGroupStart = (
	statement: TSESTree.Node,
	name: string,
) => {
	const statements = getStatementList(statement.parent!);
	if (!statements) {
		return statement;
	}

	let index = statements.indexOf(statement);
	while (index > 0 && isOverloadSignature(statements[index - 1], name)) {
		index -= 1;
	}
	return statements[index];
};

// Overload signatures share the implementation's variable, so overloaded functions are included
const isFunctionVariable = (
	variable: TSESLint.Scope.Variable,
) => (
	variable.defs.at(-1)?.node.type === 'FunctionDeclaration'
	&& variable.defs.slice(0, -1).every(definition => definition.node.type === 'TSDeclareFunction')
);

const getSiblingFunctions = (
	scope: TSESLint.Scope.Scope,
) => scope.variables.flatMap(variable => (
	isFunctionVariable(variable)
		? [{
			variable,
			node: variable.defs.at(-1)!.node as TSESTree.FunctionDeclaration,
		}]
		: []
));

/**
 * Whether `target` is reachable from `source` through calls between sibling
 * function declarations. Mutually recursive functions always reference each
 * other before one of them is declared, so no ordering can satisfy the rule.
 */
const isReachable = (
	source: TSESTree.FunctionDeclaration,
	target: TSESTree.FunctionDeclaration,
	siblings: ReturnType<typeof getSiblingFunctions>,
) => {
	const visited = new Set<TSESTree.Node>([source]);
	const queue = [source];

	while (queue.length > 0) {
		const current = queue.shift()!;
		for (const sibling of siblings) {
			if (
				!visited.has(sibling.node)
				&& sibling.variable.references.some(reference => isInside(reference.identifier, current))
			) {
				if (sibling.node === target) {
					return true;
				}

				visited.add(sibling.node);
				queue.push(sibling.node);
			}
		}
	}

	return false;
};

const getLineStart = (
	sourceCode: SourceCode,
	node: TSESTree.Node | TSESTree.Comment,
) => sourceCode.getIndexFromLoc({
	line: node.loc.start.line,
	column: 0,
});

const startsLine = (
	sourceCode: SourceCode,
	node: TSESTree.Node | TSESTree.Comment,
) => sourceCode.lines[node.loc.start.line - 1].slice(0, node.loc.start.column).trim() === '';

const endsLine = (
	sourceCode: SourceCode,
	node: TSESTree.Node | TSESTree.Comment,
) => sourceCode.lines[node.loc.end.line - 1].slice(node.loc.end.column).trim() === '';

// Comments after the statement on its last line, such as `function a() {} // Note`
const getTrailingComment = (
	sourceCode: SourceCode,
	statement: TSESTree.Node,
) => sourceCode.getCommentsAfter(statement).findLast(
	comment => comment.loc.start.line === statement.loc.end.line,
);

// Comments directly above the statement, such as JSDoc, move with it
const getLeadingComments = (
	sourceCode: SourceCode,
	statement: TSESTree.Node,
) => {
	const comments = sourceCode.getCommentsBefore(statement);
	const attached: TSESTree.Comment[] = [];
	let nextLine = statement.loc.start.line;

	for (let index = comments.length - 1; index >= 0; index -= 1) {
		const comment = comments[index];
		if (
			comment.loc.end.line < nextLine - 1
			|| !startsLine(sourceCode, comment)
		) {
			break;
		}

		attached.unshift(comment);
		nextLine = comment.loc.start.line;
	}

	return attached;
};

// Moves the statements from `first` to `last` above `target`
const createMoveFix = (
	sourceCode: SourceCode,
	first: TSESTree.Node,
	last: TSESTree.Node,
	target: TSESTree.Node,
): TSESLint.ReportFixFunction => (fixer) => {
	const start = getLeadingComments(sourceCode, first)[0] ?? first;
	const end = getTrailingComment(sourceCode, last) ?? last;
	const text = sourceCode.text.slice(start.range[0], end.range[1]);
	const isOwnLine = startsLine(sourceCode, start) && endsLine(sourceCode, end);
	const linebreak = sourceCode.text.includes('\r\n') ? '\r\n' : '\n';

	let removeRange: TSESTree.Range = [start.range[0], end.range[1]];
	if (isOwnLine) {
		const lineEnd = sourceCode.getIndexFromLoc({
			line: end.loc.end.line,
			column: sourceCode.lines[end.loc.end.line - 1].length,
		});

		// Include the line break so no blank line is left behind
		const hasLinebreak = sourceCode.text.startsWith(linebreak, lineEnd);
		removeRange = [
			getLineStart(sourceCode, start),
			lineEnd + (hasLinebreak ? linebreak.length : 0),
		];
	}

	// Insert above the target's own comments so they stay attached to it
	const targetStart = getLeadingComments(sourceCode, target)[0] ?? target;
	const insertion = (
		isOwnLine && startsLine(sourceCode, targetStart)
			? fixer.insertTextBeforeRange(
				[getLineStart(sourceCode, targetStart), getLineStart(sourceCode, targetStart)],
				`${sourceCode.lines[targetStart.loc.start.line - 1].slice(0, targetStart.loc.start.column)}${text}${linebreak}`,
			)
			: fixer.insertTextBefore(targetStart, text)
	);

	return [
		insertion,
		fixer.removeRange(removeRange),
	];
};

// Same as ESLint's `no-use-before-define`: only synchronous, non-generator IIFEs run immediately
const isImmediatelyInvoked = (
	node: TSESTree.Node,
) => (
	(node.type === 'FunctionExpression' || node.type === 'ArrowFunctionExpression')
	&& !node.async
	&& !node.generator
	&& node.parent.type === 'CallExpression'
	&& node.parent.callee === node
);

// A reference inside a function body only runs when that function is called
const isInDeferredFunction = (
	reference: TSESLint.Scope.Reference,
	declarationScope: TSESLint.Scope.Scope,
) => {
	let scope: TSESLint.Scope.Scope | null = reference.from;
	while (scope && scope !== declarationScope) {
		if (scope.type === 'function' && !isImmediatelyInvoked(scope.block)) {
			return true;
		}
		scope = scope.upper;
	}
	return false;
};

type Options = [{
	allowNamedExports?: boolean;
	allowInFunctionBodies?: boolean;
}];

export const noFunctionHoisting = createRule<Options, 'noFunctionHoisting'>({
	name: 'no-function-hoisting',
	meta: {
		messages: {
			noFunctionHoisting: 'Declare `{{ name }}` before it is used',
		},
		type: 'suggestion',
		schema: [{
			type: 'object',
			properties: {
				allowNamedExports: {
					type: 'boolean',
					description: 'Allow `export { name }` before the function is declared.',
				},
				allowInFunctionBodies: {
					type: 'boolean',
					description: 'Allow references inside function bodies, which only run when the function is called. References inside immediately invoked functions are still reported.',
				},
			},
			additionalProperties: false,
		}],
		docs: {
			description: 'Disallow using a function declaration before it is defined',
		},
		fixable: 'code',
	},

	defaultOptions: [{
		allowNamedExports: false,
		allowInFunctionBodies: false,
	}],

	create: (context, [{ allowNamedExports, allowInFunctionBodies }]) => ({
		FunctionDeclaration: (node) => {
			// Anonymous `export default function () {}` cannot be referenced
			if (!node.id) {
				return;
			}

			const { sourceCode } = context;
			const [functionVariable] = sourceCode.getDeclaredVariables(node);
			const siblings = getSiblingFunctions(functionVariable.scope);

			const earlierReferences = functionVariable.references.filter((reference) => {
				if (
					reference.identifier.range[0] > node.range[0]
					|| isTypeOnlyReference(reference)
					|| (allowNamedExports && reference.identifier.parent.type === 'ExportSpecifier')
					|| (allowInFunctionBodies && isInDeferredFunction(reference, functionVariable.scope))
				) {
					return false;
				}

				const enclosingSibling = siblings.find(
					sibling => sibling.node !== node && isInside(reference.identifier, sibling.node),
				);
				return !(enclosingSibling && isReachable(node, enclosingSibling.node, siblings));
			});

			if (earlierReferences.length === 0) {
				return;
			}

			const [firstReference] = earlierReferences.slice().sort(
				(a, b) => a.identifier.range[0] - b.identifier.range[0],
			);
			const statement = getStatement(node);
			const groupStart = getOverloadGroupStart(statement, node.id.name);
			const statements = getStatementList(statement.parent!);

			// Redeclarations (such as a `var` or a second implementation) cannot be moved safely,
			// so only a function and its directly preceding overload signatures are moved
			const signatureCount = functionVariable.defs.length - 1;
			const isMovable = (
				isFunctionVariable(functionVariable)
				&& statements !== undefined
				&& statements.indexOf(statement) - statements.indexOf(groupStart) === signatureCount
			);

			let target: TSESTree.Node | undefined = getStatementIn(
				firstReference.identifier,
				statement.parent!,
			);

			// Moving between another function's overload signatures and its implementation is invalid
			const targetDeclaration = target && unwrapExport(target);
			if (target && targetDeclaration?.type === 'FunctionDeclaration' && targetDeclaration.id) {
				target = getOverloadGroupStart(target, targetDeclaration.id.name);
			}

			context.report({
				node: node.id,
				messageId: 'noFunctionHoisting',
				data: {
					name: node.id.name,
				},
				fix: (
					target && isMovable
						? createMoveFix(sourceCode, groupStart, statement, target)
						: undefined
				),
			});
		},
	}),
});
