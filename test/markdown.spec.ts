import path from 'path';
import { test, expect } from 'vitest';
import { eslint } from './utils/eslint';
import './utils/chai-contain-object';

const fixturePass = path.join(__dirname, 'fixtures/markdown/PASS.md');
const fixtureFail = path.join(__dirname, 'fixtures/markdown/fail.md');

test('Pass', async () => {
	const results = await eslint.lintFiles([fixturePass]);
	const { messages } = results[0];

	expect(messages.length).toBe(0);
});

test('Fail', async () => {
	const results = await eslint.lintFiles([fixtureFail]);
	const { messages } = results[0];

	expect(messages).to.containObject({
		ruleId: 'semi',
		messageId: 'extraSemi',
	});

	expect(messages).to.containObject({
		ruleId: 'comma-dangle',
		messageId: 'unexpected',
	});

	expect(messages).to.containObject({
		ruleId: 'no-multiple-empty-lines',
		messageId: 'blankEndOfFile',
	});
});
