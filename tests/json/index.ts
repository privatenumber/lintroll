import {
	describe, test, expect, onTestFail,
} from 'manten';
import { createFixture } from 'fs-fixture';
import { createEslint } from '../utils/eslint.ts';

describe('json', () => {
	test('package.json', async () => {
		await using fixture = await createFixture({
			'package.json': `{
  "name": "some-package-json",
  "description": "",
  "version": "",
  "dependencies": {
    "b": "*",
    "a": "*",
    "c": "*"
  },
  "devDependencies": {
    "b": "*",
    "c": "*",
    "a": "*"
  }
}
`,
		});

		const [results] = await createEslint(fixture.path).lintFiles(
			fixture.getPath('package.json'),
		);

		expect(results.messages).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					ruleId: 'jsonc/sort-keys',
					message: "Expected object keys to be in specified order. 'description' should be after 'version'.",
				}),
				expect.objectContaining({
					ruleId: 'jsonc/sort-keys',
					message: "Expected object keys to be in ascending order. 'a' should be before 'b'.",
				}),
				expect.objectContaining({
					ruleId: 'jsonc/sort-keys',
					message: "Expected object keys to be in ascending order. 'b' should be after 'a'.",
				}),
				expect.objectContaining({
					ruleId: 'jsonc/indent',
					messageId: 'wrongIndentation',
				}),
			]),
		);
	});

	test('random.json', async () => {
		await using fixture = await createFixture({
			'random.json': `{
  "key": "value"
}
`,
		});

		const [result] = await createEslint(fixture.path).lintFiles(
			fixture.getPath('random.json'),
		);

		[
			expect.objectContaining({
				ruleId: 'jsonc/indent',
				messageId: 'wrongIndentation',
			}),
		].forEach((matcher) => {
			expect(result.messages).toEqual(
				expect.arrayContaining([matcher]),
			);
		});
	});

	test('renovate.json allows comments', async () => {
		await using fixture = await createFixture({
			'renovate.json': `{
	// Comment is allowed in renovate.json
	"$schema": "https://docs.renovatebot.com/renovate-schema.json",
	"extends": [
		"config:base"
	]
}
`,
		});

		const [result] = await createEslint(fixture.path).lintFiles(
			fixture.getPath('renovate.json'),
		);

		onTestFail(() => {
			console.log(result);
		});

		expect(result.errorCount).toBe(0);
		expect(result.warningCount).toBe(0);
	});
});
