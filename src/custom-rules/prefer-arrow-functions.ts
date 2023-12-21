import type { Rule } from 'eslint';
import type { TSESTree, TSESLint } from '@typescript-eslint/utils';
import { createRule } from './utils/create-rule.js';

const getTextRange = (
	sourceCode: TSESLint.SourceCode,
	start: number,
	end: number,
) => sourceCode.getText({ range: [start, end] } as TSESTree.Node);

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
		const getAsyncString = (
			node: TSESTree.FunctionDeclaration,
		) => {
			const firstToken = context.sourceCode.getFirstToken(node)!;
			if (
				firstToken.type === 'Identifier'
				&& firstToken.value === 'async'
			) {
				const nextToken = context.sourceCode.getTokenAfter(firstToken)!;
				return getTextRange(context.sourceCode, firstToken.range[0], nextToken.range[0]);
			}
			return '';
		};

		const getIdString = (
			node: TSESTree.FunctionDeclaration,
			excludeName: boolean,
		) => {
			if (!node.id) {
				return '';
			}
			const previousToken = context.sourceCode.getTokenBefore(node.id)!;
			return getTextRange(context.sourceCode, previousToken.range[1], excludeName ? node.id.range[0] : node.id.range[1]);
		};

		const getParameterString = (
			node: TSESTree.FunctionDeclaration,
		) => {
			const parenStart = context.sourceCode.getFirstToken(node, {
				filter: token => token.type === 'Punctuator' && token.value === '(',
			})!;
			const previousToken = context.sourceCode.getTokenBefore(parenStart)!;
			const parenEnd = context.sourceCode.getTokenAfter(parenStart, {
				filter: token => token.type === 'Punctuator' && token.value === ')',
			})!;

			return getTextRange(context.sourceCode, previousToken.range[1], parenEnd.range[1]);
		};

		const getBodyString = (
			node: TSESTree.FunctionDeclaration,
		) => {
			const previousToken = context.sourceCode.getTokenBefore(node.body)!;
			return getTextRange(context.sourceCode, previousToken.range[1], node.body.range[1]);
		};

		const getTypeParameters = (
			node: TSESTree.FunctionDeclaration,
		) => {
			if (!node.typeParameters) {
				return '';
			}
			const previousToken = context.sourceCode.getTokenBefore(node.typeParameters)!;
			return getTextRange(context.sourceCode, previousToken.range[1], node.typeParameters.range[1]);
		};

		const getReturnTypeParameters = (
			node: TSESTree.FunctionDeclaration,
		) => {
			if (!node.returnType) {
				return '';
			}
			const previousToken = context.sourceCode.getTokenBefore(node.returnType)!;
			return getTextRange(context.sourceCode, previousToken.range[1], node.returnType.range[1]);
		};

		const isConvertable = (
			node: TSESTree.FunctionDeclaration | TSESTree.FunctionExpression,
		) => {
			if (node.generator) {
				return false;
			}

			const tokens = context.sourceCode.getTokens(node.body);
			const hasArguments = tokens.some(token => token.type === 'Identifier' && token.value === 'arguments');
			const hasThis = tokens.some(token => token.type === 'Keyword' && token.value === 'this');

			if (hasArguments || hasThis) {
				return false;
			}

			return true;
		};

		return {
			FunctionExpression: (node) => {
				if (!isConvertable(node)) {
					return;
				}

				context.report({
					node,
					messageId: 'unexpectedFunctionDeclaration',
					fix: (fixer) => {
						const fixes = [];
						if (
							node.parent.type === 'Property'
							&& node.parent.method
						) {
							fixes.push(fixer.insertTextAfter(node.parent.key, ':'));
						}

						const data = {
							async: getAsyncString(node),
							name: getIdString(node, true),
							typeParameters: getTypeParameters(node),
							paren: getParameterString(node),
							returnType: getReturnTypeParameters(node),
							body: getBodyString(node),
						};

						fixes.push(fixer.replaceText(node, `${data.async}${data.name}${data.typeParameters}${data.paren}${data.returnType}=>${data.body}`));

						return fixes;
					},
				});
			},

			FunctionDeclaration: (node) => {
				if (!isConvertable(node)) {
					return;
				}

				const tokens = context.sourceCode.getTokens(node.body);
				const hasArguments = tokens.some(token => token.type === 'Identifier' && token.value === 'arguments');
				const hasThis = tokens.some(token => token.type === 'Keyword' && token.value === 'this');

				if (hasArguments || hasThis) {
					return;
				}

				context.report({
					node,
					messageId: 'unexpectedFunctionDeclaration',

					// TODO: handle hoisting
					fix: (fixer) => {
						if (node.parent.type === 'ExportDefaultDeclaration') {
							const data = {
								async: getAsyncString(node),
								name: getIdString(node, true),
								typeParameters: getTypeParameters(node),
								paren: getParameterString(node),
								returnType: getReturnTypeParameters(node),
								body: getBodyString(node),
							};

							return fixer.replaceText(node, `${data.async}${data.name}${data.typeParameters}${data.paren}${data.returnType}=>${data.body}`);
						}

						const data = {
							async: getAsyncString(node),
							name: getIdString(node),
							typeParameters: getTypeParameters(node),
							paren: getParameterString(node),
							returnType: getReturnTypeParameters(node),
							body: getBodyString(node),
						};

						return fixer.replaceText(node, `const${data.name}=${data.async}${data.typeParameters}${data.paren}${data.returnType}=>${data.body}`);
					},
				});
			},
		};
	},
}) as unknown as Rule.RuleModule;
