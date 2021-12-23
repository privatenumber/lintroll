import path from 'path';
import { test, expect } from 'vitest';
import { eslint } from './utils/eslint';
import './utils/chai-contain-object';

const packageJsonFixture = path.join(__dirname, 'fixtures/base/package.json');
const jsonFixture = path.join(__dirname, 'fixtures/base/random.json');

test('package.json', async () => {
	const results = await eslint.lintFiles([packageJsonFixture]);
	const { messages } = results[0];

	expect(messages).to.containObject({
		ruleId: 'jsonc/indent',
		messageId: 'wrongIndentation',
	});

	expect(messages).to.containObject({
		ruleId: 'jsonc/sort-keys',
		messageId: 'sortKeys',
	});
});

test('random.json', async () => {
	const results = await eslint.lintFiles([jsonFixture]);
	const { messages } = results[0];

	expect(messages).to.containObject({
		ruleId: 'jsonc/indent',
		messageId: 'wrongIndentation',
	});
});
