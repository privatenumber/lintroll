import {
	describe, test, expect, onTestFail,
} from 'manten';
import { createFixture } from 'fs-fixture';
import { createEslint } from '../utils/eslint.ts';
import { failingComponentFixture, passingComponentFixture } from './fixtures/components.ts';

describe('react', () => {
	test('Pass cases', async () => {
		await using fixture = await createFixture(passingComponentFixture);

		const [result] = await createEslint(fixture.path).lintFiles(fixture.getPath('InputComponent.tsx'));

		onTestFail(() => {
			console.log(result);
			console.log(result.usedDeprecatedRules);
		});

		expect(result.errorCount).toBe(0);
		expect(result.warningCount).toBe(0);
		expect(result.usedDeprecatedRules.length).toBe(0);
	});

	// React 17+ with new JSX transform doesn't require importing React
	test('does not require React import for JSX', async () => {
		await using fixture = await createFixture(passingComponentFixture);

		const [result] = await createEslint(fixture.path).lintFiles(fixture.getPath('InputComponent.tsx'));

		onTestFail(() => {
			console.log(result.messages);
		});

		const hasReactScopeError = result.messages.some(
			message => message.ruleId === 'react/react-in-jsx-scope',
		);

		expect(hasReactScopeError).toBe(false);
	});

	test('Fail cases', async () => {
		await using fixture = await createFixture(failingComponentFixture);

		const [result] = await createEslint(fixture.path).lintFiles(fixture.getPath('fail.tsx'));

		[
			expect.objectContaining({
				ruleId: '@stylistic/jsx-quotes',
				messageId: 'unexpected',
			}),
			expect.objectContaining({
				ruleId: 'unicorn/filename-case',
				messageId: 'filename-case',
			}),
			expect.objectContaining({
				ruleId: 'react/prop-types',
				messageId: 'missingPropType',
			}),
			expect.objectContaining({
				ruleId: '@stylistic/jsx-max-props-per-line',
				messageId: 'newLine',
			}),
		].forEach((matcher) => {
			expect(result.messages).toEqual(
				expect.arrayContaining([matcher]),
			);
		});
	});
});
