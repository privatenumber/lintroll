import {
	describe, test, expect, onTestFail,
} from 'manten';
import { createFixture } from 'fs-fixture';
import { createEslint } from '../utils/eslint.ts';

describe('vue', () => {
	describe('Pass', () => {
		test('SFC', async () => {
			await using fixture = await createFixture({
				'PassingComponent.vue': `<template>
	<div class="some-class">
		Hello world
	</div>
</template>

<script>
export default {
	data: () => ({
		someData: 1,
	}),
};
</script>
`,
			});

			const results = await createEslint(fixture.path).lintFiles(
				fixture.getPath('PassingComponent.vue'),
			);

			const [result] = results;

			onTestFail(() => {
				console.dir(result);
				console.log(result.usedDeprecatedRules);
			});

			expect(result.errorCount).toBe(0);
			expect(result.warningCount).toBe(0);
			expect(result.usedDeprecatedRules.length).toBe(0);
		});

		test('SFC setup', async () => {
			await using fixture = await createFixture({
				'PassSetup.vue': `<script setup lang="ts">
const name: string = 'world';
</script>

<template>
	<div class="some-class">
		Hello {{ name }}
	</div>
</template>
`,
			});

			const results = await createEslint(fixture.path).lintFiles(
				fixture.getPath('PassSetup.vue'),
			);

			const [result] = results;

			onTestFail(() => {
				console.dir(result);
				console.log(result.usedDeprecatedRules);
			});

			expect(result.errorCount).toBe(0);
			expect(result.warningCount).toBe(0);
			expect(result.usedDeprecatedRules.length).toBe(0);
		});
	});

	describe('Fail', () => {
		test('SFC', async () => {
			await using fixture = await createFixture({
				// Not PascalCase, so unicorn/filename-case reports it
				'fail.vue': `<template>
	<!-- eslint-disable-next-line vue/max-attributes-per-line -->
	<div class='some-class'>
		Hello world
	</div>
</template>

<script>
export default {
	data() {
		return {
			someData: 1,
		};
	},
};
</script>`,
			});

			const [result] = await createEslint(fixture.path).lintFiles(
				fixture.getPath('fail.vue'),
			);

			onTestFail(() => {
				console.dir(result, {
					colors: true,
					depth: null,
					maxArrayLength: null,
				});
			});

			[
				expect.objectContaining({
					ruleId: 'unicorn/filename-case',
					message: 'Filename is not in pascal case. Rename it to `Fail.vue`.',
				}),
				expect.objectContaining({
					ruleId: 'vue/comment-directive',
					messageId: 'unusedRule',
				}),
				expect.objectContaining({
					ruleId: 'vue/html-quotes',
					message: 'Expected to be enclosed by double quotes.',
				}),
				expect.objectContaining({
					ruleId: '@stylistic/eol-last',
					messageId: 'missing',
				}),
			].forEach((matcher) => {
				expect(result.messages).toEqual(
					expect.arrayContaining([matcher]),
				);
			});
		});

		test('SFC setup', async () => {
			await using fixture = await createFixture({
				'Setup.vue': `<template>
	{{ someData }}
	{{ missingVar }}
</template>

<script setup lang="ts">
const someData = 1


defineProps<{ someData: number }>()

</script>
`,
			});

			const [result] = await createEslint(fixture.path).lintFiles(
				fixture.getPath('Setup.vue'),
			);

			onTestFail(() => {
				console.dir(result, {
					colors: true,
					depth: null,
					maxArrayLength: null,
				});
			});

			[
				expect.objectContaining({
					ruleId: 'vue/block-order',
					messageId: 'unexpected',
				}),

				expect.objectContaining({
					ruleId: 'vue/no-dupe-keys',
					messageId: 'duplicateKey',
				}),

				expect.objectContaining({
					ruleId: '@stylistic/semi',
					messageId: 'missingSemi',
				}),

				expect.objectContaining({
					ruleId: '@stylistic/no-multiple-empty-lines',
					messageId: 'consecutiveBlank',
				}),
			].forEach((matcher) => {
				expect(result.messages).toEqual(
					expect.arrayContaining([matcher]),
				);
			});
		});

		test('SFC parsing TS in setup with no lang="ts"', async () => {
			await using fixture = await createFixture({
				'SetupNoLangTs.vue': `<script setup>
defineProps<{ someData: number }>();
</script>

<template>
	{{ someData }}
	{{ missingVar }}
</template>
`,
			});

			const [result] = await createEslint(fixture.path).lintFiles(
				fixture.getPath('SetupNoLangTs.vue'),
			);

			onTestFail(() => {
				console.dir(result, {
					colors: true,
					depth: null,
					maxArrayLength: null,
				});
			});

			[
				expect.objectContaining({
					ruleId: null,
					fatal: true,
					line: 2,
					message: 'Parsing error: Unexpected token )',
				}),
			].forEach((matcher) => {
				expect(result.messages).toEqual(
					expect.arrayContaining([matcher]),
				);
			});
		});
	});
});
