const path = require('path');
const { ESLint } = require('eslint');
require('./jest-setup.js');

const passFixture = path.join(__dirname, 'fixtures/vue/PassingComponent.vue');
const passSetupFixture = path.join(__dirname, 'fixtures/vue/PassSetup.vue');
const failFixture = path.join(__dirname, 'fixtures/vue/fail.vue');
const eslint = new ESLint({
	useEslintrc: false,
	baseConfig: {
		extends: path.join(__dirname, '../index.js'),
	},
});

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

	expect(messages).toContainObject({
		ruleId: 'unicorn/filename-case',
		message: 'Filename is not in pascal case. Rename it to `Fail.vue`.',
	});

	expect(messages).toContainObject({
		ruleId: 'vue/html-quotes',
		message: 'Expected to be enclosed by double quotes.',
	});

	expect(messages).toContainObject({
		ruleId: 'eol-last',
		messageId: 'missing',
	});
});
