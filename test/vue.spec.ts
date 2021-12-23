import path from 'path';
import { test, expect } from 'vitest';
import { eslint } from './utils/eslint';
import './utils/chai-contain-object';

const passFixture = path.join(__dirname, 'fixtures/vue/PassingComponent.vue');
const passSetupFixture = path.join(__dirname, 'fixtures/vue/PassSetup.vue');
const failFixture = path.join(__dirname, 'fixtures/vue/fail.vue');

test('Pass cases', async () => {
	const results = await eslint.lintFiles([
		passFixture,
		passSetupFixture,
	]);
	const [result] = results;

	expect(result.errorCount).toBe(0);
	expect(result.warningCount).toBe(0);
	expect(result.usedDeprecatedRules.length).toBe(0);
});

test('Fail cases', async () => {
	const results = await eslint.lintFiles([failFixture]);
	const { messages } = results[0];

	expect(messages).to.containObject({
		ruleId: 'unicorn/filename-case',
		message: 'Filename is not in pascal case. Rename it to `Fail.vue`.',
	});

	expect(messages).to.containObject({
		ruleId: 'vue/html-quotes',
		message: 'Expected to be enclosed by double quotes.',
	});

	expect(messages).to.containObject({
		ruleId: 'eol-last',
		messageId: 'missing',
	});
});
