import type { Rule } from 'eslint';

export const preferArrowFunctions = {
	meta: {
		fixable: 'code',
	},
	create(context) {
		// console.log(context);

		const referencesArguments = () => {
			const scope = context.getScope();
			return scope.set.has('arguments');
		};

		function isSafeTransformation(node) {
			console.log(node);
		}

		return {
			FunctionDeclaration: (node) => {
				// console.log(node);
				const tokens = context.sourceCode.getTokens(node.body);
				const hasArguments = tokens.some(token => token.type === 'Identifier' && token.value === 'arguments');
				const hasThis = tokens.some(token => token.type === 'Keyword' && token.value === 'this');

				if (hasArguments || hasThis) {
					return;
				}

				context.report({
					node,
					message: 'Prefer arrow functions',

					// TODO: handle hoisting
					fix: fixer => fixer.replaceText(node, `const ${node.id.name} = () => {}`),
				});

				console.dir({
					node,
					code: context.sourceCode.getText(node),

					// tokens,

					hasArguments,
					hasThis,

					// refArgs: scope.set.has('arguments'),
					// refThis: scope.set.has('this'),
					// scope: scope,
				}, {
					depth: 5,
				});

				// const tokens = context.sourceCode.getTokens(node);
				// console.log({
				// 	tokens,
				// });
				// if (isSafeTransformation(node)) {
				// 	context.report({
				// 	fix: (fixer) =>
				// 		fixer.replaceText(node, writeArrowFunction(node) + ';'),
				// 	message: getMessage(node),
				// 	node,
				// 	});
				// }
			},

			// ':matches(ClassProperty, MethodDefinition, Property)[key.name][value.type="FunctionExpression"][kind!=/^(get|set)$/]': (node) => {
			// 	// const propName = node.key.name;
			// 	// const functionNode = node.value;
			// 	// if (
			// 	// isSafeTransformation(functionNode) &&
			// 	// (!isWithinClassBody(functionNode) || classPropertiesAllowed)
			// 	// ) {
			// 	// context.report({
			// 	// 	fix: (fixer) =>
			// 	// 	fixer.replaceText(
			// 	// 		node,
			// 	// 		isWithinClassBody(node)
			// 	// 		? `${propName} = ${writeArrowFunction(functionNode)};`
			// 	// 		: `${propName}: ${writeArrowFunction(functionNode)}`,
			// 	// 	),
			// 	// 	message: getMessage(functionNode),
			// 	// 	node: functionNode,
			// 	// });
			// 	// }
			// },
			// 'ArrowFunctionExpression[body.type!="BlockStatement"]': (node) => {
			// 	// console.log(node);

			// 	// console.log(context.sourceCode.getText(node));
			// 	// if (returnStyle === 'explicit' && isSafeTransformation(node)) {
			// 	// 	context.report({
			// 	// 	fix: (fixer) => fixer.replaceText(node, writeArrowFunction(node)),
			// 	// 	message: USE_EXPLICIT,
			// 	// 	node,
			// 	// 	});
			// 	// }
			// },
			// 'ArrowFunctionExpression[body.body.length=1][body.body.0.type="ReturnStatement"]': (node) => {
			// 	// if (returnStyle === 'implicit' && isSafeTransformation(node)) {
			// 	// context.report({
			// 	// 	fix: (fixer) => fixer.replaceText(node, writeArrowFunction(node)),
			// 	// 	message: USE_IMPLICIT,
			// 	// 	node,
			// 	// });
			// 	// }
			// },
			// 'FunctionExpression[parent.type!=/^(ClassProperty|MethodDefinition|Property)$/]': (node) => {
			// 	// if (isSafeTransformation(node)) {
			// 	// context.report({
			// 	// 	fix: (fixer) => fixer.replaceText(node, writeArrowFunction(node)),
			// 	// 	message: getMessage(node),
			// 	// 	node,
			// 	// });
			// 	// }
			// },
			// 'FunctionDeclaration[parent.type!="ExportDefaultDeclaration"]': (node) => {
			// 	// if (isSafeTransformation(node)) {
			// 	// 	context.report({
			// 	// 	fix: (fixer) =>
			// 	// 		fixer.replaceText(node, writeArrowConstant(node) + ';'),
			// 	// 	message: getMessage(node),
			// 	// 	node,
			// 	// 	});
			// 	// }
			// },
		};
	},
} satisfies Rule.RuleModule;
