import type { TSESTree, TSESLint } from '@typescript-eslint/utils';
import { createRule } from '../utils/create-rule.ts';
import { isTypeOnlyReference } from '../utils/is-type-only-reference.ts';

type FunctionNode = TSESTree.FunctionDeclaration | TSESTree.FunctionExpression;

type Options = [{
	classMethods?: boolean;
	objectMethods?: boolean;
	namedFunctionExpressions?: boolean;
	exportedFunctions?: boolean;
	allowedNames?: string[];
}];

const disallowedProperties = new Set([
	'prototype',
	'name',
	'length',
]);

// `const` is only valid where a statement list is allowed
const declarationContainers = new Set<string>([
	'Program',
	'BlockStatement',
	'StaticBlock',
	'SwitchCase',
	'TSModuleBlock',
	'ExportNamedDeclaration',
	'ExportDefaultDeclaration',
]);

// Tokens that would continue the expression on the previous line without a semicolon
const continuationTokenPattern = /^[([`+\-/<]/;

// Arrow functions have assignment-level precedence, so they can only appear
// unparenthesized where an AssignmentExpression is accepted
const acceptsAssignmentExpression = (
	node: TSESTree.FunctionExpression,
) => {
	const { parent } = node;
	switch (parent.type) {
		case 'VariableDeclarator': {
			return parent.init === node;
		}
		case 'AssignmentExpression':
		case 'AssignmentPattern': {
			return parent.right === node;
		}
		case 'Property':
		case 'PropertyDefinition': {
			return parent.value === node;
		}
		case 'CallExpression':
		case 'NewExpression': {
			return parent.arguments.includes(node);
		}
		case 'ConditionalExpression': {
			return parent.test !== node;
		}
		case 'ArrowFunctionExpression': {
			return parent.body === node;
		}
		case 'ArrayExpression':
		case 'ReturnStatement':
		case 'SpreadElement':
		case 'YieldExpression':
		case 'TemplateLiteral':
		case 'JSXExpressionContainer': {
			return true;
		}
		default: {
			return false;
		}
	}
};

const isConstructorReference = (
	node: TSESTree.Identifier | TSESTree.JSXIdentifier | TSESTree.FunctionExpression,
) => {
	const { parent } = node;
	return (
		(parent.type === 'NewExpression' && parent.callee === node)
		|| (
			parent.type === 'BinaryExpression'
			&& parent.operator === 'instanceof'
			&& parent.right === node
		)
		|| (
			(parent.type === 'ClassDeclaration' || parent.type === 'ClassExpression')
			&& parent.superClass === node
		)
	);
};

const isFunctionPropertyReference = (
	identifier: TSESTree.Identifier | TSESTree.JSXIdentifier,
) => {
	const { parent } = identifier;
	if (parent.type !== 'MemberExpression' || parent.object !== identifier) {
		return false;
	}

	const { property } = parent;
	if (parent.computed) {
		return (
			property.type === 'Literal'
			&& typeof property.value === 'string'
			&& disallowedProperties.has(property.value)
		);
	}

	return property.type === 'Identifier' && disallowedProperties.has(property.name);
};

// ESLint's default JavaScript parser does not set `decorators`
const hasDecorators = (
	node: { decorators?: TSESTree.Decorator[] },
) => (node.decorators?.length ?? 0) > 0;

// `m`, `'m'`, and `['m']` all name the same method
const getKeyName = (
	member: TSESTree.MethodDefinition | TSESTree.Property | TSESTree.PropertyDefinition,
	sourceCode: Readonly<TSESLint.SourceCode>,
) => {
	const { key } = member;
	if (key.type === 'Literal') {
		return String(key.value);
	}
	if (!member.computed && key.type === 'Identifier') {
		return key.name;
	}
	if (key.type === 'PrivateIdentifier') {
		return `#${key.name}`;
	}

	// A computed expression such as `[name]` is compared by its source text
	return `[${sourceCode.getText(key)}]`;
};

const isOverloadedMethod = (
	method: TSESTree.MethodDefinition,
	sourceCode: Readonly<TSESLint.SourceCode>,
) => {
	const key = getKeyName(method, sourceCode);
	return method.parent.body.some(
		element => (
			element.type === 'MethodDefinition'
			&& element.value.type === 'TSEmptyBodyFunctionExpression'
			&& element.static === method.static
			&& getKeyName(element, sourceCode) === key
		),
	);
};

// The name `allowedNames` matches: the function's own name, or the binding it is assigned to
const getFunctionName = (
	node: FunctionNode,
	sourceCode: Readonly<TSESLint.SourceCode>,
) => {
	if (node.id) {
		return node.id.name;
	}

	const { parent } = node;
	switch (parent.type) {
		case 'MethodDefinition':
		case 'Property':
		case 'PropertyDefinition': {
			return getKeyName(parent, sourceCode);
		}
		case 'VariableDeclarator': {
			return parent.id.type === 'Identifier' ? parent.id.name : undefined;
		}
		case 'AssignmentExpression': {
			return parent.left.type === 'Identifier' ? parent.left.name : undefined;
		}
		default: {
			return undefined;
		}
	}
};

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
		schema: [{
			type: 'object',
			properties: {
				classMethods: {
					type: 'boolean',
					description: 'Convert class methods to arrow function class fields. This moves the method from the prototype to each instance, which breaks subclass overrides and `super` calls.',
				},
				objectMethods: {
					type: 'boolean',
					description: 'Convert object shorthand methods such as `{ load() {} }` to arrow function properties.',
				},
				namedFunctionExpressions: {
					type: 'boolean',
					description: 'Convert named function expressions such as `callback(function onTick() {})`. The name is removed, so stack traces show the function as anonymous.',
				},
				exportedFunctions: {
					type: 'boolean',
					description: 'Convert exported function declarations. Unlike `const`, function declarations can be used before their module finishes running, which circular imports may rely on.',
				},
				allowedNames: {
					type: 'array',
					items: {
						type: 'string',
					},
					uniqueItems: true,
					description: 'Names of functions and methods to never convert.',
				},
			},
			additionalProperties: false,
		}],
		messages,
	},

	defaultOptions: [{
		classMethods: false,
		objectMethods: true,
		namedFunctionExpressions: true,
		exportedFunctions: true,
		allowedNames: [],
	}],

	create: (context, [{
		classMethods,
		objectMethods,
		namedFunctionExpressions,
		exportedFunctions,
		allowedNames,
	}]) => {
		const untransformableFunctions = new Set<FunctionNode>();
		const isTsx = context.filename.endsWith('.tsx');

		// Returns `undefined` when the declaration cannot become a `const` binding
		const getDeclarationReferences = (
			node: TSESTree.FunctionDeclaration,
		): TSESLint.Scope.Reference[] | undefined => {
			// Default export can have anonymous function declarations
			if (!node.id) {
				return [];
			}

			if (!declarationContainers.has(node.parent.type)) {
				return;
			}

			const [functionNameVariable] = context.sourceCode.getDeclaredVariables!(node);
			const { defs, references } = functionNameVariable;

			// Overloads, duplicate declarations, and `var` redeclarations
			// would become invalid `const` redeclarations
			if (defs.length > 1) {
				return;
			}

			// A `const` binding cannot be reassigned
			if (references.some(reference => reference.isWrite())) {
				return;
			}

			// A `const` binding cannot be used before its declaration
			const isHoisted = references.some(
				reference => (
					reference.identifier.range[0] < node.range[0]
					&& !isTypeOnlyReference(reference)
				),
			);
			if (isHoisted) {
				return;
			}

			return references;
		};

		const isInsideScope = (
			parentScope: TSESLint.Scope.Scope,
			childScope: TSESLint.Scope.Scope,
		) => {
			let currentScope: null | TSESLint.Scope.Scope = childScope;
			while (currentScope && currentScope !== parentScope) {
				currentScope = currentScope.upper;
			}

			return currentScope === parentScope;
		};

		// Returns `undefined` when the expression references itself
		const getExpressionReferences = (
			node: TSESTree.FunctionExpression,
			scope: TSESLint.Scope.Scope,
		): TSESLint.Scope.Reference[] | undefined => {
			const references: TSESLint.Scope.Reference[] = [];
			// Parameters are also declared by the function, so match the function's own name exactly
			const functionNameVariable = node.id && context.sourceCode.getDeclaredVariables!(node).find(
				variable => variable.identifiers[0] === node.id,
			);

			if (functionNameVariable) {
				const recursiveReference = functionNameVariable.references.some(
					({ from }) => isInsideScope(scope, from),
				);
				if (recursiveReference) {
					return;
				}

				references.push(...functionNameVariable.references);
			}

			if (node.parent.type === 'VariableDeclarator') {
				const [functionVariable] = context.sourceCode.getDeclaredVariables!(node.parent);

				// The first reference is the variable declaration itself
				references.push(...functionVariable.references.slice(1));
			}

			return references;
		};

		const isExported = (
			node: TSESTree.FunctionDeclaration,
		) => {
			if (
				node.parent.type === 'ExportNamedDeclaration'
				|| node.parent.type === 'ExportDefaultDeclaration'
			) {
				return true;
			}

			if (!node.id) {
				return false;
			}

			// `export { a }` and `export default a`
			const [functionNameVariable] = context.sourceCode.getDeclaredVariables!(node);
			return functionNameVariable.references.some(
				({ identifier }) => (
					identifier.parent.type === 'ExportSpecifier'
					|| identifier.parent.type === 'ExportDefaultDeclaration'
				),
			);
		};

		// Preferences from options, as opposed to conversions that would change behavior
		const isExcludedByOptions = (
			node: FunctionNode,
		) => {
			const { parent } = node;
			if (
				(parent.type === 'MethodDefinition' && !classMethods)
				|| (parent.type === 'Property' && parent.method && !objectMethods)
				|| (node.type === 'FunctionExpression' && node.id && !namedFunctionExpressions)
				|| (node.type === 'FunctionDeclaration' && !exportedFunctions && isExported(node))
			) {
				return true;
			}

			const name = getFunctionName(node, context.sourceCode);
			// `createRule` merges `defaultOptions`, so `allowedNames` is always set
			return name !== undefined && allowedNames!.includes(name);
		};

		const isConvertable = (
			node: FunctionNode,
		) => {
			// Generators cannot be arrow functions
			if (
				node.generator
				|| untransformableFunctions.has(node)
				|| isExcludedByOptions(node)
			) {
				return false;
			}

			const { parent } = node;
			if (parent.type === 'Property' || parent.type === 'MethodDefinition') {
				// Object/Class getters, setters, and constructors cannot be arrow functions
				if (['set', 'get', 'constructor'].includes(parent.kind)) {
					return false;
				}

				if (
					parent.type === 'MethodDefinition'
					&& (
						isOverloadedMethod(parent, context.sourceCode)

						// Method and parameter decorators cannot be applied to class fields
						|| hasDecorators(parent)
						|| node.params.some(hasDecorators)
					)
				) {
					return false;
				}
			}

			// Arrow functions cannot be constructed or extended
			if (node.type === 'FunctionExpression' && isConstructorReference(node)) {
				return false;
			}

			// TypeScript only applies `asserts` and `never` return types to control flow analysis
			// when the callee is a function declaration or an explicitly annotated variable
			const returnType = node.returnType?.typeAnnotation;
			if (
				(returnType?.type === 'TSTypePredicate' && returnType.asserts)
				|| returnType?.type === 'TSNeverKeyword'
			) {
				return false;
			}

			// Arrow functions cannot declare a TypeScript `this` parameter
			const [firstParameter] = node.params;
			if (firstParameter?.type === 'Identifier' && firstParameter.name === 'this') {
				return false;
			}

			const scope = context.sourceCode.getScope!(node);
			const hasArguments = scope.set.get('arguments')!.references.length > 0;
			if (hasArguments) {
				return false;
			}

			const references = (
				node.type === 'FunctionDeclaration'
					? getDeclarationReferences(node)
					: getExpressionReferences(node, scope)
			);

			return references !== undefined && !references.some(
				({ identifier }) => (
					isConstructorReference(identifier)
					|| isFunctionPropertyReference(identifier)
				),
			);
		};

		// In TSX, `<T>(` parses as a JSX element unless the type parameter list has a trailing comma
		const fixTsxTypeParameters = (
			node: FunctionNode,
			fixer: TSESLint.RuleFixer,
		) => {
			const typeParameters = node.typeParameters?.params;
			if (
				!isTsx
				|| typeParameters?.length !== 1
				|| typeParameters[0].constraint
			) {
				return [];
			}

			const closingToken = context.sourceCode.getLastToken(node.typeParameters!)!;
			const tokenBefore = context.sourceCode.getTokenBefore(closingToken)!;
			return tokenBefore.value === ',' ? [] : [fixer.insertTextAfter(typeParameters[0], ',')];
		};

		const getNearestFunction = (
			node: TSESTree.ThisExpression | TSESTree.Super | TSESTree.MetaProperty,
		): FunctionNode | undefined => {
			let scope: TSESLint.Scope.Scope | null = context.sourceCode.getScope!(node);

			while (scope) {
				// `this` in a class field or static block refers to the class, not an outer function
				if (
					scope.type === 'class-field-initializer'
					|| scope.type === 'class-static-block'
				) {
					return;
				}

				if (
					scope.block.type === 'FunctionDeclaration'
					|| scope.block.type === 'FunctionExpression'
				) {
					return scope.block;
				}

				scope = scope.upper;
			}
		};

		const markUntransformable = (
			node: TSESTree.ThisExpression | TSESTree.Super | TSESTree.MetaProperty,
		) => {
			const functionNode = getNearestFunction(node);
			if (functionNode) {
				untransformableFunctions.add(functionNode);
			}
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
			ThisExpression: markUntransformable,
			Super: markUntransformable,
			MetaProperty: (node) => {
				if (
					node.meta.name === 'new'
					&& node.property.name === 'target'
				) {
					markUntransformable(node);
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
							...fixTsxTypeParameters(node, fixer),
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

							if (!acceptsAssignmentExpression(node)) {
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
							...fixTsxTypeParameters(node, fixer),
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

						// Insert a semicolon if the next token would otherwise continue the expression
						const nextToken = context.sourceCode.getTokenAfter(node);
						const needsDelimiter = (
							nextToken
							&& nextToken.value !== ';'
							&& nextToken.value !== '}'
							&& (
								nextToken.loc.start.line === node.loc.end.line
								|| continuationTokenPattern.test(nextToken.value)
							)
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
